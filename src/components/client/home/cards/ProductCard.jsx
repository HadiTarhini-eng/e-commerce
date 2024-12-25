import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

// Import Heroicons (Plus icon in this case)
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import useToggleFavorite from '../../../../hooks/useToggleFavorite';

const ProductCard = ({
  id,
  image,
  title,
  createdAt,
  newPrice,
  oldPrice,
  chipText,
  chipColor,
  discountValue,
  destination,
  isFavorited: initialFavoriteStatus,
  totalStock,
  onShowDrawer,
  updatedProductId,
  onToggleFavorite
}) => {
  const [isActive, setIsActive] = useState(false);
  const [clicked] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const outOfStock = totalStock === 0;

  const handleFavoriteClick = (e) => {
    if(!isLoggedIn) {
      e.stopPropagation();
      navigate('/signin')
      toast.error('You must Login to access this feature!')
    } else {
      e.stopPropagation(); // Prevent parent click handler
      onToggleFavorite(id, title, initialFavoriteStatus); // Inform parent to toggle favorite
    }
  };

  const handleClick = () => {
    if (outOfStock) {
      toast.error(`${title} is out of stock!`);
    } else {
      setIsActive(!isActive);
      navigate(destination);
    }
  };

  const handleOpenDrawer = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    if (outOfStock) {
      toast.error(`${title} is out of stock!`);
    } else if (!isLoggedIn) {
      navigate('/signin');
    } else {
      updatedProductId(id);
      onShowDrawer();
    }
  };

  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.endsWith('.00') ? parseFloat(formattedPrice).toFixed(0) : formattedPrice;
  };

  return (
    <div
      className={`relative bg-white shadow-lg rounded-lg p-4 w-full cursor-pointer ${outOfStock ? 'cursor-not-allowed' : ''
        }`}
      onClick={handleClick} // This is responsible for the redirection
    >
      {/* Out of Stock Badge */}
      {outOfStock && (
        <div className="absolute w-full text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6 font-bold text-lg px-2 py-2 rounded-md">
          <img src="../../../../../src/assets/image/icons/out_of_stock.png" alt="OUT OF STOCK" />
        </div>
      )}
      <div className={` ${outOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {/* Chip */}
        <div
          className={`absolute top-2 left-2 px-2 py-[1px] text-white text-xs rounded-xl`}
          style={{ backgroundColor: chipColor }}
        >
          {chipText}
        </div>

        {/* Heart Icon */}
        <div
          className={'absolute top-[7px] right-2 cursor-pointer transition-colors'}
          onClick={handleFavoriteClick}
        >
          {initialFavoriteStatus ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 h-5 text-red-500"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              stroke="red"
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
        <img src={`/images/products/${image}`} alt={title} className="w-full h-fit object-cover rounded-md mt-3" />

        {/* Title */}
        <h3 className="font-bold text-black text-left text-xl">{title}</h3>

        {/* Prices */}
        <div className="flex justify-left items-center flex-row space-x-1">
          <span className="font-bold text-black font-['Roboto']">${formatPrice(newPrice)}</span>
          {oldPrice !== null && (
            <span className="line-through text-gray-500 text-sm font-['Roboto']">
              ${formatPrice(oldPrice)}
            </span>
          )}

          {/* Add Button */}
          <div className="w-full flex justify-end">
            <button
              className={`relative items-center justify-center w-6 h-6 bg-pink-300 text-white rounded-full transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
              onClick={handleOpenDrawer}
            >
              {/* Animation background span */}
              <span
                className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 rounded-full transform ${clicked ? 'bg-green-500 translate-x-0' : 'display-none'}`}
              >
                {/* Checkmark icon that appears when clicked */}
                {clicked && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>

              {/* Default content of the button */}
              <span
                className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
              >
                <ShoppingCartIcon className="w-4 h-4 text-white" /> {/* Heroicons ShoppingCartIcon */}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
