import { motion } from 'framer-motion';

const AdminStatCard = ({ icon: Icon, label, value, color, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left w-full ${
        onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/60' : 'cursor-default'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-md`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </motion.button>
  );
};

export default AdminStatCard;
