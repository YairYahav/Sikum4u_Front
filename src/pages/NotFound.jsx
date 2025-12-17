import React from 'react';

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          404
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Oops! Page not found.
        </p>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;