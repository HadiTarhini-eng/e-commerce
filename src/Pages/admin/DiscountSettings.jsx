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
    if (!firstOrderDiscount) {
      setFirstOrderDiscountAmount(0); // Reset the discount amount if turned off
    }
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Discount Settings</h2>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={firstOrderDiscount}
            onChange={handleFirstOrderDiscountToggle}
            className="w-5 h-5 text-blue-500"
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
            <label className="text-gray-700">First Order Discount Amount</label>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={handleFreeDeliveryToggle}
            className="w-5 h-5 text-blue-500"
          />
          <label className="text-gray-700">Free Delivery on Orders Over</label>
          <input
            type="number"
            value={deliveryThreshold}
            onChange={handleDeliveryThresholdChange}
            disabled={!freeDelivery}
            className="w-20 p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default DiscountSettings;
