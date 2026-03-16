import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMyComplaints, deleteComplaint } from '../services/complaintService';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  PlusCircle,
  Filter,
  Inbox,
  Trash2,
} from 'lucide-react';

const statusConfig = {
  Pending: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  'In Progress': {
    icon: AlertTriangle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  Completed: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  Resolved: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

const filters = ['All', 'Pending', 'In Progress', 'Completed'];

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilter !== 'All') params.status = activeFilter;
      const res = await getMyComplaints(params);
      setComplaints(res.data.data.complaints);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted');
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete complaint');
    }
  };

  if (loading && complaints.length === 0) {
    return <LoadingSpinner text="Loading complaints..." />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-gray-500 mt-1">
              Track and manage all your reported issues.
            </p>
          </motion.div>

          <Link to="/create-complaint">
            <Button icon={PlusCircle}>New Complaint</Button>
          </Link>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          <Filter size={16} className="text-gray-400 mr-1" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                activeFilter === f
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <Inbox className="text-gray-400" size={36} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Complaints Yet
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              You haven&apos;t reported any issues. Click below to raise your
              first complaint.
            </p>
            <Link to="/create-complaint">
              <Button icon={PlusCircle}>Raise a Complaint</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {complaints.map((complaint) => {
                const statusInfo = statusConfig[complaint.status] || statusConfig['Pending'];
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={complaint._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {complaint.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          {complaint.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {complaint.location}
                            </span>
                          )}
                          <span>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status badge + delete */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} border`}
                        >
                          <StatusIcon size={12} />
                          {complaint.status}
                        </div>
                        {complaint.status === 'Pending' && (
                          <button
                            onClick={() => handleDelete(complaint._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                            title="Delete complaint"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
