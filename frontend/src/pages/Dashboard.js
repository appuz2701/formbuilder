import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../contexts/FormContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { forms, getForms, deleteForm, duplicateForm } = useForm();
  const navigate = useNavigate();

  const [selectedForm, setSelectedForm] = useState(null);
  const [duplicateTitle, setDuplicateTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    getForms().catch((err) => {
      console.error('Failed to load forms:', err);
      toast.error('Failed to load forms');
    });
  }, []);

  const handleDuplicateForm = async () => {
    if (!selectedForm || !duplicateTitle.trim()) return;
    try {
      const newForm = await duplicateForm(selectedForm._id, duplicateTitle);
      setShowDuplicateModal(false);
      setSelectedForm(null);
      setDuplicateTitle('');
      toast.success('Form duplicated successfully');
      navigate(`/forms/${newForm._id}/edit`);
    } catch (error) {
      console.error('Failed to duplicate form:', error);
      toast.error('Failed to duplicate form');
    }
  };

  return (
    <div className="space-y-10">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-indigo-400 via-purple-700 to-pink-400 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow">
              Hey, {user?.profile?.name?.split(' ')[0] || 'Builder'} 
            </h1>
            <p className="text-white/80 text-lg">
              {forms.length === 0
                ? 'Let’s start by creating your very first form!'
                : `You currently have ${forms.length} form${forms.length !== 1 ? 's' : ''} in your workspace.`}
            </p>
          </div>

          <Link
            to="/forms/new"
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:scale-105 hover:bg-slate-100 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Form</span>
          </Link>
        </div>
      </div>

      {/* Form Stats / Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Forms</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{forms.length}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Last Activity</h3>
          <p className="mt-2 text-gray-500 text-sm">
            {forms.length === 0 ? 'No forms yet' : 'Recently updated form available'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Quick Tip</h3>
          <p className="mt-2 text-gray-500 text-sm">
            Use <span className="font-bold">conditional logic</span> to make your forms smarter ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
