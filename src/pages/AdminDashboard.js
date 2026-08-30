import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Eye, CheckCircle, XCircle, DollarSign, X, 
  FileText, Clock, CreditCard, TrendingUp, Users, 
  ArrowRight, Calendar, User, Mail, Phone, 
  Building2, Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import {
  ApplicationStatusChart,
  ApplicationsOverTimeChart,
  RevenueChart,
  ApprovalRateTrend,
  PaymentStatusChart
} from '../components/AnalyticsCharts';

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || null;
  const { user } = useAuth();
  
  const [data, setData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, appRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/applications')
      ]);
      setData(dashRes.data);
      
      let filteredApps = appRes.data.applications;
      if (filter && filter !== 'all') {
        filteredApps = filteredApps.filter(app => app.status === filter);
      }
      setApplications(filteredApps);
    } catch (e) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Debug: Log search results (remove in production)
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      console.log('Search Query:', searchQuery);
      console.log('Total Applications:', applications.length);
    }
  }, [searchQuery, applications.length]);

  // Update application status
  const handleStatusUpdate = async (id, status, extraData = {}) => {
    setActionLoading(true);
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status, ...extraData });
      toast.success(`Application marked as ${status}`);
      setSelectedApp(null);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Failed to load admin dashboard.</p>
      </div>
    );
  }

  const { loanStats, paymentStats, recentLoans, recentPayments } = data;
  const isDashboardView = !filter || filter === null;
  
  // Calculate stats
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const disbursedCount = applications.filter(app => app.status === 'disbursed').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  const totalCount = applications.length;
  
  // Filter applications by active tab and search query
  // Search works in ALL tabs including "Total Applications" (all tab)
  const getFilteredApplications = () => {
    let filtered = [...applications]; // Create a copy to avoid mutation
    
    // Filter by active tab (if not 'all')
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => app.status === activeTab);
    }
    
    // Filter by search query (works in all tabs including 'all')
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      
      filtered = filtered.filter(app => {
        // Handle name search - check first name, last name, and full name
        const firstName = (app.first_name || '').toLowerCase();
        const lastName = (app.last_name || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const reverseName = `${lastName} ${firstName}`.trim();
        
        // Handle email
        const email = (app.email || '').toLowerCase();
        
        // Handle loan type
        const loanType = (app.loan_type || '').toLowerCase().replace(/_/g, ' ');
        
        // Handle amount
        const amount = String(app.amount_requested || '').toLowerCase();
        const amountFormatted = Number(app.amount_requested || 0).toLocaleString().toLowerCase();
        
        // Handle phone
        const phone = (app.phone || '').toLowerCase();
        
        // Handle status
        const status = (app.status || '').toLowerCase();
        
        // Check if query matches any field
        return firstName.includes(query) ||
               lastName.includes(query) ||
               fullName.includes(query) ||
               reverseName.includes(query) ||
               email.includes(query) ||
               loanType.includes(query) ||
               amount.includes(query) ||
               amountFormatted.includes(query) ||
               phone.includes(query) ||
               status.includes(query);
      });
    }
    
    return filtered;
  };
  
  const filteredApplications = getFilteredApplications();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <AdminNavbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        onSearch={setSearchQuery}
      />

      {/* Main Layout: Sidebar + Content - No Gap */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed from top-16 */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area - Directly next to Sidebar, No Gap */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0">
          <div className="p-6 h-full flex flex-col">
            {/* Dashboard Analytics View */}
            {isDashboardView ? (
              <>
                {/* Welcome Card - Top */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-8 text-white shadow-xl relative overflow-hidden mb-6 flex-shrink-0">
                  <div className="relative z-10">
                    <p className="text-blue-100 text-sm mb-2">Welcome Back</p>
                    <h1 className="text-3xl font-bold mb-1">
                      {getGreeting()}, {user?.first_name || 'Admin'}
                    </h1>
                    <p className="text-blue-200 mb-6">Administrator • Blue Print Financial</p>
                    <div className="flex items-center space-x-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                        View Schedule
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                      <div className="flex items-center text-blue-100">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg border-2 border-white border-opacity-30 flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span>{loanStats.pending || 0} pending applications today</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative background */}
                  <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
                    <div className="h-full bg-white rounded-l-full"></div>
                  </div>
                </div>

                {/* Analytics Cards - Below Welcome Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 flex-shrink-0">
                  {/* Applications Today */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Applications Today</p>
                        <p className="text-3xl font-bold text-orange-600">{loanStats.pending || 0}</p>
                        <p className="text-xs text-orange-500 mt-1">Pending review</p>
                      </div>
                      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Applications This Month */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Applications This Month</p>
                        <p className="text-3xl font-bold text-blue-600">{loanStats.total_applications || 0}</p>
                        <p className="text-xs text-blue-500 mt-1">Total received</p>
                      </div>
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Approval Rate */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Approval Rate</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {loanStats.total_applications > 0 
                            ? Math.round((loanStats.approved / loanStats.total_applications) * 100) 
                            : 0}%
                        </p>
                        <p className="text-xs text-blue-500 mt-1">{loanStats.approved || 0} approved</p>
                      </div>
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Cancellations */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Cancellations</p>
                        <p className="text-3xl font-bold text-orange-600">{loanStats.rejected || 0}</p>
                        <p className="text-xs text-orange-500 mt-1">Rejected applications</p>
                      </div>
                      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                        <XCircle className="w-7 h-7 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strong Analytics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-shrink-0">
                  {/* Application Status Breakdown - Donut Chart */}
                  <ApplicationStatusChart loanStats={loanStats} />

                  {/* Applications Over Time - Bar Chart */}
                  <ApplicationsOverTimeChart recentLoans={recentLoans} />
                </div>

                {/* Second Row of Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 flex-shrink-0">
                  {/* Revenue Collection Chart */}
                  <RevenueChart paymentStats={paymentStats} recentPayments={recentPayments} />

                  {/* Approval Rate Trend */}
                  <ApprovalRateTrend loanStats={loanStats} />

                  {/* Payment Status Breakdown */}
                  <PaymentStatusChart paymentStats={paymentStats} />
                </div>

                {/* Applications Table with Tabs - Full Height */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">Today Applications</h2>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View All ({totalCount}) →
                    </button>
                  </div>
                  
                  {/* Tabs - Order: All, Approved, Pending, Rejected, Disbursed */}
                  <div className="px-6 py-4 border-b border-gray-200 flex space-x-4 flex-shrink-0">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center text-xs font-bold">
                        {totalCount}
                      </span>
                      <span>All</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('approved')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'approved'
                          ? 'bg-green-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center text-xs font-bold">
                        {approvedCount}
                      </span>
                      <span>Approved</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'pending'
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center text-xs font-bold">
                        {pendingCount}
                      </span>
                      <span>Pending</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('rejected')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'rejected'
                          ? 'bg-red-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center text-xs font-bold">
                        {rejectedCount}
                      </span>
                      <span>Rejected</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('disbursed')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === 'disbursed'
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center text-xs font-bold">
                        {disbursedCount}
                      </span>
                      <span>Disbursed</span>
                    </button>
                  </div>

                  {/* Table - Flexible Height, Scrollable */}
                  <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center">
                              {searchQuery.trim() ? (
                                <div className="flex flex-col items-center">
                                  <p className="text-sm text-gray-500 mb-1">No applications found for "{searchQuery}"</p>
                                  <p className="text-xs text-gray-400">Try searching with a different term</p>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No applications found.</p>
                              )}
                            </td>
                          </tr>
                        ) : (
                          filteredApplications.slice(0, 10).map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-600 font-medium text-xs">
                                      {app.first_name?.[0] || ''}{app.last_name?.[0] || ''}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{app.first_name || ''} {app.last_name || ''}</p>
                                    <p className="text-xs text-gray-500">{app.email || ''}</p>
                                  </div>
                                </div>
                              </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {app.loan_type?.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₦{Number(app.amount_requested).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                app.status === 'approved' || app.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="text-primary-600 hover:text-primary-900 flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-1" /> View
                              </button>
                            </td>
                          </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              /* Filtered View - Full Width Table */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filter === 'all' ? 'All Applications' :
                     filter === 'pending' ? 'Pending Applications' :
                     filter === 'approved' ? 'Approved Applications' :
                     filter === 'disbursed' ? 'Disbursed Loans' : 'Applications'}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-primary-600 font-medium text-xs">
                                  {app.first_name?.[0]}{app.last_name?.[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{app.first_name} {app.last_name}</p>
                                <p className="text-xs text-gray-500">{app.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {app.loan_type?.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{Number(app.amount_requested).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                              app.status === 'approved' || app.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="text-primary-600 hover:text-primary-900 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-gray-200 shadow-xl relative my-4 max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Application Details</span>
                <span className="sm:hidden">Details</span>
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              {/* Applicant Information */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                <div className="flex items-center mb-2 sm:mb-3">
                  <User className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Applicant Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-start">
                    <User className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Name</p>
                      <p className="font-medium text-gray-900 break-words">{selectedApp.first_name} {selectedApp.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Email</p>
                      <p className="font-medium text-gray-900 text-xs break-all">{selectedApp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start col-span-1 sm:col-span-2">
                    <Phone className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                      <p className="font-medium text-gray-900 break-words">{selectedApp.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                <div className="flex items-center mb-2 sm:mb-3">
                  <FileText className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Loan Application Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Loan Type</p>
                    <p className="font-semibold text-gray-900 capitalize break-words">{selectedApp.loan_type?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="font-semibold text-green-600 break-words">₦{Number(selectedApp.amount_requested).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900 break-words">{selectedApp.loan_duration} months</p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
                <div className="flex items-center mb-2">
                  <Target className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Purpose</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-white rounded p-2 border border-purple-200 break-words">{selectedApp.purpose || 'Not specified'}</p>
              </div>

              {/* Bank Details */}
              <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100">
                <div className="flex items-center mb-2 sm:mb-3">
                  <Building2 className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Bank Details for Disbursement</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="font-semibold text-gray-900 break-words">{selectedApp.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                    <p className="font-mono font-semibold text-gray-900 text-xs break-all">{selectedApp.bank_account_number || 'N/A'}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Account Name</p>
                    <p className="font-semibold text-gray-900 break-words">{selectedApp.account_name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4 flex-shrink-0">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-xs sm:text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {selectedApp.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedApp.id, 'approved', { interestRate: 15 })}
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg px-4 py-2 sm:py-2.5 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" /> <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg px-4 py-2 sm:py-2.5 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0" /> <span>Reject</span>
                      </button>
                    </>
                  )}
                  {selectedApp.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedApp.id, 'disbursed')}
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg px-4 py-2 sm:py-2.5 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" /> <span>Mark as Disbursed</span>
                    </button>
                  )}
                  {(selectedApp.status === 'disbursed' || selectedApp.status === 'rejected') && (
                    <div className="w-full bg-gray-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 font-medium">No further actions available for this status.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
