import React, { useState } from 'react';

const CategoryCard = ({ image, title, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleCardClick = () => {
    setIsActive(!isActive); // Toggle active state when clicked
    if (onClick) {
      onClick(); // If a parent callback is provided, call it
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative p-2 sm:p-3 md:p-4 max-w-[16rem] sm:max-w-[18rem] rounded-lg shadow-sm 
    cursor-pointer transition-all duration-300 ease-in-out transform bg-palette-white
    ${isActive ? 'border-2 border-palette-mimi-pink-2' : 'border-2 border-grey-700'}`}
    >
      <div className="flex justify-center">
        <img
          className="max-w-10 max-h-11 min-w-10 min-h-11 sm:min-w-16 object-cover rounded-full"
          src={`/images/categories/${image}`}
          alt={title}
        />
      </div>

      {/* Title with responsive font size and text truncation */}
      <h3
        className="text-center text-black font-semibold transition-colors duration-300 truncate"
        style={{
          fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)', // Adjusted responsive font size
        }}
      >
        {title}
      </h3>
    </div>
  );
};

export default CategoryCard;
