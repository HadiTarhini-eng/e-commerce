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

  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.endsWith('.00') ? parseFloat(formattedPrice).toFixed(0) : formattedPrice;
  };

  return (
    <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto no-scrollbar mb-20 mt-4">
      <div className="flex items-start flex-col gap-6 xl:flex-row">
        {/* Order Details Section */}
        <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
          <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400">
            <div>
              <h2 className="font-manrope pb-6 font-bold text-3xl leading-10 text-black border-b border-gray-200">
                Checkout Details
              </h2>
            </div>

            <div className="data py-6 border-b border-gray-200">
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-normal text-lg leading-8 text-gray-400">Name</p>
                <p className="font-medium text-lg leading-8 text-gray-900">{checkoutData.name}</p>
              </div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-normal text-lg leading-8 text-gray-400">Email</p>
                <p className="font-medium text-lg leading-8 text-gray-900">{checkoutData.email}</p>
              </div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-normal text-lg leading-8 text-gray-400">Phone</p>
                <p className="font-medium text-lg leading-8 text-gray-900">{checkoutData.phoneNumber}</p>
              </div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-normal text-lg leading-8 text-gray-400">Address</p>
                <p className="font-medium text-lg leading-8 text-gray-900">{checkoutData.address}</p>
              </div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-normal text-lg leading-8 text-gray-400">Total</p>
                <p className="font-medium text-lg leading-8 text-gray-900">${formatPrice(checkoutData.totalWithDelivery)}</p>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-palette-button hover:bg-green-700 cursor-pointer"
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {cart.map((product, index) => (
              <div
                key={index}
                className="rounded-3xl p-6 bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="grid grid-cols-3 md:grid-cols-3 w-full gap-3 md:gap-8">
                  <div className="img-box">
                    <img
                      src={product.image || 'https://via.placeholder.com/122'}
                      alt={`${product.title} image`}
                      className="w-[80px] sm:w-[120px] rounded-xl object-cover"
                    />
                  </div>
                  <div className="col-span-2">
                    <h2 className="font-medium text-xl leading-8 text-black">{product.title}</h2>
                    <p className="font-normal text-lg leading-8 text-gray-500">{product.scentName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-lg leading-8 text-palette-button">Quantity: {product.quantity}</p>
                    </div>
                    <h6 className="font-medium text-xl leading-8 text-palette-button">Price: ${formatPrice(product.newPrice)}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
