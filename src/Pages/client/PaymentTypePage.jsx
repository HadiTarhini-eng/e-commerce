import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import CategoryCardHolder from '../../components/client/home/holders/CategoryCardHolder';

const PaymentTypePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelection = (category) => {
    // If you want to perform specific logic, you can update this
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center w-full mt-12">
      {/* Category Cards Holder */}
      <div className="w-full max-w-screen-lg px-4">
        <CategoryCardHolder page="Payment" title="Choose Payment" onCategorySelection={handleCategorySelection} />
      </div>
    </div>
  );
};

export default PaymentTypePage;
