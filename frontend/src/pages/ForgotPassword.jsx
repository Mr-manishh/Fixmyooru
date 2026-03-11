import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';
import AuthForm from '../components/AuthForm';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      toast.success(res.data.message);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Forgot Password" subtitle="Enter your email to receive a reset link">
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
          <p className="text-sm text-gray-500 mb-6">
            If an account with <strong>{email}</strong> exists, we&apos;ve sent a password
            reset link. Check your inbox and spam folder.
          </p>
          <Link to="/signin">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Sign In
            </Button>
          </Link>
        </motion.div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <Button type="submit" loading={loading} className="w-full" icon={Send}>
              Send Reset Link
            </Button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            Remember your password?{' '}
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              Sign In
            </Link>
          </motion.p>
        </>
      )}
    </AuthForm>
  );
};

export default ForgotPassword;
