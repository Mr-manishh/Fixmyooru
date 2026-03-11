import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createComplaint } from '../services/complaintService';
import InputField from '../components/InputField';
import Button from '../components/Button';
import {
  FileText,
  MapPin,
  Tag,
  AlignLeft,
  Image,
  Send,
  ArrowLeft,
} from 'lucide-react';

const categories = [
  'Pothole',
  'Garbage',
  'Water Leak',
  'Broken Streetlight',
  'Drainage',
  'Road Damage',
  'Other',
];

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('Image must be under 5MB');
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location)
      return toast.error('Please fill all required fields');

    setLoading(true);
    try {
      const payload = { ...form };
      if (image) {
        payload.image = await toBase64(image);
      }
      await createComplaint(payload);
      toast.success('Complaint submitted successfully!');
      navigate('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Raise a Complaint</h1>
          <p className="text-gray-500 mt-1">
            Provide details about the civic issue you want to report.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Title"
              name="title"
              type="text"
              placeholder="e.g. Pothole on Main Road"
              value={form.title}
              onChange={handleChange}
              icon={FileText}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <div className="relative">
                <AlignLeft
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <textarea
                  name="description"
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition resize-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <div className="relative">
                <Tag
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InputField
              label="Location"
              name="location"
              type="text"
              placeholder="e.g. MG Road, Bangalore"
              value={form.location}
              onChange={handleChange}
              icon={MapPin}
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image (optional)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Image size={28} className="mb-2" />
                    <span className="text-sm">Click to upload an image</span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              icon={Send}
            >
              Submit Complaint
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateComplaint;
