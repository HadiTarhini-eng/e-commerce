import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Import toast for notifications
import { useNavigate } from 'react-router-dom';

const ProductCard = ({
  image,
  title,
  newPrice,
  oldPrice,
  rating,
  chipText,
  chipColor,
  destination
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate(); 

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleClick = () => {
    setIsActive(!isActive);
    navigate(destination); 
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    toast.success(`${title} added to the cart!`); // Show toast notification
  };

  return (
    <div
      className={`relative bg-white shadow-lg rounded-lg p-4 w-full cursor-pointer
      ${isActive ? 'bg-light-cream text-gray-800' : 'text-gray-500'} 
        hover:bg-light-cream active:bg-light-cream`}
      onClick={handleClick} // This is responsible for the redirection
    >
      {/* Chip */}
      <div
        className={`absolute top-2 left-2 px-2 py-1 text-white text-xs rounded-md`}
        style={{ backgroundColor: chipColor }}
      >
        {chipText}
      </div>

      {/* Image */}
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-md mb-2" />

      {/* Title */}
      <h3 className="font-bold text-black text-center mb-2 font-['Plus_Jakarta_Sans']">{title}</h3>

      {/* Prices */}
      <div className="flex justify-center items-center space-x-2 mb-2">
        <span className="font-bold text-black">{newPrice}</span>
        <span className="line-through text-gray-500">{oldPrice}</span>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-2 right-2">
        <button 
          className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center"
          onClick={handleAddToCart} // Trigger toast on click and stop propagation
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
