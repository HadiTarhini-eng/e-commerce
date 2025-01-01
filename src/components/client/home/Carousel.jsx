import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

const Carousel = ({ slides, settings, isAdmin }) => {
  const navigate = useNavigate();

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

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full mx-auto max-w-[500px]">
      <Slider {...defaultSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div className="relative w-full h-48">
            <img
              src={isAdmin ? `/images/carousel/${slide.image}` : `/images/carousel/${slide.image}`}
              alt={slide.header}
              className="w-full h-full object-cover rounded-lg"
            />
            </div>

            {/* Header positioned at top-left with background opacity */}
            {slide.showHeader && slide.header && (
              <div 
                className="absolute top-4 left-4 p-1 text-white text-xl font-semibold bg-black bg-opacity-50"
                style={{ 
                          backgroundColor: `rgba(0, 0, 0, ${slide.headerBgOpacity})`,
                          borderRadius: `${slide.headerBgBorderRadius}px`, 
                          padding: `${slide.headerBgPadding}px`,
                      }}
              >
                {slide.header}
              </div>
            )}

            {/* Text positioned in the center with background opacity */}
            {slide.showParagraph && slide.paragraph && (
              <div 
                className="absolute top-20 left-4 transform text-white text-base font-medium p-4 text-center bg-black bg-opacity-50"
                style={{ 
                          backgroundColor: `rgba(0, 0, 0, ${slide.paragraphBgOpacity})`,
                          borderRadius: `${slide.paragraphBgBorderRadius}px`, 
                          padding: `${slide.paragraphBgPadding}px`,
                      }}
              >
                {slide.paragraph}
              </div>
            )}

            {/* Button positioned at bottom-right without background opacity */}
            {slide.showButton && slide.buttonText && (
              <div className="absolute bottom-2 right-4">
                <button
                  className="px-4 py-2 text-white rounded-lg"
                  style={{ backgroundColor: slide.buttonColor }}
                  onClick={() => handleButtonClick(slide.buttonPath)}
                >
                  {slide.buttonText}
                </button>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
