import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  Plus,
  Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.applications || {};
  const payments = dashboardData?.payments || {};
  const recentApplications = dashboardData?.recentApplications || [];
  const recentPayments = dashboardData?.recentPayments || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Manage your loans and track your financial journey
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <Link to="/apply-loan" className="btn-primary flex items-center justify-center text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="whitespace-nowrap">Apply for Loan</span>
              </Link>
              <button className="btn-outline flex items-center justify-center text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="whitespace-nowrap">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_applications || 0}</p>
              </div>
            </div>
          </div>

          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Loans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="card" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{stats.total_amount_requested?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="card" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Payments Made</p>
                <p className="text-2xl font-bold text-gray-900">{payments.completed_payments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="card" data-aos="fade-up" data-aos-delay="500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 capitalize">
                          {application.loan_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₦{application.amount_requested.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No applications yet</p>
                <Link to="/apply-loan" className="btn-primary">
                  Apply for your first loan
                </Link>
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="card" data-aos="fade-up" data-aos-delay="600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
              <Link to="/payments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 capitalize">
                          {payment.payment_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {payment.loan_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No payments yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8" data-aos="fade-up" data-aos-delay="700">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/apply-loan" className="p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="flex items-center mb-3">
                  <Plus className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Apply for Loan</h3>
                </div>
                <p className="text-sm text-gray-600">Start your loan application process</p>
              </Link>

              <Link to="/profile" className="p-6 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                <div className="flex items-center mb-3">
                  <User className="w-6 h-6 text-secondary-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Update Profile</h3>
                </div>
                <p className="text-sm text-gray-600">Manage your personal information</p>
              </Link>

              <Link to="/contact" className="p-6 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors">
                <div className="flex items-center mb-3">
                  <Settings className="w-6 h-6 text-accent-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Get Support</h3>
                </div>
                <p className="text-sm text-gray-600">Contact our support team</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



