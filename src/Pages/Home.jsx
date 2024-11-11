import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster
import Carousel from '../components/home/Carousel';
import Navbar from '../components/Navbar';
import CategoryCardHolder from '../components/home/holders/CategoryCardHolder';
import OfferCardSlider from '../components/home/holders/OfferCardSlider';
import ProductCardHolder from '../components/home/holders/ProductCardHolder';
import Ads from '../components/home/Ads';
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
    <div className="min-h-screen flex flex-col items-center w-full">
      {/* Toast Notifications */}
      <Toaster /> {/* Display the toast globally */}

      {/* Navbar */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Navbar title={"Home"} />
      </div>

      {/* Carousel */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Carousel slides={carouselData} />
      </div>

      {/* Offer Cards Slider */}
      <div className="w-full max-w-screen-lg px-4">
        <OfferCardSlider />
      </div>

      {/* Category Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <CategoryCardHolder />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <ProductCardHolder />
      </div>

      {/* Ads Section */}
      <div className="w-full max-w-screen-lg px-4 mt-8 mb-20">
        <Ads />
      </div>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
};

export default Home;
