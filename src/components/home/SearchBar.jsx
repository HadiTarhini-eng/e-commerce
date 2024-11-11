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
        className="w-full p-3 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-pale-peach"
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
            d="M11 4a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7zM11 4v4m0 4v4"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
