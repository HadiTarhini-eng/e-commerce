import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BottomDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const productData = {
    images: [
      "https://via.placeholder.com/300x200?text=Image+1",
      "https://via.placeholder.com/300x200?text=Image+2",
      "https://via.placeholder.com/300x200?text=Image+3",
    ],
    title: "Product Title",
    newPrice: 49.99,
    oldPrice: 59.99,
    chipText: "Sale",
    chipColor: "red",
  };

  return (
    <div>
      {/* Trigger Button */}
      <div className="text-center">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          onClick={toggleDrawer}
        >
          Show bottom drawer
        </button>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 w-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
        >
          <h5
            id="drawer-bottom-label"
            className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
          >
            Product Details
          </h5>
          <button
            type="button"
            onClick={toggleDrawer}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5"
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
              />
            </svg>
          </button>

          {/* Carousel */}
          <Slider {...carouselSettings}>
            {productData.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Slider>

          {/* Product Info */}
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              {productData.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-lg font-bold text-red-500">
                ${productData.newPrice}
              </p>
              {productData.oldPrice && (
                <p className="text-lg text-gray-500 line-through">
                  ${productData.oldPrice}
                </p>
              )}
            </div>
            <div
              className={`inline-block px-2 py-1 rounded-full text-sm font-semibold text-white bg-${productData.chipColor}-500 mt-3`}
            >
              {productData.chipText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomDrawer;
