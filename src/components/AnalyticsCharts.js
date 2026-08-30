import React from 'react';
import { TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

// Donut Chart Component for Application Status Breakdown
export const ApplicationStatusChart = ({ loanStats }) => {
  const total = loanStats.total_applications || 1;
  const pending = loanStats.pending || 0;
  const approved = loanStats.approved || 0;
  const disbursed = loanStats.disbursed || 0;
  const rejected = loanStats.rejected || 0;

  const data = [
    { label: 'Pending', value: pending, color: '#f59e0b', percentage: Math.round((pending / total) * 100) },
    { label: 'Approved', value: approved, color: '#10b981', percentage: Math.round((approved / total) * 100) },
    { label: 'Disbursed', value: disbursed, color: '#3b82f6', percentage: Math.round((disbursed / total) * 100) },
    { label: 'Rejected', value: rejected, color: '#ef4444', percentage: Math.round((rejected / total) * 100) }
  ];

  // Calculate angles for donut chart
  let currentAngle = -90;
  const segments = data.map(item => {
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status Breakdown</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {segments.map((segment, index) => {
              if (segment.value === 0) return null;
              
              const startAngleRad = (segment.startAngle * Math.PI) / 180;
              const endAngleRad = (segment.endAngle * Math.PI) / 180;
              
              const x1 = 100 + 80 * Math.cos(startAngleRad);
              const y1 = 100 + 80 * Math.sin(startAngleRad);
              const x2 = 100 + 80 * Math.cos(endAngleRad);
              const y2 = 100 + 80 * Math.sin(endAngleRad);
              
              const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
            <circle cx="100" cy="100" r="50" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              <span className="text-xs text-gray-500">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bar Chart Component for Applications Over Time
export const ApplicationsOverTimeChart = ({ recentLoans }) => {
  // Get last 7 days data
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = recentLoans.filter(loan => {
      const loanDate = new Date(loan.created_at).toISOString().split('T')[0];
      return loanDate === dateStr;
    }).length;
    
    last7Days.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: count
    });
  }

  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Applications Overview</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg font-medium">Weekly</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium hover:bg-gray-200">Monthly</button>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 space-x-2 mb-4">
        {last7Days.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-full">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 cursor-pointer group relative"
                style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {day.count} applications
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{day.day}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{last7Days.reduce((sum, d) => sum + d.count, 0)}</span> new applications this week
        </p>
        <p className="text-xs text-gray-500 mt-1">Total Applications: {recentLoans.length}</p>
      </div>
    </div>
  );
};

// Revenue Collection Chart
export const RevenueChart = ({ paymentStats, recentPayments }) => {
  const totalCollected = Number(paymentStats.total_collected || 0);
  const completedPayments = paymentStats.completed_payments || 0;
  const pendingPayments = paymentStats.pending_payments || 0;

  // Last 6 months revenue (mock data - can be replaced with real data)
  const monthlyData = [
    { month: 'Jan', amount: totalCollected * 0.8 },
    { month: 'Feb', amount: totalCollected * 0.9 },
    { month: 'Mar', amount: totalCollected * 0.7 },
    { month: 'Apr', amount: totalCollected * 0.95 },
    { month: 'May', amount: totalCollected * 0.85 },
    { month: 'Jun', amount: totalCollected }
  ];

  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Collection</h3>
        <DollarSign className="w-5 h-5 text-green-500" />
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">₦{totalCollected.toLocaleString()}</span>
          <span className="text-sm text-green-600 font-medium">+12.5%</span>
        </div>
        <p className="text-sm text-gray-500">Total collected this month</p>
      </div>

      <div className="flex items-end justify-between h-32 space-x-2 mb-4">
        {monthlyData.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-full">
              <div
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg hover:from-green-700 hover:to-green-500 transition-all duration-300 cursor-pointer group relative"
                style={{ height: `${(month.amount / maxAmount) * 100}%`, minHeight: month.amount > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ₦{Math.round(month.amount).toLocaleString()}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{month.month}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Completed Payments</span>
          <span className="text-sm font-semibold text-green-600">{completedPayments}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pending Payments</span>
          <span className="text-sm font-semibold text-yellow-600">{pendingPayments}</span>
        </div>
      </div>
    </div>
  );
};

// Approval Rate Trend
export const ApprovalRateTrend = ({ loanStats }) => {
  const approvalRate = loanStats.total_applications > 0 
    ? Math.round((loanStats.approved / loanStats.total_applications) * 100) 
    : 0;

  // Mock trend data (can be replaced with real data)
  const trendData = [
    { week: 'W1', rate: approvalRate * 0.85 },
    { week: 'W2', rate: approvalRate * 0.90 },
    { week: 'W3', rate: approvalRate * 0.88 },
    { week: 'W4', rate: approvalRate }
  ];

  const maxRate = Math.max(...trendData.map(d => d.rate), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Approval Rate Trend</h3>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-3xl font-bold text-blue-600">{approvalRate}%</span>
          <span className="text-sm text-green-600 font-medium">+5.2%</span>
        </div>
        <p className="text-sm text-gray-500">Current approval rate</p>
      </div>

      <div className="flex items-end justify-between h-32 space-x-2 mb-4">
        {trendData.map((week, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-full">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 cursor-pointer group relative"
                style={{ height: `${(week.rate / maxRate) * 100}%`, minHeight: week.rate > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {Math.round(week.rate)}%
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{week.week}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Approved</span>
          <span className="text-sm font-semibold text-green-600">{loanStats.approved || 0}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">Rejected</span>
          <span className="text-sm font-semibold text-red-600">{loanStats.rejected || 0}</span>
        </div>
      </div>
    </div>
  );
};

// Payment Status Breakdown
export const PaymentStatusChart = ({ paymentStats }) => {
  const total = paymentStats.total_payments || 1;
  const completed = paymentStats.completed_payments || 0;
  const pending = paymentStats.pending_payments || 0;
  const failed = total - completed - pending;

  const statuses = [
    { label: 'Completed', value: completed, color: '#10b981', icon: CheckCircle },
    { label: 'Pending', value: pending, color: '#f59e0b', icon: Clock },
    { label: 'Failed', value: failed, color: '#ef4444', icon: XCircle }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Status Breakdown</h3>

      <div className="space-y-4 mb-6">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const percentage = Math.round((status.value / total) * 100);
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4`} style={{ color: status.color }} />
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">{status.value}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: status.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Payments</span>
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
};

