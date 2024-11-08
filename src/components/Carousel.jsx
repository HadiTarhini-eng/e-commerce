import React from 'react';

const Carousel = ({ items, onImageClick }) => {
  // Handle image click
  const handleImageClick = (index, imageSrc) => {
    if (onImageClick) {
      onImageClick(index, imageSrc); // Call the passed callback
    }
  };

  return (
    <div id="carouselExampleIndicators" className="relative">
      {/* Carousel indicators */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0 sm:mx-[5%] md:mx-[10%]"
        data-twe-carousel-indicators
      >
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            data-twe-target="#carouselExampleIndicators"
            data-twe-slide-to={index}
            data-twe-carousel-active
            className="mx-[3px] h-[3px] w-[30px] cursor-pointer bg-white opacity-50 transition-opacity duration-600 ease-in-out sm:w-[20px] sm:h-[2px]"
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel items */}
      <div className="relative w-full overflow-hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative float-left w-full transition-transform duration-600 ease-in-out"
            data-twe-carousel-item
            data-twe-carousel-active={index === 0 ? 'true' : 'false'}
          >
            <img
              src={item.src}
              alt={`Slide ${index + 1}`}
              className="block w-full rounded-lg"
              onClick={() => handleImageClick(index, item.src)}
            />
          </div>
        ))}
      </div>

      {/* Carousel controls - prev item */}
      <button
        className="absolute top-0 bottom-0 left-0 z-[1] flex w-[15%] items-center justify-center text-white opacity-50 transition-opacity duration-150 ease-in-out sm:w-[10%] md:w-[12%]"
        type="button"
        data-twe-target="#carouselExampleIndicators"
        data-twe-slide="prev"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </span>
        <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip[rect(0,0,0,0)]">
          Previous
        </span>
      </button>

      {/* Carousel controls - next item */}
      <button
        className="absolute top-0 bottom-0 right-0 z-[1] flex w-[15%] items-center justify-center text-white opacity-50 transition-opacity duration-150 ease-in-out sm:w-[10%] md:w-[12%]"
        type="button"
        data-twe-target="#carouselExampleIndicators"
        data-twe-slide="next"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
        <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip[rect(0,0,0,0)]">
          Next
        </span>
      </button>
    </div>
  );
};

export default Carousel;
