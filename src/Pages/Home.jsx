import React, { useState, useEffect } from 'react';
import Carousel from '../components/home/Carousel';
import CategoryCardHolder from '../components/home/holders/CategoryCardHolder';
import ProductCardHolder from '../components/home/holders/ProductCardHolder';
import Ads from '../components/home/Ads';

const Home = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // State for selected categories

  // Fetch carousel data
  useEffect(() => {
    const fetchData = async () => {
      const carouselResponse = await fetch('/data/carouselData.json');
      const carouselJson = await carouselResponse.json();
      setCarouselData(carouselJson.carousels);
    };

    fetchData();
  }, []);

  // Handle category selection/deselection
  const handleCategorySelection = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        // Remove category if it's already selected
        return prevCategories.filter((item) => item !== category);
      } else {
        // Add the category if it's not selected
        return [...prevCategories, category];
      }
    });
  };

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center w-full mt-12">
      {/* Carousel */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Carousel slides={carouselData} />
      </div>

      {/* Category Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <CategoryCardHolder page='Home' title='Categories' onCategorySelection={handleCategorySelection} />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <ProductCardHolder selectedCategories={selectedCategories} />
      </div>

      {/* Ads Section */}
      <div className="w-full max-w-screen-lg px-4 mt-8 mb-20">
        <Ads />
      </div>
    </div>
  );
};

export default Home;
