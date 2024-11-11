import React, { useState } from 'react';
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

  return (
    <div
      className={`relative bg-white shadow-lg rounded-lg p-4 w-full cursor-pointer
      ${isActive ? 'bg-light-cream text-gray-800' : 'text-gray-500'} 
        hover:bg-light-cream active:bg-light-cream`}
      onClick={handleClick}
    >
      {/* Chip */}
      <div
        className={`absolute top-2 left-2 px-2 py-1 text-white text-xs rounded-md`}
        style={{ backgroundColor: chipColor }}
      >
        {chipText}
      </div>

      {/* Heart Icon */}
      <div className="absolute top-2 right-2 cursor-pointer" onClick={toggleFavorite}>
        {isFavorited ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-6 h-6 text-red-500"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="w-6 h-6 text-gray-400"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.35l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        )}
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

      {/* Ratings */}
      <div className="flex justify-center items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill={index < rating ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 17.27l6.18 3.73-1.64-7.19L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.57L5.82 21z"
            />
          </svg>
        ))}
      </div>

      {/* Add Button */}
      <div className="absolute bottom-2 right-2">
        <button className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
