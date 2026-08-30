import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import Navbar from './components/Navbar';
import DashboardNavbar from './components/DashboardNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPaymentHistory from './pages/AdminPaymentHistory';
import LoanApplication from './pages/LoanApplication';
import Payment from './pages/Payment';
import QuickPayment from './pages/QuickPayment';
import PublicPayment from './pages/PublicPayment';
import AllPayments from './pages/AllPayments';
import AllApplications from './pages/AllApplications';
import Profile from './pages/Profile';
import RepaymentSchedule from './pages/RepaymentSchedule';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Security from './pages/Security';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/applications') || 
                           location.pathname.startsWith('/payments') || 
                           location.pathname.startsWith('/profile') || 
                           location.pathname.startsWith('/apply-loan') || 
                           location.pathname.startsWith('/payment') || 
                           location.pathname.startsWith('/repayment-schedule');

  return (
    <div className="App">
      {isAdminRoute ? null : isDashboardRoute ? <DashboardNavbar /> : <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <AdminPaymentHistory />
              </AdminRoute>
            } 
          />
          <Route 
            path="/apply-loan" 
            element={
              <ProtectedRoute>
                <LoanApplication />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <AllPayments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <AllApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quick-payment" 
            element={<QuickPayment />} 
          />
          <Route 
            path="/public-payment" 
            element={<PublicPayment />} 
          />
          <Route 
            path="/repayment-schedule/:id" 
            element={
              <ProtectedRoute>
                <RepaymentSchedule />
              </ProtectedRoute>
            } 
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={12}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Default options
            className: '',
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
            },
            // Success toast
            success: {
              duration: 3000,
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #86efac',
                boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.2), 0 10px 10px -5px rgba(34, 197, 94, 0.1)',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            // Error toast
            error: {
              duration: 4000,
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fca5a5',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            // Loading toast
            loading: {
              style: {
                background: '#f0f9ff',
                color: '#1e40af',
                border: '1px solid #93c5fd',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)',
              },
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />
    </div>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
