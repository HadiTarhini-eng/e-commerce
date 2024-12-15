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
      className={`relative p-2 max-w-[16rem] rounded-lg shadow-sm 
        cursor-pointer transition-all duration-300 ease-in-out transform bg-palette-white
        ${isActive ? 'border-2 border-palette-mimi-pink-2' : 'border-2 border-grey-700'}`} // Background and text color based on active state
    >
      <div className="flex justify-center mb-2">
        <img
          className="w-full h-full object-cover rounded-full"
          src={image}
          alt={title}
        />
      </div>

      {/* Title with responsive font size and text truncation */}
      <h3
        className='text-center font-semibold transition-colors duration-300'
        style={{
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // Responsive font size
        }}
      >
        {title}
      </h3>
    </div>
  );
};

export default CategoryCard;
