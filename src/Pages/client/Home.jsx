import React, { useState, useEffect } from 'react';
import Carousel from '../../components/client/home/Carousel';
import CategoryCardHolder from '../../components/client/home/holders/CategoryCardHolder';
import ProductCardHolder from '../../components/client/home/holders/ProductCardHolder';
import Ads from '../../components/client/home/Ads';
import { fetchCarouselData } from '../../api/ClientApi';

const Home = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);  

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
    <div className="min-h-screen bg-palette-body flex flex-col items-center w-full mt-12">
      {/* Carousel */}
      <div className="w-full max-w-lg mt-4 px-2">
        <Carousel slides={carouselData} settings={customSettings} />
      </div>

      {/* Category Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <CategoryCardHolder page='Home' title='Categories' onCategorySelection={handleCategorySelection} />
      </div>

      {/* Ads Section */}
      <div className="w-full max-w-screen-lg px-4 mt-8">
        <Ads />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg">
        <ProductCardHolder 
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
};

export default Home;
