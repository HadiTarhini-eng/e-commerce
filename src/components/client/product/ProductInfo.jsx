import React, { useState, useRef } from 'react';
import CustomPaging from './CustomPaging';
import toast from 'react-hot-toast';
import useToggleFavorite from '../../../hooks/useToggleFavorite';

const ProductInfo = ({ images, dominant, title, newPrice, oldPrice, chipText, chipColor, setSelectedScent, hasScents, productId, scents, favorite, isInBottomDrawer, setIsScentSelected }) => {
  const isLoading = !images || !title || !newPrice;

  const { isFavorited, toggleFavorite } = useToggleFavorite(favorite, productId, title);
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null); // Use null for no scent selected initially

  const handleButtonClick = (index, scentStock) => {
    if(scentStock === 0) {
      toast.error('Scent is out of stock at the moment!');
    } else {
      const selectedScent = scents[index]; // Get the selected scent object

      if (selectedScent.scentStock === "0") {
        toast.error(`This scent for this item is out of stock!`);
      } else {
        setActiveIndex(index); // Set the selected scent index
        setSelectedScent(selectedScent); // Update the parent state with the selected scent
        setIsScentSelected(true); // Update the parent state to indicate a scent is selected
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(index); // Scroll to the selected scent image
        }
      }
    }
    
  };

  const isScentSelected = () => {
    return activeIndex !== null; // Check if a scent is selected
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.endsWith('.00') ? parseFloat(formattedPrice).toFixed(0) : formattedPrice;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-palette-body-3 overflow-hidden">
      <div className="relative bg-palette-white">
        {/* Conditionally render CustomPaging or the dominant image */}
        {hasScents && isScentSelected() ? (
          <CustomPaging
            ref={sliderRef}
            images={images}
            isInBottomDrawer={isInBottomDrawer}
          />
        ) : (
          <div
            className={`p-2 relative !flex justify-center items-center ${isInBottomDrawer ? 'bg-palette-white' : 'bg-palette-body-4'}`}
          >
            <img
              src={`/images/products/${dominant}`}
              alt="Dominant Image"
              className={`bg-palette-white border-2 border-palette-white object-contain ${isInBottomDrawer ? 'max-w-[180px] max-h-[180px]' : 'max-w-[330px] max-h-[330px] rounded-full'}`}
            />
          </div>
        )}
      </div>

      <div className={`w-full ${isInBottomDrawer ? 'bg-palette-white' : 'bg-palette-body-4'}`}>
        <div className={`w-full p-3 px-5 bg-palette-white rounded-tl-[50px] overflow-hidden ${isInBottomDrawer ? 'p-0' : 'p-3'}`}>
          <div className={`flex justify-between items-center ${isInBottomDrawer ? 'mb-2' : 'mb-6'}`}>
            <div className="flex flex-col text-left">
              <h2 className={`text-3xl font-semibold text-gray-800 ${isInBottomDrawer ? 'mt-0' : 'mt-4'}`}>{title}</h2>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-lg font-bold text-palette-chip-red">${formatPrice(newPrice)}</p>
                {oldPrice && (
                  <p className="text-lg text-gray-500 line-through">${formatPrice(oldPrice)}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div
                className="cursor-pointer"
                onClick={toggleFavorite}
              >
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

              {chipText && (
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white`}
                  style={{ backgroundColor: chipColor }}
                >
                  {chipText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scents */}
        {hasScents && (
          <div className={`bg-palette-white flex justify-center space-x-2 flex flex-col ${isInBottomDrawer ? 'mt-0' : 'mt-4'}`}>
            <h2 className="text-md font-semibold text-gray-800 px-4">Scents:</h2>
            <div className="flex justify-start space-x-2 p-2">
              {scents.map((scent, index) => (
                <button
                  key={scent.scentID}
                  onClick={() => handleButtonClick(index, scent.scentStock)}
                  className={`px-2 py-0 text-sm text-palette-complement-3 rounded-full transition-colors duration-300 ${
                    scent.scentStock === 0
                      ? "bg-gray-200 cursor-not-allowed"
                      : isScentSelected() && activeIndex === index
                      ? "border-2 border-palette-mimi-pink-2" // Only show the border when scent is selected
                      : "border-2 border-grey"
                  }`}
                >
                  {scent.scentName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
