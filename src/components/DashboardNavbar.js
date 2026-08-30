import React from "react";
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../images/logo.png";

const DashboardNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-auto sm:w-12"
            />
            <span className="block text-base sm:text-lg font-bold text-gray-900 leading-tight">
              Blue Print Microfinance
            </span>
          </Link>

          {/* Desktop User Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">{user?.first_name} {user?.last_name}</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

    </nav>
  );
};

export default React.memo(DashboardNavbar);
