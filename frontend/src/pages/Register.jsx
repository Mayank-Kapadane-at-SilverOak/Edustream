import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { setToken, setUser } from "../utils/auth";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const res = await API.post("/register", form);
        
        // Store token and user data
        setToken(res.data.token);
        setUser(res.data.user);
        
        console.log("Registration successful:", res.data);
        navigate("/courses");
        
      } catch (err) {
        console.error("Registration error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Registration failed. Please try again!");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduStream</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Start your learning journey</p>
          </div>
          
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Create Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-white"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account? 
              <Link to="/login" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
}
