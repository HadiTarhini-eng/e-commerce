import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import Navbar from '../components/Navbar';
import CategoryCardHolder from '../components/CategoryCardHolder';
import OfferCardSlider from '../components/OfferCardSlider';
import ProductCardHolder from '../components/ProductCardHolder';
import Ads from '../components/Ads';
import SearchBar from '../components/SearchBar';
import FooterNav from '../components/FooterNav';

const Home = () => {
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const carouselResponse = await fetch('/data/carouselData.json');
      const carouselJson = await carouselResponse.json();
      setCarouselData(carouselJson.carousels);
      console.log(carouselJson);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full">
      {/* Navbar */}
      <Navbar />

      {/* Search Bar */}
      <div className="w-full max-w-lg px-4 mt-4">
        <SearchBar placeholder="Search for products, categories, etc." />
      </div>

      {/* Carousel */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Carousel slides={carouselData} />
      </div>

      {/* Category Cards Holder */}
      <div className="w-full max-w-screen-lg px-4 mt-8">
        <CategoryCardHolder />
      </div>

      {/* Offer Cards Slider */}
      <div className="w-full max-w-screen-lg px-4 mt-8">
        <OfferCardSlider />
      </div>

      {/* Ads Section */}
      <div className="w-full max-w-screen-lg px-4 mt-8">
        <Ads />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg px-4 mt-8">
        <ProductCardHolder />
      </div>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
};

export default Home;
