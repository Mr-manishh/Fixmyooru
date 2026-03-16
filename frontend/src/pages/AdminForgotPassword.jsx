import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { adminForgotPassword } from '../services/adminApi';

const AdminForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter email');

    try {
      setLoading(true);
      const res = await adminForgotPassword({ email });
      toast.success(res.data.message);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
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
            <h1 className="text-xl font-semibold text-white">Admin Forgot Password</h1>
            <p className="text-sm text-slate-400">Get a secure reset link for admin account</p>
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Mail className="text-emerald-400" size={24} />
            </div>
            <p className="text-slate-200">If admin account exists for <strong>{email}</strong>, reset link is sent.</p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 mt-6 text-indigo-300 hover:text-indigo-200"
            >
              <ArrowLeft size={14} /> Back to Admin Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Email</span>
              <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
                <Mail className="text-slate-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                  placeholder="admin@fixmyooru.com"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-400 hover:to-indigo-500 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Send size={14} /> {loading ? 'Sending...' : 'Send Reset Link'}
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

export default AdminForgotPassword;
