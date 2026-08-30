import React, { useState } from 'react';
import { Mail, X, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success(response.data.message || 'Password reset link sent to your email!');
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8">
            {!emailSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">BF</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      Blue Print Financial
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                  <p className="mt-2 text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="reset-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex justify-center items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check your inbox and click on the link to reset your password. 
                  If you don't see the email, check your spam folder.
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

