import React, { useState, useImperativeHandle, forwardRef } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Import specific icon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

const CustomPaging = forwardRef(({ images, isInBottomDrawer }, ref) => {
  const [slider, setSlider] = useState(null); // To keep track of the slider instance

  // Slider settings
  const settings = {
    autoplay: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Expose slider instance to parent
  useImperativeHandle(ref, () => ({
    slickGoTo: (index) => {
      if (slider) {
        slider.slickGoTo(index); // Navigate to the specific slide
      }
    },
    slickPrev: () => {
      if (slider) {
        slider.slickPrev(); // Go to the previous slide
      }
    },
    slickNext: () => {
      if (slider) {
        slider.slickNext(); // Go to the next slide
      }
    }
  }));

  return (
    <div className="w-full mx-auto h-full relative">
      <Slider
        {...settings}
        ref={(sliderInstance) => setSlider(sliderInstance)} // Set the slider instance
        className={`overflow-hidden !flex justify-center items-center ${isInBottomDrawer ? 'h-[200px] bg-palette-white' : 'h-[360px] bg-palette-body-4 rounded-br-[150px]'}`}
      >
        {/* Slider images */}
        {images.map((image, index) => (
          <div key={image.id || index} className={`p-2 relative !flex justify-center items-center ${isInBottomDrawer ? 'bg-palette-white' : 'bg-palette-body-4'}`}>
            <img
              src={`/images/products/${image.image}`}
              alt={image.name}
              className={`bg-palette-white border-2 border-palette-white object-contain ${isInBottomDrawer ? 'w-[200px] h-[200px]' : 'w-[330px] h-[330px] rounded-full'}`}
            />
          </div>
        ))}
      </Slider>

      {/* Left button */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-palette-mimi-pink-2 p-1 rounded-full z-10 hover:bg-palette-body-4 focus:outline-none"
        onClick={() => slider && slider.slickPrev()}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> {/* Left arrow icon */}
      </button>

      {/* Right button */}
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-palette-mimi-pink-2 p-1 rounded-full z-10 hover:bg-palette-body-4 focus:outline-none"
        onClick={() => slider && slider.slickNext()}
      >
        <FontAwesomeIcon icon={faArrowRight} /> {/* Corrected FontAwesome icon */}
      </button>
    </div>
  );
});

export default CustomPaging;
