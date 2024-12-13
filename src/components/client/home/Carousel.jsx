import React from 'react';
import Slider from 'react-slick';

const Carousel = ({ slides, settings }) => {
  const defaultSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    ...settings,
  };

  return (
    <div className="w-full mx-auto">
      <Slider {...defaultSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <img
              src={slide.image}
              alt={slide.header}
              className="w-full h-auto rounded-lg"
            />

            {(slide.header || slide.paragraph) && (
              <div className="absolute bottom-5 left-5 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-4/5">
                {slide.header && (
                  <h2 className="text-2xl font-semibold">{slide.header}</h2>
                )}
                {slide.paragraph && (
                  <p className="mt-2 text-base">{slide.paragraph}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
