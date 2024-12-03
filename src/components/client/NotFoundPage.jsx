// src/components/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl mt-4">Oops! Page Not Found</p>
      <p className="text-xl mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-lg text-blue-600 hover:underline">Go back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
