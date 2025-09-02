import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: [], totalSpent: 0, completedCourses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login', { state: { returnTo: '/dashboard' } });
      return;
    }

    setLoading(true);
    API.get("/dashboard")
      .then((res) => {
        setStats(res.data);
        setError(null);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-lg dark:text-gray-200 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-red-500 dark:text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  // Create simple chart data
  const chartData = stats.orders.map(order => ({
    id: order._id || order.id,
    amount: order.amount,
    date: new Date(order.created_at || Date.now()).toLocaleDateString()
  }));

  return (
    <div className="p-6 transition-all duration-500">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your learning progress and purchases</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-80">Total Spent</div>
                <div className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-80">Completed Courses</div>
                <div className="text-3xl font-bold">{stats.completedCourses}</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-80">Total Orders</div>
                <div className="text-3xl font-bold">{stats.orders.length}</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Purchase History</h3>
          
          {chartData.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="mb-8 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Spending Overview</h4>
                <div className="h-64 flex items-end justify-around gap-2">
                  {chartData.map((data, index) => (
                    <div key={data.id || index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md transition-all hover:opacity-90"
                        style={{ 
                          height: `${(data.amount / Math.max(...chartData.map(d => d.amount))) * 100}%`,
                          minHeight: '20px'
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">{data.date}</div>
                      <div className="text-xs font-medium">${data.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.orders.map((order, index) => (
                    <tr key={order._id || order.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(order.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        ${order.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {order.status || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet.</p>
              <button 
                onClick={() => navigate('/courses')} 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
              >
                Browse courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
