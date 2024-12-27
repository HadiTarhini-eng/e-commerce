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
      className={`relative p-2 sm:p-3 md:p-4 max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[24rem] w-[70px] sm:w-[100px] md:w-[140px] lg:w-[180px] rounded-lg shadow-sm 
    cursor-pointer transition-all duration-300 ease-in-out transform bg-palette-white
    ${isActive ? 'border-2 border-palette-mimi-pink-2' : 'border-2 border-grey-700'}`}
    >
      <div className="flex justify-center">
        <img
          className="max-w-10 max-h-11 min-w-10 min-h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-full"
          src={`/images/categories/${image}`}
          alt={title}
        />
      </div>

      {/* Title with responsive font size and text truncation */}
      <h3
        className="text-center font-semibold transition-colors duration-300 truncate"
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
