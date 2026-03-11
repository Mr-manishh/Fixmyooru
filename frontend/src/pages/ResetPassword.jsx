import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';
import AuthForm from '../components/AuthForm';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Lock, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword)
      return toast.error('Please fill all fields');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });
      toast.success(res.data.message);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Reset Password" subtitle="Enter your new password below">
      {success ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset!</h3>
          <p className="text-sm text-gray-500 mb-6">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <Button onClick={() => navigate('/signin')} className="w-full">
            Go to Sign In
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            icon={Lock}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            icon={Lock}
          />

          <Button type="submit" loading={loading} className="w-full" icon={Lock}>
            Reset Password
          </Button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-500 mt-4"
          >
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              Back to Sign In
            </Link>
          </motion.p>
        </form>
      )}
    </AuthForm>
  );
};

export default ResetPassword;
