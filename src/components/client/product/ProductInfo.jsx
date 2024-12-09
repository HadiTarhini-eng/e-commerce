import React from 'react';
import CustomPaging from './CustomPaging';

const ProductInfo = ({ images, title, newPrice, oldPrice, chipText, chipColor, setSelectedScent, hasScents }) => {
  // If the data is not available, we assume it's still loading
  const isLoading = !images || !title || !newPrice; // Example condition for loading state

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      {/* Image Skeleton */}
      <div className="relative mb-6">
        <div className="w-full h-96 bg-gray-300 rounded-t-[50%] animate-pulse"></div>
      </div>

      {/* Text and Price Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col text-left">
          <div className="w-3/4 h-8 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
          <div className="w-1/2 h-6 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="w-1/3 h-4 bg-gray-300 rounded-md mt-4 animate-pulse"></div>
        </div>

        {/* Chip Skeleton */}
        <div className="w-24 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  // If data is still loading, show the skeleton loader
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // When data is ready, show the actual product info
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      {/* Image Container with Curved Border and Artistic Shape */}
      <div className="relative mb-6 overflow-hidden">
        {hasScents ? (
            <CustomPaging setSelectedScent={setSelectedScent} scents={images} />
        ) : null}
      </div>

      {/* Product Info (Title, Price, Chip) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col text-left">
          <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
          <div className="mt-4">
            <p className="text-2xl font-bold text-green-500">${newPrice}</p>
            {oldPrice && (
              <p className="text-xl text-gray-500 line-through">${oldPrice}</p>
            )}
          </div>
        </div>

        {/* Chip */}
        {chipText && (
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${chipColor === 'green' ? 'bg-green-500' : 
              chipColor === 'blue' ? 'bg-blue-500' :
              chipColor === 'red' ? 'bg-red-500' : 
              chipColor === 'yellow' ? 'bg-yellow-500' :
              chipColor === 'purple' ? 'bg-purple-500' : 
              chipColor === 'orange' ? 'bg-orange-500' : 'bg-gray-500'}`}
          >
            {chipText}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
