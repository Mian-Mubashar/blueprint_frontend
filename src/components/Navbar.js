import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Payment", path: "/quick-payment" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-auto sm:w-16 md:w-20"
            />
            <span className={`text-base sm:text-lg md:text-xl font-bold ${
              isScrolled ? "text-gray-900" : "text-white"
            } hidden sm:block`}>
              Blue Print Microfinance
            </span>
            <span className={`text-base font-bold ${
              isScrolled ? "text-gray-900" : "text-white"
            } sm:hidden`}>
              BPM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm xl:text-base font-medium transition-colors duration-200 hover:text-primary-600 whitespace-nowrap ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 xl:space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 xl:space-x-2 transition-colors text-sm xl:text-base ${
                    isScrolled ? "text-gray-700 hover:text-primary-600" : "text-white hover:text-primary-400"
                  }`}
                >
                  <User className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="hidden xl:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 xl:space-x-2 transition-colors text-sm xl:text-base ${
                    isScrolled ? "text-gray-700 hover:text-primary-600" : "text-white hover:text-primary-400"
                  }`}
                >
                  <LogOut className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 hover:text-primary-600 whitespace-nowrap ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm xl:text-base px-3 xl:px-4 py-1.5 xl:py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-1 max-w-7xl mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2.5 text-gray-900 font-medium hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2.5 text-gray-900 font-medium hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 text-gray-900 font-medium hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-md"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2.5 text-gray-900 font-medium hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors rounded-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
