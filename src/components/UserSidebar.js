import React, { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard,
  User,
  Plus,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: FileText,
      path: '/applications'
    },
    {
      id: 'payments',
      label: 'My Payments',
      icon: CreditCard,
      path: '/payments'
    },
    {
      id: 'apply-loan',
      label: 'Apply for Loan',
      icon: Plus,
      path: '/apply-loan'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      path: '/profile'
    }
  ], []);

  const handleNavigation = useCallback((item) => {
    navigate(item.path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [navigate, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const isActive = useCallback((item) => {
    if (item.path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(item.path);
  }, [location.pathname]);

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
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl z-50
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
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-300'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.memo(UserSidebar);
