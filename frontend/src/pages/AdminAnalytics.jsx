import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { getAdminStats } from '../services/adminApi';

const AdminAnalytics = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalUsers: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data.data.stats);
      } catch (error) {
        toast.error('Failed to load analytics');
      }
    };

    fetchStats();
  }, []);

  const resolutionRate =
    stats.totalComplaints > 0
      ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
      : 0;

  const inFlightRate =
    stats.totalComplaints > 0
      ? Math.round(((stats.pendingComplaints + stats.inProgressComplaints) / stats.totalComplaints) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <AdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="md:ml-72">
        <AdminNavbar title="Analytics" onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Resolution Rate</p>
              <p className="text-3xl font-semibold text-white mt-2">{resolutionRate}%</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Active Workload</p>
              <p className="text-3xl font-semibold text-white mt-2">{inFlightRate}%</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Users / Complaints</p>
              <p className="text-3xl font-semibold text-white mt-2">
                {stats.totalComplaints > 0 ? (stats.totalUsers / stats.totalComplaints).toFixed(2) : '0.00'}
              </p>
            </div>
          </motion.div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/complaints?status=Pending')}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
            >
              View Pending Complaints
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/complaints?status=In%20Progress')}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition"
            >
              View In Progress Complaints
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/complaints?status=Completed')}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
            >
              View Completed Complaints
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
