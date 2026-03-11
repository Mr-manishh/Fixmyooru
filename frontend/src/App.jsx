import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRouter from './router/AppRouter';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Navbar />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 16px',
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <AppRouter />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
