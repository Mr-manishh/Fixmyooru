import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import ComplaintTable from '../components/admin/ComplaintTable';
import { getAdminComplaints, updateAdminComplaint } from '../services/adminApi';

const statusFilters = ['All', 'Pending', 'In Progress', 'Completed'];

const AdminComplaints = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = statusFilters.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : 'All';
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(statusFromUrl);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', order: 'desc' });

  const fetchComplaints = async (nextSort = sortConfig, nextStatus = activeStatus) => {
    try {
      setLoading(true);
      const res = await getAdminComplaints({
        sortBy: nextSort.sortBy,
        order: nextSort.order,
        status: nextStatus,
      });
      setComplaints(res.data.data.complaints);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveStatus(statusFromUrl);
    fetchComplaints(sortConfig, statusFromUrl);
  }, [statusFromUrl]);

  const onSort = (column) => {
    const nextSort = {
      sortBy: column,
      order: sortConfig.sortBy === column && sortConfig.order === 'asc' ? 'desc' : 'asc',
    };
    setSortConfig(nextSort);
    fetchComplaints(nextSort, activeStatus);
  };

  const onStatusFilter = (status) => {
    setSearchParams(status === 'All' ? {} : { status });
  };

  const onStatusUpdate = async (id, title, status) => {
    try {
      setLoading(true);
      const message = `Your complaint regarding ${title} is now ${status}.`;
      await updateAdminComplaint(id, { status, message });
      toast.success('Complaint status updated and user notified');
      await fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setLoading(false);
    }
  };

  const totalCount = useMemo(() => complaints.length, [complaints]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <AdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="md:ml-72">
        <AdminNavbar title="Complaints Management" onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">All User Complaints</h2>
              <p className="text-sm text-slate-400 mt-1">
                {totalCount} complaints loaded. Sort and update statuses from the table below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition border ${
                    activeStatus === status
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          <ComplaintTable
            complaints={complaints}
            sortConfig={sortConfig}
            onSort={onSort}
            onStatusUpdate={onStatusUpdate}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminComplaints;
