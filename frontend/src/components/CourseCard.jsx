import { useState } from 'react';

export default function CourseCard({ course }) {
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if course is already in cart
    if (!cart.some(item => item._id === course._id || item.id === course.id)) {
      cart.push(course);
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Show success animation
      setTimeout(() => {
        setIsAdding(false);
      }, 600);
    } else {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {course.media_url && !videoError ? (
        <div className="relative">
          <video 
            src={course.media_url} 
            controls={isHovered}
            className="w-full h-52 object-cover"
            onError={() => setVideoError(true)}
          />
          {!isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <div className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 inline-block px-3 py-1 rounded-full mb-2 shadow-lg">
                  ${course.price}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-52 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent rounded-full blur-xl"></div>
          </div>
          <span className="text-white text-3xl font-bold relative z-10">{course.title.charAt(0)}</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{course.title}</h3>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
            Online
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
        
        <button
          onClick={addToCart}
          disabled={isAdding}
          className={`w-full py-3 rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
            isAdding 
              ? 'bg-green-500 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isAdding ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
              Buy for ${course.price}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
