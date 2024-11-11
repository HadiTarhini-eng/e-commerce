import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddToCart = () => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Handle Add to Cart functionality
  const handleAddToCart = () => {
    // Display a success toast when the item is added to the cart
    toast.success(`${quantity} item(s) added to the cart!`);
    // You can add further logic here to update the actual cart (e.g., storing cart data in state or localStorage)
  };

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Quantity Control */}
      <div className="flex items-center rounded-lg overflow-hidden">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="px-6 py-2 text-lg font-semibold text-gray-700">{quantity}</span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
