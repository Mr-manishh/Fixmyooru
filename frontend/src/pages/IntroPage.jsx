import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import {
  MapPin,
  AlertTriangle,
  Trash2,
  Droplet,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Shield,
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const floatAnimation = (delay = 0) => ({
  y: [0, -14, 0],
  transition: { duration: 6, ease: 'easeInOut', repeat: Infinity, delay },
});

const issueIcons = [
  { icon: MapPin, color: 'from-blue-500 to-blue-600' },
  { icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
  { icon: Trash2, color: 'from-green-500 to-emerald-600' },
  { icon: Droplet, color: 'from-cyan-500 to-blue-500' },
  { icon: Wrench, color: 'from-purple-500 to-violet-600' },
];

const features = [
  {
    icon: CheckCircle2,
    title: 'Easy Reporting',
    desc: 'Report civic issues in seconds with our intuitive interface.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    desc: 'Monitor the status of your complaints in real-time.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Community Driven',
    desc: 'Join thousands of citizens making a real difference.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Verified Resolution',
    desc: 'Every complaint is tracked until it gets resolved.',
    gradient: 'from-emerald-500 to-green-500',
  },
];

const IntroPage = () => {
  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* ────── Hero Section ────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gray-200/60 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gray-200/60 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gray-200/50 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <div>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6"
              >
                <MapPin size={14} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                  Civic Issue Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
              >
                <span className="text-gray-900">Fix</span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">My</span>
                <span className="text-gray-900">Ooru</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={2}
                className="mt-4 text-xl sm:text-2xl font-medium text-gray-700"
              >
                Report Local Problems. Improve Your Community.
              </motion.p>

              <motion.p
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={3}
                className="mt-4 text-base text-gray-500 max-w-lg leading-relaxed"
              >
                FixMyOoru helps citizens report issues like potholes, garbage
                problems, water leaks, and broken streetlights so authorities
                can resolve them quickly.
              </motion.p>

              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={4}
                className="mt-8"
              >
                <Link to="/signup">
                  <Button size="lg" icon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right — Floating Icons */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={3}
              className="hidden lg:flex items-center justify-center relative"
            >
              {/* Central circle */}
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                <MapPin className="text-blue-600" size={64} strokeWidth={1.5} />
              </div>

              {/* Orbiting icons */}
              {issueIcons.map(({ icon: Icon, color }, i) => {
                const angle = (i / issueIcons.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 170;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={i}
                    animate={floatAnimation(i * 0.8)}
                    className={`absolute w-14 h-14 bg-gradient-to-br ${color} rounded-xl shadow-lg flex items-center justify-center`}
                    style={{
                      left: `calc(50% + ${x}px - 28px)`,
                      top: `calc(50% + ${y}px - 28px)`,
                    }}
                  >
                    <Icon className="text-white" size={26} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────── Features Section ────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why FixMyOoru?
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Built for citizens who care about their city.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, gradient }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group shadow-sm"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto">
              Join FixMyOoru today and help build a cleaner, safer, and better
              city for everyone.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg" icon={ArrowRight}>
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── Footer ────── */}
      <footer className="border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
              <MapPin className="text-white" size={14} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">
              FixMyOoru
            </span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FixMyOoru. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;
