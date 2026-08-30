import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign,
  XCircle,
  LogOut,
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      filter: null
    },
    {
      id: 'all',
      label: 'Total Applications',
      icon: FileText,
      path: '/admin',
      filter: 'all'
    },
    {
      id: 'approved',
      label: 'Approved',
      icon: CheckCircle,
      path: '/admin',
      filter: 'approved'
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      path: '/admin',
      filter: 'pending'
    },
    {
      id: 'rejected',
      label: 'Rejected',
      icon: XCircle,
      path: '/admin',
      filter: 'rejected'
    },
    {
      id: 'disbursed',
      label: 'Disbursed',
      icon: DollarSign,
      path: '/admin',
      filter: 'disbursed'
    },
    {
      id: 'payments',
      label: 'Payment History',
      icon: CreditCard,
      path: '/admin/payments',
      filter: null
    }
  ];

  const handleNavigation = (item) => {
    if (item.path === '/admin/payments') {
      navigate('/admin/payments');
    } else if (item.filter) {
      navigate(`/admin?filter=${item.filter}`);
    } else {
      navigate('/admin');
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.path === '/admin/payments') {
      return location.pathname === '/admin/payments';
    }
    
    const searchParams = new URLSearchParams(location.search);
    const currentFilter = searchParams.get('filter');
    
    if (item.filter === null && !currentFilter && location.pathname === '/admin') {
      return true;
    }
    return currentFilter === item.filter && location.pathname === '/admin';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Full Height */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:top-16 lg:h-[calc(100vh-4rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 flex-shrink-0 flex flex-col
        `}
      >
        {/* Navigation Menu - Flexible */}
        <nav className="p-4 space-y-1 mt-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-200'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
