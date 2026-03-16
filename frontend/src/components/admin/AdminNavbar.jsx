import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminNavbar = ({ title, onMenuClick }) => {
  const { admin } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/70 bg-slate-900/80 backdrop-blur-xl">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin Panel</p>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
            <Search size={14} />
            <span className="text-xs">Search complaints, users...</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => toast('No new notifications right now.')}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
          >
            <Bell size={16} />
          </motion.button>
          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-900/30">
            {admin?.name || 'Admin'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
