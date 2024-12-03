import React, { useState, useEffect } from 'react';
import Carousel from '../../components/client/home/Carousel';
import CategoryCardHolder from '../../components/client/home/holders/CategoryCardHolder';
import ProductCardHolder from '../../components/client/home/holders/ProductCardHolder';
import Ads from '../../components/client/home/Ads';
import { fetchCarouselData } from '../../api/ClientApi';

const Home = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // State for selected categories

  useEffect(() => {
    // Define an inner async function and call it immediately
    const fetchData = async () => {
      try {
        const carouselResponse = await fetchCarouselData();
        setCarouselData(carouselResponse);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
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

  const customSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center w-full mt-12">
      {/* Carousel */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Carousel slides={carouselData} settings={customSettings} />
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
