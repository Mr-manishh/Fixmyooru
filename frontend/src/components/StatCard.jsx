import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color = 'from-blue-500 to-blue-600' }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="text-white" size={22} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
