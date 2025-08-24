import { createContext, useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { api } from '../config/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, loading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false, error: null };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false, error: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false, error: null };
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(config => {
      if (state.token) config.headers.Authorization = `Bearer ${state.token}`;
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          if (err.response.data?.needsRefresh) refreshToken();
          else {
            logout();
            toast.error('Your session has expired. Please log in again.');
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [state.token]);

  useEffect(() => {
    if (state.token) getCurrentUser();
    else dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }, []);

  const getCurrentUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const res = await api.get('/api/auth/me');
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: res.data, token: state.token } });
    } catch (err) {
      console.error('Get current user error:', err);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err.response?.data?.message || 'Failed to get user data' });
      localStorage.removeItem('token');
    }
  };

  const loginWithAirtable = () => {
    const url = process.env.REACT_APP_API_URL;
    if (!url) return toast.error('API URL is not configured');
    window.location.href = `${url}/api/auth/airtable`;
  };

  const handleAuthCallback = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: res.data, token } });
      toast.success('Successfully logged in!');
      return true;
    } catch (err) {
      console.error('Auth callback error:', err);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err.response?.data?.message || 'Login failed' });
      localStorage.removeItem('token');
      toast.error('Login failed');
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      await api.post('/api/auth/refresh');
      toast.info('Session refreshed');
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      toast.error('Session expired. Please log in again.');
    }
  };

  const logout = async () => {
    try {
      if (state.token) await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/api/auth/account');
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Account deleted successfully');
      return true;
    } catch (err) {
      console.error('Delete account error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete account');
      return false;
    }
  };

  const updateUser = (userData) => dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginWithAirtable,
        handleAuthCallback,
        logout,
        deleteAccount,
        updateUser,
        clearError,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
