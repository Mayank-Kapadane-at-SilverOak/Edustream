import { useState } from "react";
import API from "../api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setToken, setUser } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we need to return to a specific page after login
  const returnTo = location.state?.returnTo || "/courses";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await API.post("/login", form);
      
      // Store token and user data
      setToken(res.data.token);
      setUser(res.data.user);
      
      // Save credentials for silent re-auth if needed
      if (rememberMe) {
        sessionStorage.setItem("credentials", JSON.stringify({
          email: form.email,
          password: form.password
        }));
      }
      
      console.log("Login successful:", res.data);
      navigate(returnTo);
      
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduStream</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Access your learning journey</p>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Welcome Back</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-white"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-white"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Keep me signed in
              </label>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold mt-6 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md'
            }`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? 
            <Link to="/register" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">
              Create one now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
