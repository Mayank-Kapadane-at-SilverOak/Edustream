import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getToken, getUser, checkAuthStatus } from "../utils/auth";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const navigate = useNavigate();

  // Check auth status whenever component renders
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    
    // Use checkAuthStatus instead of direct API call
    checkAuthStatus().then(authenticated => {
      setIsAuth(authenticated);
      setLoading(false);
    });
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item, index) => {
      const id = item._id || item.id || index;
      return id !== itemId;
    });
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
  };

  const checkout = async () => {
    if (!isAuth) {
      navigate('/login', { state: { returnTo: '/cart' } });
      return;
    }

    setCheckingOut(true);

    try {
      // Format the order data
      const orderData = {
        courses: cart.map(item => item._id || item.id),
        amount: calculateTotal(),
        status: 'pending'
      };

      // Send the order to the API
      const response = await API.post('/orders', orderData);
      
      // Clear the cart after successful checkout
      localStorage.setItem("cart", JSON.stringify([]));
      
      // Show success message
      setCheckoutSuccess(true);
      
      // Reset cart state
      setTimeout(() => {
        setCart([]);
        setCheckingOut(false);
      }, 1000);
      
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckingOut(false);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-lg dark:text-gray-200 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <span>Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Cart</h2>
        <span className="text-gray-600 dark:text-gray-400">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
      </div>

      {checkoutSuccess ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Purchase Successful!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your order has been placed successfully.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
            >
              View Dashboard
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Browse More Courses
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Your cart is empty</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added any courses to your cart yet.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {item.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id || item.id || index)}
                  className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  aria-label="Remove from cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {!isAuth ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start space-x-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-3 font-medium">
                    Please login to complete your purchase
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors shadow-md"
                  >
                    Login to Continue
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={checkout}
                disabled={checkingOut}
                className={`w-full py-3 rounded-xl font-semibold text-lg ${
                  checkingOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md'
                }`}
              >
                {checkingOut ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span>Processing...</span>
                  </div>
                ) : 'Complete Purchase'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
