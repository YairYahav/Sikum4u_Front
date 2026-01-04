import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100">
      <Link to="/" className="hover:text-indigo-600 transition-colors">
        <Home size={16} />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronLeft size={16} className="mx-2 text-gray-400" />
          {item.link ? (
            <Link to={item.link} className="hover:text-indigo-600 font-medium transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-gray-800">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;