import React, { useState } from "react";
import Slider from "react-slick";

export default function CustomPaging({ setSelectedScent, scents }) {
  const [slider, setSlider] = useState(null); // To keep track of the slider instance
  const [activeIndex, setActiveIndex] = useState(0); // Track the active scent index

  // Slider settings
  const settings = {
    autoplay: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Slider navigation handler when a scent name button is clicked
  const handleButtonClick = (index) => {
    setActiveIndex(index); // Set the active index
    if (slider) {
      slider.slickGoTo(index); // Navigate to the slide at the given index
    }

    // Set the selected scent in the parent component
    const selectedScent = scents[index];
    setSelectedScent(selectedScent);
  };

  return (
    <div className="w-full mx-auto h-[400px]">
      <Slider
        {...settings}
        ref={(sliderInstance) => setSlider(sliderInstance)} // Set the slider instance
        afterChange={(index) => setActiveIndex(index)} // Update active index on slide change
      >
        {/* Slider images */}
        {scents.map((scent) => (
          <div key={scent.id} className="relative">
            <img
              src={scent.image} 
              alt={scent.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        ))}
      </Slider>

      {/* Buttons to control the slider */}
      <div className="flex justify-center space-x-4 mt-4">
        {scents.map((scent, index) => (
          <button
            key={scent.id}
            onClick={() => handleButtonClick(index)}
            className={`px-6 py-2 text-white rounded-md transition-colors duration-300 ${
              activeIndex === index ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {scent.name}
          </button>
        ))}
      </div>
    </div>
  );
}
