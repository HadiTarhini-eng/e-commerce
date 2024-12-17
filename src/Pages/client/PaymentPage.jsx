import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, clearCheckoutData } from '../../redux/cartSlice';
import toast from 'react-hot-toast';
import { submitOrder } from '../../api/clientApi';
import { useAuth } from '../../components/client/AuthContext';

const PaymentPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const dispatch = useDispatch();

  // Access cart and checkout data from Redux store
  const { cart, checkoutData } = useSelector((state) => state.cart);

  // Access the logged-in user ID from AuthContext
  const { isLoggedIn, userId } = useAuth(); // We now directly use userId from AuthContext

  // Scroll to top when the component is mounted
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle Confirm Purchase button click
  const handleConfirmPurchase = async () => {
    try {
      if (!isLoggedIn) {
        toast.error('You must be logged in to make a purchase.');
        return;
      }

      if (!userId) {
        toast.error('User ID not found.');
        return;
      }

      // Prepare the payload to send in the POST request
      const payload = {
        cart,
        checkoutData,
        userId, // Include the user ID in the payload
      };

      // Call the submitOrder function from the API file
      const response = await submitOrder(payload); // Use the function from the API file
      console.log('Order confirmed:', response);

      // Clear the cart and checkout data, and navigate to home
      toast.success('You have successfully purchased your order!');
      dispatch(clearCart());
      dispatch(clearCheckoutData());
      navigate('/'); // Navigate to the home page
    } catch (error) {
      console.error('Error confirming purchase:', error);
      toast.error('There was an error confirming your order.');
    }
  };

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center justify-center w-full">
      {/* Button to confirm purchase */}
      <button
        onClick={handleConfirmPurchase}
        className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600"
      >
        Confirm Purchase
      </button>
    </div>
  );
};

export default PaymentPage;
