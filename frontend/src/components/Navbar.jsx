import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    
    // Initial count
    updateCartCount();
    
    // Listen for storage events
    window.addEventListener('storage', updateCartCount);
    
    // Check if cart items change
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          E
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduStream</h1>
      </Link>

      <div className="flex items-center gap-6">
        <Link 
          to="/courses" 
          className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative ${
            isActive('/courses') ? 'font-medium text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          Courses
          {isActive('/courses') && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          )}
        </Link>
        <Link 
          to="/dashboard" 
          className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative ${
            isActive('/dashboard') ? 'font-medium text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          Dashboard
          {isActive('/dashboard') && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          )}
        </Link>
        <Link 
          to="/cart" 
          className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative ${
            isActive('/cart') ? 'font-medium text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
          {isActive('/cart') && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          )}
        </Link>
        <DarkModeToggle />
        <button
          onClick={logout}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
