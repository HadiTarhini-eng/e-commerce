import React, { useState } from 'react';

const OfferCard = ({ image, title, newPrice, oldPrice, destination }) => {
  const [isClicked, setIsClicked] = useState(false);

  // Handle card click
  const handleClick = () => {
    setIsClicked(true);
    window.location.href = destination;
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer p-4 text-center rounded-lg shadow-lg transition-all duration-300 transform ${
        isClicked ? 'scale-95 bg-blue-100' : 'bg-white'
      } hover:bg-light-cream hover:shadow-xl hover:scale-105 overflow-hidden`}
    >
      {/* Image */}
      <img src={image} alt={title} className="mx-auto mb-2 rounded-lg" />

      {/* Title */}
      <h3 className={`font-bold ${isClicked ? 'text-blue-600' : 'text-black'}`}>{title}</h3>

      {/* Prices */}
      <div className="flex items-center justify-center space-x-2">
        <span className="font-bold text-black">{newPrice}</span>
        <span className="line-through text-gray-500">{oldPrice}</span>
      </div>
    </div>
  );
};

export default OfferCard;
