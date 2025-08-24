import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Columns,
  Database,
  Loader2,
  Table
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useForm } from '../contexts/FormContext';

const FormBuilder = () => {
  const navigate = useNavigate();
  const { 
    bases, 
    tables, 
    fields, 
    loading, 
    getBases, 
    getTables, 
    getFields, 
    createForm,
    testAirtableConnection 
  } = useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedBase: null,
    selectedTable: null,
    selectedFields: [],
    settings: {
      allowMultipleSubmissions: true,
      showProgressBar: true,
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your submission!'
    }
  });

  const steps = [
    { id: 'connection', title: 'Connection', icon: Database, route: '/connection' },
    { id: 'base', title: 'Base', icon: Database, route: '/base' },
    { id: 'table', title: 'Table', icon: Table, route: '/table' },
    { id: 'fields', title: 'Fields', icon: Columns, route: '/fields' },
    { id: 'settings', title: 'Settings', icon: Check, route: '/settings' }
  ];

  useEffect(() => {
    if (currentStep === 0) {
      testConnection();
    }
  }, [currentStep]);

  const testConnection = async () => {
    try {
      await testAirtableConnection();
      setTimeout(() => {
        setCurrentStep(1);
        loadBases();
      }, 1000);
    } catch (error) {
      toast.error('Please check your Airtable connection and try again.');
    }
  };

  const loadBases = async () => {
    try {
      await getBases();
    } catch (error) {
      toast.error('Failed to load Airtable bases');
    }
  };

  const handleStepClick = (route, index) => {
    setCurrentStep(index);
    navigate(route); // navigate to that route (e.g., /settings → settings.js)
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Stepper with clickable buttons */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.route, index)}
              className="flex-1 flex flex-col items-center focus:outline-none"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-500 text-white'
                    : isCurrent
                    ? 'border-indigo-500 bg-white text-indigo-600'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              </div>
              <p className={`mt-2 text-sm font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </button>
          );
        })}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-10">
          <div
            className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Placeholder for step content */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl p-8 min-h-[500px]">
        <h2 className="text-xl font-semibold">Step {currentStep + 1}: {steps[currentStep].title}</h2>
        <p className="text-gray-500">This is where the {steps[currentStep].title} content will go.</p>
      </div>
    </div>
  );
};

export default FormBuilder;
