import React, { useState, useEffect } from 'react';
import OfferCard from '../cards/OfferCard'; // Import the OfferCard component

const OfferCardSlider = () => {
  const [offers, setOffers] = useState([]); // State to store fetched offers
  const [loading, setLoading] = useState(true); // Loading state to show a spinner or message

  // Fetch offers data from the JSON file
  useEffect(() => {
    fetch('/data/client/offerCardData.json') // Assuming the JSON file is located in the public/data folder
      .then((response) => response.json())
      .then((data) => {
        setOffers(data.offers); // Store the offers in the state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner while data is being fetched
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mt-8">
      {/* Title */}
      <h2 className="font-bold text-taupe-brown text-2xl mb-4">
        Offers
      </h2>

      {/* Scrollable Container */}
      <div className="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
        {offers.map((offer) => (
          <div key={offer.id} className="flex-shrink-0 w-1/3">
            <OfferCard
              image={offer.image}
              title={offer.title}
              newPrice={offer.newPrice}
              oldPrice={offer.oldPrice}
              destination={offer.destination}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferCardSlider;
