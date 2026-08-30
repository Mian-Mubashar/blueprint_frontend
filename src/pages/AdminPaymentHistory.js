import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  Eye,
  Download,
  User
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total_payments: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    total_collected: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dateChangeTimeoutRef = useRef(null);

  useEffect(() => {
    fetchPayments();
  }, []); // Only fetch on mount

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (dateChangeTimeoutRef.current) {
        clearTimeout(dateChangeTimeoutRef.current);
      }
    };
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // Only send date filters to server, status and search will be client-side
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/admin/payments?${params.toString()}`);
      setPayments(response.data.payments || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Fetch payments error:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    e.preventDefault();
    setStatusFilter(e.target.value);
    // No API call, just client-side filtering
  };

  const handleDateChange = (type, value) => {
    // Clear previous timeout
    if (dateChangeTimeoutRef.current) {
      clearTimeout(dateChangeTimeoutRef.current);
    }
    
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    
    // Fetch when date changes (server-side filtering for date range)
    // Use a small delay to avoid multiple rapid calls
    dateChangeTimeoutRef.current = setTimeout(() => {
      fetchPayments();
    }, 500); // Debounce 500ms
  };

  const getFilteredPayments = () => {
    let filtered = [...payments];
    
    // Client-side status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Client-side search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.first_name?.toLowerCase().includes(query) ||
        p.last_name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.phone?.toLowerCase().includes(query) ||
        p.transaction_reference?.toLowerCase().includes(query) ||
        p.stripe_payment_intent_id?.toLowerCase().includes(query)
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0 w-0 min-w-0">
          <div className="p-4 sm:p-6 h-full flex flex-col max-w-full">
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex-shrink-0" data-aos="fade-up">
              <Link 
                to="/admin" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Payment History</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                    View and manage all payment transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 flex-shrink-0">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_payments || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.failed || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-aos="fade-up" data-aos-delay="500">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Collected</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{parseFloat(stats.total_collected || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="card mb-6 flex-shrink-0" data-aos="fade-up" data-aos-delay="600">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, transaction ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Filter className="w-5 h-5 text-gray-600 hidden sm:block" />
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm sm:text-base"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
                    <span className="text-gray-600 flex-shrink-0">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                      placeholder="End Date"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        fetchPayments();
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap self-start sm:self-center"
                    >
                      Clear Dates
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="card flex flex-col flex-1 min-h-0" data-aos="fade-up" data-aos-delay="700">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  All Payments ({filteredPayments.length})
                </h2>
              </div>

              {filteredPayments.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto flex-1">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPayments.map((payment) => (
                            <tr 
                              key={payment.id} 
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-primary-600" />
                                  </div>
                                  <div className="ml-3 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {payment.first_name} {payment.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{payment.email}</p>
                                    {payment.phone && (
                                      <p className="text-xs text-gray-500 truncate">{payment.phone}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center">
                                  {getStatusIcon(payment.status)}
                                  <div className="ml-3 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {payment.transaction_reference || payment.stripe_payment_intent_id || `TXN-${payment.id}`}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize truncate">
                                      {payment.payment_type?.replace('_', ' ')}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-gray-900 capitalize">
                                  {payment.loan_type?.replace('_', ' ') || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm font-semibold text-gray-900">
                                  ₦{parseFloat(payment.amount || 0).toLocaleString()}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {payment.payment_method || 'Card'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">{formatDate(payment.payment_date)}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={getStatusBadge(payment.status)}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {payment.first_name} {payment.last_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{payment.email}</p>
                            </div>
                          </div>
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-semibold text-gray-900">
                              ₦{parseFloat(payment.amount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transaction:</span>
                            <span className="text-gray-900 truncate ml-2">
                              {payment.transaction_reference || payment.stripe_payment_intent_id || `TXN-${payment.id}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loan Type:</span>
                            <span className="text-gray-900 capitalize">
                              {payment.loan_type?.replace('_', ' ') || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="text-gray-900 capitalize">
                              {payment.payment_method || 'Card'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="text-gray-900">{formatDate(payment.payment_date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery || statusFilter !== 'all' || startDate || endDate
                      ? 'No payments found' 
                      : 'No payments yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== 'all' || startDate || endDate
                      ? 'Try adjusting your search or filter criteria'
                      : 'Payment history will appear here once customers make payments'}
                  </p>
                </div>
              )}
            </div>

            {/* Summary Card */}
            {filteredPayments.length > 0 && (
              <div className="mt-6 card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200 flex-shrink-0" data-aos="fade-up" data-aos-delay="800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-600">Total Collected (Filtered)</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                        ₦{filteredPayments
                          .filter(p => p.status === 'completed')
                          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-gray-600">Showing</p>
                    <p className="text-lg sm:text-xl font-bold text-primary-600">
                      {filteredPayments.length} of {payments.length} payments
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPaymentHistory;

