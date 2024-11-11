import React, { useState, useEffect } from "react";

const Carousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const Slide = React.memo(({ slide, index }) => (
    <div
      key={slide.id}
      className="relative w-full flex-shrink-0" // Make sure each slide takes full width of the container
      style={{ backfaceVisibility: "hidden" }}
    >
      <img
        src={slide.image}
        className="block w-full rounded-lg object-cover" // Make image fill the container properly
        alt={`Slide ${index + 1}`}
      />
      <div className="absolute inset-x-16 bottom-5 hidden py-5 text-center text-white md:block">
        <h5 className="text-xl">{slide.header}</h5>
        <p>{slide.paragraph}</p>
      </div>
    </div>
  ));

  return (
    <div
      id="carouselExampleIndicators"
      className="relative w-full overflow-hidden" // Ensure the container is full width and hides overflow
      data-twe-carousel-init
      data-twe-ride="carousel"
    >
      {/* Carousel indicators */}
      <div className="absolute bottom-0 left-0 right-0 z-2 mx-[15%] mb-4 flex list-none justify-center p-0">
        {slides.map((slide, index) => (
          <button
            key={slide.id || index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`mx-1 h-[3px] w-[30px] cursor-pointer bg-white transition-opacity duration-600 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-50"
            }`}
            aria-label={`Slide ${index + 1}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>

      {/* Carousel items */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-600 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`, // Move carousel container based on activeIndex
          }}
        >
          {slides.map((slide, index) => (
            <Slide key={slide.id || index} slide={slide} index={index} />
          ))}
        </div>
      </div>

      {/* Carousel controls - prev item */}
      <button
        className="absolute top-1/2 left-4 z-10 flex items-center justify-center text-white opacity-50 hover:opacity-90"
        type="button"
        onClick={handlePrev}
        aria-label="Previous"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </span>
      </button>

      {/* Carousel controls - next item */}
      <button
        className="absolute top-1/2 right-4 z-10 flex items-center justify-center text-white opacity-50 hover:opacity-90"
        type="button"
        onClick={handleNext}
        aria-label="Next"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
