import React, { useState } from 'react';

const SearchBar = ({ placeholder, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value); // Pass the search term to parent component
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="w-full p-1 pl-10 pr-1 text-dark-charcoal border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-charcoal"
        placeholder={placeholder || 'Search...'}
      />
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M18.5 10a7.5 7.5 0 10-7 7.5 7.5 7.5 0 007-7.5z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
