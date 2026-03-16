import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const HAS_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  !String(import.meta.env.VITE_GOOGLE_CLIENT_ID).includes('your_google_client_id_here');

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return toast.error('Please fill all fields');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created successfully!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      toast.success('Welcome to FixMyOoru!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <AuthForm title="Create Account" subtitle="Join FixMyOoru and improve your community">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          icon={User}
        />

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
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          icon={Lock}
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          icon={Lock}
        />

        <Button type="submit" loading={loading} className="w-full" icon={UserPlus}>
          Create Account
        </Button>
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
            text="signup_with"
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
        Already have an account?{' '}
        <Link
          to="/signin"
          className="font-medium text-blue-600 hover:text-blue-500 transition"
        >
          Sign In
        </Link>
      </motion.p>
    </AuthForm>
  );
};

export default SignUp;
