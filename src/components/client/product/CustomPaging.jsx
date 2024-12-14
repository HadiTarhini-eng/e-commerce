import React, { useState, useImperativeHandle, forwardRef } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Import specific icon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

const CustomPaging = forwardRef(({ setSelectedScent, scents, onSlideChange }, ref) => {
  const [slider, setSlider] = useState(null); // To keep track of the slider instance

  // Slider settings
  const settings = {
    autoplay: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Slider navigation handler
  const handleSliderChange = (index) => {
    if (onSlideChange) {
      onSlideChange(index); // Pass the active index to the parent
    }
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
        afterChange={handleSliderChange} // Update active index on slide change
        className="h-[350px] rounded-br-[150px] overflow-hidden bg-palette-body-4 !flex justify-center items-center"
      >
        {/* Slider images */}
        {scents.map((scent) => (
          <div key={scent.id} className="p-2 relative bg-palette-body-4 !flex justify-center items-center">
            <img
              src={scent.image}
              alt={scent.name}
              className="bg-palette-white rounded-full border-2 border-palette-white"
            />
          </div>
        ))}
      </Slider>

      {/* Left button */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-palette-mimi-pink-2 p-1 rounded-full z-10"
        onClick={() => slider && slider.slickPrev()}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> {/* Left arrow icon */}
      </button>

      {/* Right button */}
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-palette-mimi-pink-2 p-1 rounded-full z-10"
        onClick={() => slider && slider.slickNext()}
      >
        <FontAwesomeIcon icon={faArrowRight} /> {/* Corrected FontAwesome icon */}
      </button>
    </div>
  );
});

export default CustomPaging;
