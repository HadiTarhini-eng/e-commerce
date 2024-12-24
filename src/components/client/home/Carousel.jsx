import React from 'react';
import Slider from 'react-slick';

const Carousel = ({ slides, settings }) => {
  const defaultSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: false,
    autoplaySpeed: 3000,
    ...settings,
  };

  return (
    <div className="w-full mx-auto max-w-[500px]">
      <Slider {...defaultSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div className="relative w-full h-48">
              <img
                src={slide.image}
                alt={slide.header}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Header positioned at top-left with background opacity */}
            {slide.showHeader && slide.header && (
              <div className="absolute top-4 left-4 p-4 text-white text-xl font-semibold bg-black bg-opacity-50">
                {slide.header}
              </div>
            )}

            {/* Text positioned in the center with background opacity */}
            {slide.showParagraph && slide.paragraph && (
              <div className="absolute top-20 left-4 transform text-white text-base font-medium p-4 text-center bg-black bg-opacity-50">
                {slide.paragraph}
              </div>
            )}

            {/* Button positioned at bottom-right without background opacity */}
            {slide.showButton && slide.buttonText && (
              <div className="absolute bottom-2 right-4">
                <a href={slide.buttonPath} target="_blank" rel="noopener noreferrer">
                  <button
                    className="px-4 py-2 text-white rounded-lg"
                    style={{ backgroundColor: slide.buttonColor }}
                  >
                    {slide.buttonText}
                  </button>
                </a>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
