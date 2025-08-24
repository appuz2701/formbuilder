import { createContext, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import { api } from '../config/api';

const initialState = {
  forms: [],
  currentForm: null,
  bases: [],
  tables: [],
  fields: [],
  responses: [],
  analytics: null,
  loading: false,
  error: null
};

const FORM_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FORMS: 'SET_FORMS',
  SET_CURRENT_FORM: 'SET_CURRENT_FORM',
  ADD_FORM: 'ADD_FORM',
  UPDATE_FORM: 'UPDATE_FORM',
  DELETE_FORM: 'DELETE_FORM',
  SET_BASES: 'SET_BASES',
  SET_TABLES: 'SET_TABLES',
  SET_FIELDS: 'SET_FIELDS',
  SET_RESPONSES: 'SET_RESPONSES',
  ADD_RESPONSE: 'ADD_RESPONSE',
  SET_ANALYTICS: 'SET_ANALYTICS'
};

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case FORM_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case FORM_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case FORM_ACTIONS.SET_FORMS:
      return { ...state, forms: action.payload };
    case FORM_ACTIONS.SET_CURRENT_FORM:
      return { ...state, currentForm: action.payload };
    case FORM_ACTIONS.ADD_FORM:
      return { ...state, forms: [action.payload, ...state.forms] };
    case FORM_ACTIONS.UPDATE_FORM:
      return {
        ...state,
        forms: state.forms.map(f => f._id === action.payload._id ? action.payload : f),
        currentForm: state.currentForm?._id === action.payload._id ? action.payload : state.currentForm
      };
    case FORM_ACTIONS.DELETE_FORM:
      return {
        ...state,
        forms: state.forms.filter(f => f._id !== action.payload),
        currentForm: state.currentForm?._id === action.payload ? null : state.currentForm
      };
    case FORM_ACTIONS.SET_BASES:
      return { ...state, bases: action.payload };
    case FORM_ACTIONS.SET_TABLES:
      return { ...state, tables: action.payload };
    case FORM_ACTIONS.SET_FIELDS:
      return { ...state, fields: action.payload };
    case FORM_ACTIONS.SET_RESPONSES:
      return { ...state, responses: action.payload };
    case FORM_ACTIONS.ADD_RESPONSE:
      return { ...state, responses: [action.payload, ...state.responses] };
    case FORM_ACTIONS.SET_ANALYTICS:
      return { ...state, analytics: action.payload };
    default:
      return state;
  }
};

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
};

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setLoading = (value) => dispatch({ type: FORM_ACTIONS.SET_LOADING, payload: value });
  const setError = (msg) => dispatch({ type: FORM_ACTIONS.SET_ERROR, payload: msg });
  const clearError = () => dispatch({ type: FORM_ACTIONS.CLEAR_ERROR });

  const getForms = async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get('/api/forms', { params });
      dispatch({ type: FORM_ACTIONS.SET_FORMS, payload: res.data.forms });
      return res.data;
    } catch (err) {
      console.error('Get forms error:', err);
      setError(err.response?.data?.message || 'Failed to fetch forms');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getForm = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/forms/${id}`);
      dispatch({ type: FORM_ACTIONS.SET_CURRENT_FORM, payload: res.data.form });
      return res.data.form;
    } catch (err) {
      console.error('Get form error:', err);
      setError(err.response?.data?.message || 'Failed to fetch form');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createForm = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/api/forms', data);
      dispatch({ type: FORM_ACTIONS.ADD_FORM, payload: res.data.form });
      toast.success('Form created successfully!');
      return res.data.form;
    } catch (err) {
      console.error('Create form error:', err);
      const msg = err.response?.data?.message || 'Failed to create form';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (id, data) => {
    try {
      setLoading(true);
      const res = await api.put(`/api/forms/${id}`, data);
      dispatch({ type: FORM_ACTIONS.UPDATE_FORM, payload: res.data.form });
      toast.success('Form updated successfully!');
      return res.data.form;
    } catch (err) {
      console.error('Update form error:', err);
      const msg = err.response?.data?.message || 'Failed to update form';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/forms/${id}`);
      dispatch({ type: FORM_ACTIONS.DELETE_FORM, payload: id });
      toast.success('Form deleted successfully!');
    } catch (err) {
      console.error('Delete form error:', err);
      const msg = err.response?.data?.message || 'Failed to delete form';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateForm = async (id, title) => {
    try {
      setLoading(true);
      const res = await api.post(`/api/forms/${id}/duplicate`, { title });
      dispatch({ type: FORM_ACTIONS.ADD_FORM, payload: res.data.form });
      toast.success('Form duplicated successfully!');
      return res.data.form;
    } catch (err) {
      console.error('Duplicate form error:', err);
      const msg = err.response?.data?.message || 'Failed to duplicate form';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishForm = async (id, isPublished) => {
    try {
      const res = await api.post(`/api/forms/${id}/publish`, { isPublished });
      dispatch({ type: FORM_ACTIONS.UPDATE_FORM, payload: res.data.form });
      toast.success(`Form ${isPublished ? 'published' : 'unpublished'} successfully!`);
      return res.data.form;
    } catch (err) {
      console.error('Publish form error:', err);
      const msg = err.response?.data?.message || 'Failed to update form status';
      toast.error(msg);
      throw err;
    }
  };

  const getBases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/airtable/bases');
      dispatch({ type: FORM_ACTIONS.SET_BASES, payload: res.data.bases });
      return res.data.bases;
    } catch (err) {
      console.error('Get bases error:', err);
      setError(err.response?.data?.message || 'Failed to fetch bases');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTables = async (baseId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/airtable/bases/${baseId}/tables`);
      dispatch({ type: FORM_ACTIONS.SET_TABLES, payload: res.data.tables });
      return res.data.tables;
    } catch (err) {
      console.error('Get tables error:', err);
      setError(err.response?.data?.message || 'Failed to fetch tables');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFields = async (baseId, tableId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/airtable/bases/${baseId}/tables/${tableId}/fields`);
      dispatch({ type: FORM_ACTIONS.SET_FIELDS, payload: res.data.fields });
      return res.data;
    } catch (err) {
      console.error('Get fields error:', err);
      setError(err.response?.data?.message || 'Failed to fetch fields');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testAirtableConnection = async () => {
    try {
      const res = await api.post('/api/airtable/test-connection');
      toast.success('Airtable connection successful!');
      return res.data;
    } catch (err) {
      console.error('Test connection error:', err);
      const msg = err.response?.data?.message || 'Connection test failed';
      toast.error(msg);
      throw err;
    }
  };

  const getResponses = async (formId, params = {}) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/forms/${formId}/responses`, { params });
      dispatch({ type: FORM_ACTIONS.SET_RESPONSES, payload: res.data.responses });
      return res.data;
    } catch (err) {
      console.error('Get responses error:', err);
      setError(err.response?.data?.message || 'Failed to fetch responses');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (formId, responseData, files = []) => {
    try {
      const formData = new FormData();
      Object.keys(responseData).forEach(key => formData.append(key, responseData[key]));
      files.forEach(f => formData.append(f.fieldName, f.file));
      const res = await api.post(`/api/responses/submit/${formId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch({ type: FORM_ACTIONS.ADD_RESPONSE, payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Submit response error:', err);
      throw err;
    }
  };

  const validateResponse = async (formId, responses) => {
    try {
      const res = await api.post(`/api/responses/validate/${formId}`, { responses });
      return res.data;
    } catch (err) {
      console.error('Validate response error:', err);
      throw err;
    }
  };

  const getAnalytics = async (formId, params = {}) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/forms/${formId}/analytics`, { params });
      dispatch({ type: FORM_ACTIONS.SET_ANALYTICS, payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Get analytics error:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportResponses = async (formId, format = 'csv', params = {}) => {
    try {
      const res = await api.get(`/api/responses/export/${formId}`, {
        params: { format, ...params },
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `form_responses_${formId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      toast.success('Export completed successfully!');
      return res.data;
    } catch (err) {
      console.error('Export responses error:', err);
      toast.error('Failed to export responses');
      throw err;
    }
  };

  const value = {
    ...state,
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm,
    publishForm,
    getBases,
    getTables,
    getFields,
    testAirtableConnection,
    getResponses,
    submitResponse,
    validateResponse,
    getAnalytics,
    exportResponses,
    setLoading,
    setError,
    clearError
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
