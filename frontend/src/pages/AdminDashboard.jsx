import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock3, Wrench, CheckCircle2, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminStatCard from '../components/admin/AdminStatCard';
import { getAdminStats } from '../services/adminApi';

const AdminDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data.data.stats);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <AdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="md:ml-72">
        <AdminNavbar title="Dashboard" onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-xl shadow-indigo-950/30"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Operations Hub</p>
            <h2 className="text-2xl font-semibold mt-2">Civic Issue Control Center</h2>
            <p className="text-indigo-100 mt-1 text-sm">
              Monitor complaint flows, progress states, and response velocity from one place.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <AdminStatCard
              icon={FileText}
              label="Total Complaints"
              value={stats.totalComplaints}
              color="bg-gradient-to-br from-indigo-500 to-indigo-600"
              onClick={() => navigate('/admin/complaints')}
            />
            <AdminStatCard
              icon={Clock3}
              label="Pending Complaints"
              value={stats.pendingComplaints}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
              onClick={() => navigate('/admin/complaints?status=Pending')}
            />
            <AdminStatCard
              icon={Wrench}
              label="Complaints In Progress"
              value={stats.inProgressComplaints}
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
              onClick={() => navigate('/admin/complaints?status=In%20Progress')}
            />
            <AdminStatCard
              icon={CheckCircle2}
              label="Resolved Complaints"
              value={stats.resolvedComplaints}
              color="bg-gradient-to-br from-emerald-500 to-green-500"
              onClick={() => navigate('/admin/complaints?status=Completed')}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/complaints')}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
            >
              Open Complaints Manager
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 transition"
            >
              View Users
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/analytics')}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Open Analytics
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Users</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <UsersRound className="text-indigo-300" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-400">Registered citizens</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Resolution Rate</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {stats.totalComplaints > 0
                  ? `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%`
                  : '0%'}
              </p>
              <p className="text-sm text-slate-400 mt-1">Completed complaints out of total reported issues</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
