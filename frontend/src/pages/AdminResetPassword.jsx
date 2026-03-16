import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { adminResetPassword } from '../services/adminApi';

const AdminResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error('Please fill all fields');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await adminResetPassword(token, { password: formData.password });
      toast.success(res.data.message);
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950/50 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Admin Reset Password</h1>
            <p className="text-sm text-slate-400">Set a new password for admin account</p>
          </div>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
            <p className="text-slate-200 mb-6">Password updated successfully.</p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium"
            >
              Go to Admin Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">New Password</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
                <Lock className="text-slate-500" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Confirm Password</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
                <Lock className="text-slate-500" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-400 hover:to-indigo-500 transition disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-slate-400 pt-2">
              <Link to="/admin/login" className="text-indigo-300 hover:text-indigo-200">
                Back to Admin Login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminResetPassword;
