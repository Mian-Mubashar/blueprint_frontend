import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import UserLayout from '../components/UserLayout';

const RepaymentSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [loanDetails, setLoanDetails] = useState(null);

  useEffect(() => {
    fetchRepaymentSchedule();
  }, [id]);

  const fetchRepaymentSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/loans/${id}/repayment-schedule`);
      
      if (response.data && response.data.schedule && response.data.loan) {
        setSchedule(response.data.schedule);
        setLoanDetails(response.data.loan);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Repayment schedule error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to load repayment schedule';
      toast.error(errorMessage);
      
      // Only navigate if it's a real error, not just missing data
      if (error.response?.status === 404 || error.response?.status === 400) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!schedule || schedule.length === 0) return 0;
    const paid = schedule.filter(p => p.status === 'paid').length;
    return (paid / schedule.length) * 100;
  };

  const getTotalPaid = () => {
    if (!schedule) return 0;
    return schedule
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  const getTotalRemaining = () => {
    if (!schedule) return 0;
    return schedule
      .filter(p => p.status !== 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  const getOverduePayments = () => {
    if (!schedule) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return schedule.filter(p => {
      if (p.status === 'paid') return false;
      const dueDate = new Date(p.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  };

  const handleDownloadStatement = () => {
    if (!schedule || !loanDetails) {
      toast.error('No data available to download');
      return;
    }

    try {
      const totalPaidAmount = getTotalPaid();
      const totalRemainingAmount = getTotalRemaining();
      const progressPercent = calculateProgress();
      const totalInterest = schedule.reduce((sum, p) => sum + parseFloat(p.interest || 0), 0);
      const totalRepayment = schedule.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Helper function to format currency - using NGN prefix for PDF compatibility
      const formatCurrency = (amount) => {
        const num = parseFloat(amount || 0);
        // Format with commas and 2 decimal places
        const formatted = num.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
        return `NGN ${formatted}`;
      };

      // Helper function to format date
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      // Header with gradient effect
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Blue Print Financial Ltd', pageWidth / 2, 18, { align: 'center' });
      doc.setFontSize(16);
      doc.text('Loan Repayment Schedule', pageWidth / 2, 28, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Repayment Statement', pageWidth / 2, 36, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPos = 55;

      // Loan Information Section - Boxed
      doc.setFillColor(240, 248, 255);
      doc.rect(14, yPos - 5, pageWidth - 28, 50, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, yPos - 5, pageWidth - 28, 50, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('Loan Information', 20, yPos);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const loanDetailsData = [
        ['Loan ID:', `#${loanDetails.id}`],
        ['Loan Type:', loanDetails.loan_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())],
        ['Loan Amount:', formatCurrency(loanDetails.amount_requested)],
        ['Interest Rate:', `${loanDetails.interest_rate || 15}%`],
        ['Duration:', `${loanDetails.loan_duration} months`],
        ['Monthly Payment:', formatCurrency(loanDetails.monthly_repayment || 0)],
        ['Generated Date:', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })]
      ];

      loanDetailsData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 75, yPos);
        yPos += 5.5;
      });

      yPos += 10;

      // Repayment Schedule Table Header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('Repayment Schedule', 14, yPos);
      yPos += 8;

      // Table header with better styling
      doc.setFillColor(30, 58, 138);
      doc.rect(14, yPos - 6, pageWidth - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      const headers = ['#', 'Due Date', 'Amount', 'Principal', 'Interest', 'Remaining', 'Status'];
      const colWidths = [10, 33, 33, 30, 26, 33, 25];
      let xPos = 16;
      
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos);
        xPos += colWidths[i];
      });
      
      doc.setTextColor(0, 0, 0);
      yPos += 10;

      // Table rows with better formatting
      schedule.forEach((payment, index) => {
        // Check if new page needed
        if (yPos > pageHeight - 25) {
          doc.addPage();
          yPos = 20;
          // Redraw header on new page
          doc.setFillColor(30, 58, 138);
          doc.rect(14, yPos - 6, pageWidth - 28, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          xPos = 16;
          headers.forEach((header, i) => {
            doc.text(header, xPos, yPos);
            xPos += colWidths[i];
          });
          doc.setTextColor(0, 0, 0);
          yPos += 10;
        }

        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(14, yPos - 5, pageWidth - 28, 6, 'F');
        }

        xPos = 16;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        
        const dueDate = new Date(payment.due_date);
        const rowData = [
          String(index + 1),
          formatDate(payment.due_date),
          formatCurrency(payment.amount),
          formatCurrency(payment.principal || 0),
          formatCurrency(payment.interest || 0),
          formatCurrency(payment.remaining_balance || 0),
          payment.status === 'paid' ? 'Paid' : 'Pending'
        ];

        rowData.forEach((cell, colIndex) => {
          let cellText = String(cell);
          // Ensure text fits in column
          const maxWidth = colWidths[colIndex] - 2;
          if (doc.getTextWidth(cellText) > maxWidth) {
            // Truncate if too long
            while (doc.getTextWidth(cellText + '...') > maxWidth && cellText.length > 0) {
              cellText = cellText.slice(0, -1);
            }
            cellText += '...';
          }
          doc.text(cellText, xPos, yPos);
          xPos += colWidths[colIndex];
        });

        yPos += 6;
      });

      yPos += 8;

      // Summary Section - Boxed
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 248, 255);
      doc.rect(14, yPos - 5, pageWidth - 28, 45, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, yPos - 5, pageWidth - 28, 45, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('Payment Summary', 20, yPos);
      yPos += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const summaryData = [
        ['Total Loan Amount:', formatCurrency(loanDetails.amount_requested)],
        ['Total Interest:', formatCurrency(totalInterest)],
        ['Total Repayment:', formatCurrency(totalRepayment)],
        ['Total Paid:', formatCurrency(totalPaidAmount)],
        ['Total Remaining:', formatCurrency(totalRemainingAmount)],
        ['Progress:', `${progressPercent.toFixed(1)}%`]
      ];

      summaryData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 5.5;
      });

      yPos += 8;

      // Calculation Explanation Section
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(255, 250, 240);
      doc.rect(14, yPos - 5, pageWidth - 28, 60, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, yPos - 5, pageWidth - 28, 60, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('How Principal & Interest are Calculated', 20, yPos);
      yPos += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      const explanationText = [
        'This loan uses an amortization schedule where:',
        '',
        '1. Monthly Interest = Remaining Balance x (Annual Rate / 12)',
        '   Example: NGN 20,000 x (15% / 12) = NGN 250.00',
        '',
        '2. Principal Payment = Monthly Payment - Interest',
        '   Example: NGN 556.61 - NGN 250.00 = NGN 306.61',
        '',
        '3. Remaining Balance = Previous Balance - Principal',
        '   Example: NGN 20,000 - NGN 306.61 = NGN 19,693.39',
        '',
        'Note: As you pay, interest decreases and principal increases.'
      ];

      explanationText.forEach((line) => {
        if (line.trim() === '') {
          yPos += 3;
        } else {
          doc.text(line, 20, yPos);
          yPos += 5;
        }
      });

      // Footer on all pages
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Blue Print Financial Ltd | Lagos, Nigeria | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 12,
          { align: 'center' }
        );
        doc.text(
          `Generated on ${new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      }

      // Save PDF
      const fileName = `Loan-Schedule-${loanDetails.id}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF statement downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      console.error('Error details:', error.message, error.stack);
      toast.error(`Failed to download PDF: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="w-full flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </UserLayout>
    );
  }

  if (!schedule || !loanDetails) {
    return (
      <UserLayout>
        <div className="w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Repayment Schedule Found</h2>
              <p className="text-gray-600 mb-6">This loan may not have been approved or disbursed yet.</p>
              <Link to="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  const progress = calculateProgress();
  const totalPaid = getTotalPaid();
  const totalRemaining = getTotalRemaining();
  const overduePayments = getOverduePayments();

  return (
    <UserLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Repayment Schedule</h1>
              <p className="text-gray-600 mt-2">Track your loan payments and stay on schedule</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/payment"
                state={{ loanId: loanDetails?.id }}
                className="btn-primary flex items-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Make Payment
              </Link>
              <button 
                onClick={handleDownloadStatement}
                className="btn-outline flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Statement
              </button>
            </div>
          </div>
        </div>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Loan Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{parseFloat(loanDetails.amount_requested).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{totalRemaining.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Repayment Progress</h3>
              <span className="text-sm text-gray-600">
                {schedule.filter(p => p.status === 'paid').length} of {schedule.length} payments
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Monthly Payment</p>
              <p className="text-xl font-bold text-gray-900">
                ₦{parseFloat(loanDetails.monthly_repayment || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {loanDetails.interest_rate || 'N/A'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Repayment Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {loanDetails.loan_duration} months
              </p>
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Please make these payments as soon as possible to avoid additional fees.
                </p>
                <Link 
                  to="/payment" 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Repayment Schedule Table */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">All scheduled payments for your loan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((payment, index) => {
                  const dueDate = new Date(payment.due_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isOverdue = dueDate < today && payment.status !== 'paid';
                  const isUpcoming = dueDate >= today && payment.status !== 'paid';

                  return (
                    <tr 
                      key={payment.id || index}
                      className={payment.status === 'paid' ? 'bg-green-50' : isOverdue ? 'bg-red-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Payment {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dueDate.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₦{parseFloat(payment.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          ₦{parseFloat(payment.principal || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          ₦{parseFloat(payment.interest || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : isOverdue
                            ? 'bg-red-100 text-red-800'
                            : isUpcoming
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.status !== 'paid' && (
                          <Link
                            to="/payment"
                            state={{ 
                              loanId: loanDetails.id, 
                              amount: payment.amount,
                              paymentId: payment.id,
                              dueDate: payment.due_date
                            }}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Pay Now
                          </Link>
                        )}
                        {payment.status === 'paid' && (
                          <span className="text-green-600 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Loan Amount:</span>
                <span className="font-semibold">₦{parseFloat(loanDetails.amount_requested).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold">₦{schedule.reduce((sum, p) => sum + parseFloat(p.interest || 0), 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-900 font-semibold">Total Repayment:</span>
                <span className="font-bold text-primary-600">
                  ₦{schedule.reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Note:</strong> Payments are processed within 1-2 business days. 
                Please ensure sufficient funds are available in your account.
              </p>
              <p>
                <strong>Late Fees:</strong> Payments made after the due date may incur late fees. 
                Please contact us if you need assistance.
              </p>
              <p>
                <strong>Early Repayment:</strong> You can pay off your loan early without penalties. 
                Contact us for more information.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default RepaymentSchedule;

