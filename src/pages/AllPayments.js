import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  FileText
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from '../components/UserLayout';

const AllPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/payments');
      setPayments(response.data.payments || []);
      calculateStats(response.data.payments || []);
    } catch (error) {
      console.error('Fetch payments error:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsList) => {
    const statsData = {
      total: paymentsList.length,
      completed: paymentsList.filter(p => p.status === 'completed').length,
      pending: paymentsList.filter(p => p.status === 'pending').length,
      failed: paymentsList.filter(p => p.status === 'failed').length,
      totalAmount: paymentsList
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    };
    setStats(statsData);
  };

  const getFilteredPayments = () => {
    let filtered = payments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.transaction_reference?.toLowerCase().includes(query) ||
        p.loan_type?.toLowerCase().replace('_', ' ').includes(query) ||
        p.payment_type?.toLowerCase().replace('_', ' ').includes(query) ||
        p.amount?.toString().includes(query)
      );
    }

    return filtered;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPayments = getFilteredPayments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-2">
                View and manage all your payment transactions
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-aos="fade-up" data-aos-delay="500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6" data-aos="fade-up" data-aos-delay="600">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, loan type, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card" data-aos="fade-up" data-aos-delay="700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Payments ({filteredPayments.length})
            </h2>
          </div>

          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loan Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {payment.transaction_reference || `TXN-${payment.id}`}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {payment.payment_type?.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900 capitalize">
                          {payment.loan_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{parseFloat(payment.amount || 0).toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {payment.payment_method || 'Card'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(payment.payment_date)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No payments found' 
                  : 'No payments yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your payment history will appear here once you make your first payment'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link to="/dashboard" className="btn-primary inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {filteredPayments.length > 0 && (
          <div className="mt-6 card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200" data-aos="fade-up" data-aos-delay="800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Amount (Filtered)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{filteredPayments
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Showing</p>
                <p className="text-xl font-bold text-primary-600">
                  {filteredPayments.length} of {payments.length} payments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default AllPayments;

