import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const features = [
    {
      name: 'Fast Setup',
      description: 'Create dynamic forms in minutes with our drag-and-drop builder.',
      icon: Zap,
    },
    {
      name: 'Multiple Field Types',
      description: 'Support for text, select, multi-select, and file upload fields from Airtable.',
      icon: Users,
    },
    {
      name: 'Export & Reports',
      description: 'Export responses as CSV, generate PDF reports, and analytics.',
      icon: Sparkles,
    },
    {
      name: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.',
      icon: Shield,
    },
  ];

  const highlights = [
    {
      title: '5-Minute Setup',
      description: 'Connect your Airtable base and start collecting responses instantly.',
      icon: Check,
    },
    {
      title: 'Build Dynamic Forms',
      description: 'Drag & drop interface with conditional logic support.',
      icon: FileText,
    },
    {
      title: 'Connected to Airtable',
      description: 'Forms automatically sync responses to your Airtable tables.',
      icon: BarChart3,
    },
    {
      title: 'Login with Airtable',
      description: 'Seamless authentication with Airtable for secure access.',
      icon: Shield,
    },
  ];

  const testimonials = [
    {
      content:
        'This form builder has revolutionized how we collect data. The Airtable integration is seamless!',
      author: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
    },
    {
      content:
        'The conditional logic feature saved us hours of development time. Highly recommended!',
      author: 'Mike Chen',
      role: 'Developer',
      company: 'StartupXYZ',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-primary-600">
            FormBuilder
          </Link>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-primary-600">Features</a>
            <a href="#highlights" className="text-gray-600 hover:text-primary-600">Highlights</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary-600">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600">Pricing</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-400 transition">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-600 to-primary-400 text-white py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-heading font-extrabold tracking-tight">
            Build Smarter Forms with Airtable
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto text-gray-200">
            Create dynamic forms that connect directly to your Airtable base.
            Save time, reduce errors, and empower your team.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-lg bg-white text-primary-600 font-medium shadow-lg hover:bg-gray-50 transition flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-lg bg-primary-700 text-white font-medium hover:bg-primary-600 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 text-center">Powerful Features</h2>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <feature.icon className="h-12 w-12 mx-auto text-primary-600" />
                <h3 className="mt-6 text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlights" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 text-center">Why Choose FormBuilder?</h2>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {highlights.map((highlight, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
                <highlight.icon className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{highlight.title}</h3>
                <p className="mt-2 text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 text-center">What Our Users Say</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-md transition">
                <p className="text-lg text-gray-700 italic">“{t.content}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{t.author}</p>
                  <p className="text-gray-600 text-sm">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600">Choose a plan that fits your workflow. Start free, upgrade anytime.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <p className="mt-2 text-gray-600">Perfect for individuals just getting started.</p>
              <p className="mt-6 text-4xl font-bold text-primary-600">$0</p>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li>✔ Unlimited forms</li>
                <li>✔ Airtable integration</li>
                <li>✔ Basic analytics</li>
              </ul>
              <button className="mt-8 w-full py-3 px-6 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition">
                Get Started
              </button>
            </div>
            {/* Pro Plan */}
            <div className="p-8 bg-white border-2 border-primary-600 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-2 text-gray-600">For growing teams who need more power.</p>
              <p className="mt-6 text-4xl font-bold text-primary-600">$19<span className="text-base text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li>✔ All Free features</li>
                <li>✔ Conditional logic</li>
                <li>✔ Advanced analytics</li>
                <li>✔ Priority support</li>
              </ul>
              <button className="mt-8 w-full py-3 px-6 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-600 text-white text-center">
        <h2 className="text-3xl font-heading font-extrabold">Start Building Smarter Forms Today</h2>
        <p className="mt-4 text-lg text-primary-100">
          Connect to Airtable and experience the future of form building.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FormBuilder. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
