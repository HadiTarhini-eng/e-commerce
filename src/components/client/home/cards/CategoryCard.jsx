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
      className={`relative p-4 max-w-[16rem] rounded-md bg-white shadow-md cursor-pointer 
        transition-all duration-300 ease-in-out transform 
        hover:scale-105
        ${isActive ? 'bg-soft-pink' : 'hover:bg-light-cream'} 
        active:bg-light-cream`} // Ensure 'bg-soft-pink' is applied correctly
    >
      <div className="flex justify-center mb-2">
        <img
          className="w-20 h-20 object-cover rounded-full"
          src={image}
          alt={title}
        />
      </div>

      {/* Title with responsive font size and text truncation */}
      <h3
        className={`text-center font-semibold text-dark-charcoal transition-colors duration-300
          ${isActive ? 'text-white' : 'text-gray-700'} 
          `}
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
