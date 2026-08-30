import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from '../components/UserLayout';

const AllApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    disbursed: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/loans/my-applications');
      setApplications(response.data.applications || []);
      calculateStats(response.data.applications || []);
    } catch (error) {
      console.error('Fetch applications error:', error);
      toast.error('Failed to load loan applications');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (applicationsList) => {
    const statsData = {
      total: applicationsList.length,
      approved: applicationsList.filter(a => a.status === 'approved').length,
      pending: applicationsList.filter(a => a.status === 'pending').length,
      rejected: applicationsList.filter(a => a.status === 'rejected').length,
      disbursed: applicationsList.filter(a => a.status === 'disbursed').length,
      totalAmount: applicationsList.reduce((sum, a) => sum + parseFloat(a.amount_requested || 0), 0)
    };
    setStats(statsData);
  };

  const getFilteredApplications = () => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.loan_type?.toLowerCase().replace('_', ' ').includes(query) ||
        a.purpose?.toLowerCase().includes(query) ||
        a.amount_requested?.toString().includes(query) ||
        a.id?.toString().includes(query)
      );
    }

    return filtered;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'approved':
      case 'disbursed':
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
      case 'under_review':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
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

  const filteredApplications = getFilteredApplications();

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
              <h1 className="text-3xl font-bold text-gray-900">My Loan Applications</h1>
              <p className="text-gray-600 mt-2">
                View and manage all your loan applications
              </p>
            </div>
            <Link to="/apply-loan" className="btn-primary inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Apply for New Loan
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" data-aos="fade-up" data-aos-delay="200">
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

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disbursed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.disbursed}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200" data-aos="fade-up" data-aos-delay="500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200" data-aos="fade-up" data-aos-delay="600">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6" data-aos="fade-up" data-aos-delay="700">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by loan type, purpose, amount, or ID..."
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
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="disbursed">Disbursed</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="card" data-aos="fade-up" data-aos-delay="800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Applications ({filteredApplications.length})
            </h2>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Application</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loan Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr 
                      key={application.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              #{application.id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.purpose ? (application.purpose.length > 30 ? application.purpose.substring(0, 30) + '...' : application.purpose) : 'No purpose specified'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900 capitalize">
                          {application.loan_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{parseFloat(application.amount_requested || 0).toLocaleString()}
                        </p>
                        {application.monthly_repayment && (
                          <p className="text-xs text-gray-500">
                            ₦{parseFloat(application.monthly_repayment).toLocaleString()}/mo
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {application.loan_duration} {application.loan_duration === 1 ? 'month' : 'months'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(application.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={getStatusBadge(application.status)}>
                          {application.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {(application.status === 'approved' || application.status === 'disbursed') && (
                            <>
                              <Link
                                to={`/repayment-schedule/${application.id}`}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                title="View Schedule"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Schedule
                              </Link>
                              {application.status === 'disbursed' && (
                                <Link
                                  to="/payment"
                                  state={{ 
                                    loanId: application.id, 
                                    amount: application.monthly_repayment || application.amount_requested, 
                                    loanType: application.loan_type 
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700 transition-colors"
                                  title="Pay Now"
                                >
                                  Pay
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No applications found' 
                  : 'No applications yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your financial journey by applying for your first loan'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/apply-loan" className="btn-primary inline-flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Link>
                  <Link to="/dashboard" className="btn-outline inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {filteredApplications.length > 0 && (
          <div className="mt-6 card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200" data-aos="fade-up" data-aos-delay="900">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Amount (Filtered)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{filteredApplications
                      .reduce((sum, a) => sum + parseFloat(a.amount_requested || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Showing</p>
                <p className="text-xl font-bold text-primary-600">
                  {filteredApplications.length} of {applications.length} applications
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default AllApplications;

