import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const FooterNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-3">
      <div className="flex justify-around items-center">
        {/* Home Icon */}
        <Link to="/home" className="text-gray-700 hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2 2 5-5 5 5 2-2M5 12V7a2 2 0 012-2h10a2 2 0 012 2v5m-2 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
            />
          </svg>
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="text-gray-700 hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h18l1 12H4L3 3zm2 0L4 9h16l-1-6H5z"
            />
          </svg>
        </Link>

        {/* Settings Icon */}
        <Link to="/settings" className="text-gray-700 hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 0v4m0-4h4m-4 0H8m5-6a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
