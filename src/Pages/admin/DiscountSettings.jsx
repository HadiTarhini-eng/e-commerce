import React, { useState, useEffect } from 'react';
import { fetchDiscountSettings, postDiscountSettings } from '../../api/adminApi';
import toast from 'react-hot-toast';

const DiscountSettings = () => {
  const [firstOrderDiscount, setFirstOrderDiscount] = useState(false);
  const [firstOrderDiscountAmount, setFirstOrderDiscountAmount] = useState(0); // New state for the amount
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryThreshold, setDeliveryThreshold] = useState(0);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch discount settings
  useEffect(() => {
    const loadDiscountSettings = async () => {
      try {
        const settings = await fetchDiscountSettings();
        setFirstOrderDiscount(settings.firstOrderDiscount);
        setFirstOrderDiscountAmount(settings.firstOrderDiscountAmount); // Set the amount from the settings
        setFreeDelivery(settings.freeDelivery);
        setDeliveryThreshold(settings.deliveryThreshold);
        setLoading(false);
      } catch (error) {
        setError('Failed to load settings.');
        setLoading(false);
      }
    };

    loadDiscountSettings();
  }, []);

  // Handle toggling of options
  const handleFirstOrderDiscountToggle = () => {
    setFirstOrderDiscount((prev) => !prev);
  };

  const handleFreeDeliveryToggle = () => {
    setFreeDelivery((prev) => !prev);
  };

  const handleDeliveryThresholdChange = (e) => {
    setDeliveryThreshold(e.target.value);
  };

  // Handle first order discount amount change
  const handleFirstOrderDiscountAmountChange = (e) => {
    setFirstOrderDiscountAmount(e.target.value);
  };

  // Handle save action (send data back to the server or API)
  const handleSave = async () => {
    try {
      const updatedSettings = {
        firstOrderDiscount,
        firstOrderDiscountAmount, // Include the discount amount
        freeDelivery,
        deliveryThreshold,
      };

      // Save the updated settings
      await postDiscountSettings(updatedSettings); // Call POST API function

      // Update the state with the new settings after successful save
      setFirstOrderDiscount(updatedSettings.firstOrderDiscount);
      setFirstOrderDiscountAmount(updatedSettings.firstOrderDiscountAmount); // Update the amount
      setFreeDelivery(updatedSettings.freeDelivery);
      setDeliveryThreshold(updatedSettings.deliveryThreshold);

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Errro saving settings');
    }
  };

  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border animate-spin text-blue-500" role="status"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        Discount Settings
      </h1>   

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={firstOrderDiscount}
            onChange={handleFirstOrderDiscountToggle}
            className="w-5 h-5 rounded border-gray-300 text-palette-button focus:ring-palette-button"
          />
          <label className="text-gray-700">First Order Discount</label>
        </div>
      </div>

      {firstOrderDiscount && (
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={firstOrderDiscountAmount}
              onChange={handleFirstOrderDiscountAmountChange}
              className="w-20 p-2 border border-gray-300 rounded-md"
              min="0"
            />
            <label className="text-gray-700">% For First Order Discount Amount</label>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={handleFreeDeliveryToggle}
            className="w-5 h-5 text-palette-button"
          />
          <label className="text-gray-700">Free Delivery on Orders Over</label>
        </div>
      </div>

      {freeDelivery && (
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={deliveryThreshold}
              onChange={handleDeliveryThresholdChange}
              className="w-20 p-2 border border-gray-300 rounded-md"
              min="0"
            />
            <label className="text-gray-700">$ For Free Delivery</label>
          </div>
        </div>
      )}

      <div className="mt-6 w-full flex justify-end">
        <button
          onClick={handleSave}
          className="w-fit py-2 px-4 bg-palette-button font-bold text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default DiscountSettings;
