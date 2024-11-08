import React, { useState } from 'react';

const CategoryCard = ({ image, title, onClick }) => {
  // State to track the click and apply active styles
  const [isActive, setIsActive] = useState(false);

  // Handle the card click to change its background and title color
  const handleCardClick = () => {
    setIsActive(!isActive);  // Toggle active state
    if (onClick) {
      onClick();  // Call the passed onClick function for each card
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative p-4 max-w-[18rem] rounded-lg bg-white shadow-lg cursor-pointer 
        transition-all duration-300 ease-in-out transform hover:scale-105 
        ${isActive ? 'bg-gray-100' : ''} 
        ${isActive ? 'text-gray-800' : 'text-gray-600'} 
        hover:ring-2 hover:ring-blue-500`} 
    >
      {/* Image */}
      <div className="flex justify-center mb-4">
        <img
          className="w-24 h-24 object-contain"
          src={image}
          alt={title}
        />
      </div>

      {/* Title */}
      <h3 className={`text-center font-bold text-lg transition-all duration-300 
        ${isActive ? 'text-blue-500' : 'text-gray-600'}`}
      >
        {title}
      </h3>

      {/* Hover ripple effect */}
      <div className="absolute inset-0 rounded-lg bg-transparent hover:bg-gray-200 transition-all duration-300 ease-in-out"></div>
    </div>
  );
};

const Categories = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          image={category.image}
          title={category.title}
          onClick={category.onClick}
        />
      ))}
    </div>
  );
};

export default Categories;
