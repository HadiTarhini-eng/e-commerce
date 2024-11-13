import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Import toast for notifications
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addToCart } from '../../../redux/cartSlice'; // Import the addToCart action
import { useNavigate } from 'react-router-dom';

const ProductCard = ({
  image,
  title,
  newPrice,
  oldPrice,
  chipText,
  chipColor,
  destination,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch from Redux

  const handleClick = () => {
    setIsActive(!isActive);
    navigate(destination);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    toast.success(`${title} added to the cart!`); // Show toast notification
    setClicked(true);

    // Dispatch action to add the product to the cart (with quantity set to 1)
    dispatch(
      addToCart({
        productId: title, // Use title as a unique identifier, or you could use product.id
        title,
        newPrice,
        oldPrice,
        image,
        quantity: 1, // Always 1 for each product added from the ProductCard
        chipText,
        chipColor,
      })
    );

    // Reset animation after a short delay (the duration of the animation)
    setTimeout(() => setClicked(false), 500); // Animation lasts 500ms
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
        className={`absolute top-2 left-2 px-2 py-1 text-white text-xs rounded-xl`}
        style={{ backgroundColor: chipColor }}
      >
        {chipText}
      </div>

      {/* Image */}
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-md" />

      {/* Title */}
      <h3 className="font-bold text-black text-left text-xl">{title}</h3>

      {/* Prices */}
      <div className="flex justify-left items-left space-x-2 mb-2">
        <span className="font-bold text-black font-['Roboto']">${newPrice}</span>
        <span className="line-through text-gray-500 text-sm font-['Roboto']">${oldPrice}</span>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-2 right-2">
        <button
          className={`relative inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
          onClick={handleAddToCart}
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
            className={`relative z-10 transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
          >
            +
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
