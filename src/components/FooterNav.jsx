import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const FooterNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-3">
      <div className="flex justify-around items-center">
        {/* Home Icon */}
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          <img
            src="../assets/image/icons/home.png"  // Use <img> to load the image
            alt="Home"
            className="w-8 h-8"  // Set size of the icon
          />
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="text-gray-700 hover:text-blue-500">
          <img
            src="../assets/image/icons/cart.png"  // Use <img> to load the image
            alt="Cart"
            className="w-8 h-8"  // Set size of the icon
          />
        </Link>

        {/* Socials Icon */}
        <Link to="#" className="text-gray-700 hover:text-blue-500">
          <img
            src="../assets/image/icons/socials.png"  // Use <img> to load the image
            alt="Socials"
            className="w-8 h-8"  // Set size of the icon
          />
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
