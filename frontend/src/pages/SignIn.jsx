import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Mail, Lock, LogIn } from 'lucide-react';

const HAS_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  !String(import.meta.env.VITE_GOOGLE_CLIENT_ID).includes('your_google_client_id_here');

const SignIn = () => {
  const navigate = useNavigate();
  const { signin, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error('Please fill all fields');

    setLoading(true);
    try {
      await signin(form);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <AuthForm title="Welcome Back" subtitle="Sign in to continue to FixMyOoru">
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          icon={Mail}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          icon={Lock}
        />

        <Button type="submit" loading={loading} className="w-full" icon={LogIn}>
          Sign In
        </Button>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium transition"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google */}
      {HAS_GOOGLE_CLIENT_ID ? (
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            theme="outline"
            size="large"
            width={360}
            text="signin_with"
          />
        </div>
      ) : (
        <p className="text-center text-xs text-gray-400">Google login is not configured.</p>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-gray-500 mt-6"
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 transition"
        >
          Sign Up
        </Link>
      </motion.p>
    </AuthForm>
  );
};

export default SignIn;
