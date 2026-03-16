import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const HAS_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  !String(import.meta.env.VITE_GOOGLE_CLIENT_ID).includes('your_google_client_id_here');

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Admin account created');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      toast.success('Admin account ready');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin Google signup failed');
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
            <h1 className="text-xl font-semibold text-white">Admin Sign Up</h1>
            <p className="text-sm text-slate-400">Create authorized admin account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Name</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
              <User className="text-slate-500" size={16} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="Admin Name"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Email</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl">
              <Mail className="text-slate-500" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="admin@fixmyooru.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Password</span>
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
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs uppercase tracking-[0.15em] text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {HAS_GOOGLE_CLIENT_ID ? (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Admin Google signup failed')}
              theme="outline"
              size="large"
              width={360}
              text="signup_with"
            />
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400">Google login is not configured.</p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have admin access?{' '}
          <Link to="/admin/login" className="text-indigo-300 hover:text-indigo-200 font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminSignUp;
