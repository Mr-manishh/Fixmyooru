import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileStack,
  Users,
  ChartColumnBig,
  LogOut,
  MapPinned,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Complaints', to: '/admin/complaints', icon: FileStack },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Analytics', to: '/admin/analytics', icon: ChartColumnBig },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarBody = (
    <aside className="h-full w-72 bg-slate-800 border-r border-slate-700/70 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <MapPinned className="text-white" size={18} />
          </div>
          <div>
            <p className="text-white font-semibold">FixMyOoru</p>
            <p className="text-slate-400 text-xs">Admin Workspace</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-md bg-slate-700 text-slate-200"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="space-y-1.5 flex-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/35'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-200 bg-red-500/10 hover:bg-red-500/20 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block fixed inset-y-0 left-0 z-40">{sidebarBody}</div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 z-40 bg-slate-950/60"
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="md:hidden fixed inset-y-0 left-0 z-50"
            >
              {sidebarBody}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
