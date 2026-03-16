import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getComplaintStats } from '../services/complaintService';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import {
  FileText,
  Clock,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getComplaintStats();
        setStats(res.data.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>
          <p className="mt-2 text-gray-500">
            Here&apos;s an overview of your reported issues.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={1}>
            <StatCard
              icon={FileText}
              label="Total Complaints"
              value={stats.total}
              color="from-blue-500 to-blue-600"
            />
          </motion.div>
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}>
            <StatCard
              icon={Clock}
              label="In Progress"
              value={stats.inProgress}
              color="from-amber-500 to-orange-500"
            />
          </motion.div>
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={3}>
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={stats.completed}
              color="from-emerald-500 to-green-500"
            />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={4}
          className="grid sm:grid-cols-2 gap-6"
        >
          {/* Raise Complaint Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <PlusCircle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Raise a New Complaint
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Report a civic issue in your area — potholes, garbage, water
              leaks, broken lights.
            </p>
            <Link to="/create-complaint">
              <Button icon={ArrowRight}>Raise Complaint</Button>
            </Link>
          </div>

          {/* View Complaints Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Complaints
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Track the status of your reported issues and see resolution
              updates in real-time.
            </p>
            <Link to="/complaints">
              <Button variant="secondary" icon={ArrowRight}>
                View Complaints
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
