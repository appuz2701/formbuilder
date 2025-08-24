import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { FormProvider } from './contexts/FormContext';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';

import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';
import Dashboard from './pages/Dashboard';
import FormAnalytics from './pages/FormAnalytics';
import FormBuilder from './pages/FormBuilder';
import FormEditor from './pages/FormEditor';
import FormResponses from './pages/FormResponses';
import FormViewer from './pages/FormViewer';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FormProvider>
          <div className="App min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/form/:id" element={<FormViewer />} />
              <Route path="/embed/:id" element={<FormViewer embedded={true} />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/error" element={<AuthError />} />

              <Route path="/dashboard" element={
             
                  <Layout>
                    <Dashboard />
                  </Layout>
            
              } />

              <Route path="/forms/new" element={
              
                  <Layout>
                    <FormBuilder />
                  </Layout>
            
              } />

              <Route path="/forms/:id/edit" element={
               
                  <Layout>
                    <FormEditor />
                  </Layout>
               
              } />

              <Route path="/forms/:id/analytics" element={
               
                  <Layout>
                    <FormAnalytics />
                  </Layout>
              
              } />

              <Route path="/forms/:id/responses" element={
              
                  <Layout>
                    <FormResponses />
                  </Layout>
      
              } />

              <Route path="/settings" element={
               
                  <Layout>
                    <Settings />
                  </Layout>
              
              } />

              <Route path="/forms" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              className="mt-16"
            />
          </div>
        </FormProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
