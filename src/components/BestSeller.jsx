import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const BestSeller = ({ image, title, newPrice, oldPrice, destination }) => {
  const navigate = useNavigate(); // Using useNavigate hook for navigation

  const handleClick = () => {
    navigate(destination); // Navigate to the destination when the card is clicked
  };

  return (
    <div 
      className="w-full bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
      onClick={handleClick} // Trigger the handleClick function on card click
    >
      <div className="flex items-center p-4">
        {/* Image on the left */}
        <div className="w-1/3">
          <img src={image} alt={title} className="w-full h-auto object-cover rounded-lg" />
        </div>

        {/* Text content on the right */}
        <div className="w-2/3 pl-4">
          <h3 className="font-bold text-black text-xl">{title}</h3>
          <div className="mt-2">
            <span className="font-bold text-black text-lg">{newPrice}</span>
            <span className="text-gray-500 line-through ml-2">{oldPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
