import React, { useState, useRef } from 'react';
import CustomPaging from './CustomPaging';
import toast from 'react-hot-toast'; // To show success/error messages

const ProductInfo = ({ images, title, newPrice, oldPrice, chipText, chipColor, setSelectedScent, hasScents }) => {
  const isLoading = !images || !title || !newPrice; // Loading condition

  const [isFavorited, setIsFavorited] = useState(false); // Track the favorite state
  const sliderRef = useRef(null); // Reference to the CustomPaging slider
  const [activeIndex, setActiveIndex] = useState(0); // Track the active scent index

  const handleButtonClick = (index) => {
    setActiveIndex(index);
    const selectedScent = images[index];
    setSelectedScent(selectedScent);

    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index); // Scroll to the selected scent image
    }
  };

  const toggleFavorite = () => {
    setIsFavorited((prevState) => !prevState);
    if (isFavorited) {
      toast.error(`${title} removed from favorites!`);
    } else {
      toast.success(`${title} added to favorites!`);
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-palette-body-3 overflow-hidden">
      <div className="relative bg-palette-white">
        {hasScents ? (
          <CustomPaging
            ref={sliderRef} // Pass the ref to CustomPaging
            setSelectedScent={setSelectedScent}
            scents={images}
            onSlideChange={setActiveIndex}
          />
        ) : null}
      </div>

      <div className="w-full bg-palette-body-4">
        <div className="w-full p-3 px-5 bg-palette-white rounded-tl-[50px] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col text-left">
              <h2 className="text-3xl font-semibold text-gray-800 mt-4">{title}</h2>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-lg font-bold text-palette-chip-red">${newPrice}</p>
                {oldPrice && (
                  <p className="text-lg text-gray-500 line-through">${oldPrice}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Heart Icon */}
              <div
                className="cursor-pointer"
                onClick={toggleFavorite} // Toggle favorite status
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

              {/* Discount Chip */}
              {chipText && (
                <div
                  className={`inline-block px-2 py-1 rounded-full text-sm font-semibold text-white ${chipColor === 'green' ? 'bg-green-500' :
                    chipColor === 'blue' ? 'bg-blue-500' :
                      chipColor === 'red' ? 'bg-palette-chip-red' :
                        chipColor === 'yellow' ? 'bg-yellow-500' :
                          chipColor === 'purple' ? 'bg-purple-500' :
                            chipColor === 'orange' ? 'bg-orange-500' : 'bg-gray-500'}`}
                >
                  {chipText}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-palette-white flex justify-center space-x-2 mt-4 flex flex-col">
          <h2 className="text-md font-semibold text-gray-800 px-4">Scents:</h2>
          <div className="flex justify-start space-x-2 p-2">
            {images.map((scent, index) => (
              <button
                key={scent.id}
                onClick={() => handleButtonClick(index)}
                className={`px-2 py-0 text-sm text-palette-complement-3 rounded-full transition-colors duration-300 ${activeIndex === index ? "border-2 border-palette-mimi-pink-2" : "border-2 border-grey"
                  }`}
              >
                {scent.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
