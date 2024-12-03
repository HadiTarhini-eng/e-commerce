import React, { useState, useEffect } from 'react';
import { fetchAdsData } from '../../../api/ClientApi';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ad data from the JSON file
  useEffect(() => {
    // Define an inner async function and call it immediately
    const fetchData = async () => {
      try {
        const adsData = await fetchAdsData();
        setAds(adsData); // Set the ads data in state
      } catch (err) {
        setError(err.message); // Set error message if there is an issue
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component mounts

  // Conditional rendering
  if (isLoading) {
    return <div>Loading ads...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="relative w-full bg-white shadow-lg rounded-lg p-4 flex items-center justify-between"
          style={{ backgroundColor: '#FF6347' }} // You can change this to a dynamic color
        >
          {/* Icon on the left */}
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mr-4">
            <img src={ad.icon} alt="ad icon" className="w-8 h-8" />
          </div>

          {/* Text on the right */}
          <div className="text-white">
            {/* Discount Text */}
            <div className="font-bold text-lg mb-2">
              Get {ad.discount}% discount!
            </div>

            {/* Instructions Text */}
            <div className="text-sm">
              To get discount, enter the <span className="font-bold">GET{ad.discount}</span> code on the checkout page.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ads;
