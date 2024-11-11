import React from 'react';

const ProductInfo = ({ image, title, newPrice, oldPrice, chipText, chipColor }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      {/* Image Container with Curved Border and Artistic Shape */}
      <div className="relative mb-6 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-96 rounded-t-[50%] shadow-xl transform transition duration-300 hover:scale-105"
          style={{
            clipPath: 'polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%)',
          }}
        />
      </div>

      {/* Product Info (Title, Price, Chip) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col text-left">
          <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
          <div className="mt-4">
            <p className="text-xl font-bold text-green-500">{newPrice}</p>
            {oldPrice && (
              <p className="text-sm text-gray-500 line-through">{oldPrice}</p>
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
