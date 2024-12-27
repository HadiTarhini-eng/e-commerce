import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast and Toaster
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { removeFromCart, updateQuantity, updateCheckoutData } from '../../redux/cartSlice'; // Import actions from cartSlice
import { useAuth } from '../../../src/components/client/AuthContext';
import { fetchOrderNumber, fetchFirstOrderOffer } from '../../api/clientApi';
import { format } from 'crypto-js';

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const dispatch = useDispatch(); // Initialize dispatch function
  const cartItems = useSelector(state => state.cart.cart); // Get cart items from Redux store
  const { userId } = useAuth();
  const [orderNumber, setOrderNumber] = useState(null);
  const [isFirstOffer, setIsFirstOffer] = useState([]);
  const [firstOfferAmount, setFirstOfferAmount] = useState([]);
  const [error, setError] = useState(null);
  console.log(cartItems)
  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (!userId) {
        //   throw new Error('User not logged in');
        // }
        const orderNumber = await fetchOrderNumber(userId);
        setOrderNumber(orderNumber);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstOrderOffer = await fetchFirstOrderOffer();
        setIsFirstOffer(firstOrderOffer.isFirstOffer);
        setFirstOfferAmount(firstOrderOffer.firstOfferAmount);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Calculate subtotal and total (fixed delivery charge)
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, product) => acc + product.newPrice * product.quantity, 0);
    let result = {};
    if (orderNumber === 0 && isFirstOffer) {
      result = {
        originalPrice: subtotal,
        newPrice: (subtotal - (subtotal * (firstOfferAmount/100))).toFixed(2)
      }
      return result;
    }
    return subtotal;
  };

  const totalWithoutDelivery = calculateTotals();  // Calculate total without delivery

  // Handle updating product quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent going below 1
    dispatch(updateQuantity({ id, newQuantity }));
  };

  // Remove item from cart
  const handleRemoveItem = (productId, scentId) => {
    dispatch(removeFromCart({ productId, scentId: scentId }));
  };

  // Handle Continue to Payment button click
  const handleContinueToPayment = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is still empty!');
    } else {
      // Dispatch total without delivery and total with delivery to Redux
      if (orderNumber === 0 && isFirstOffer) {
        dispatch(updateCheckoutData({ field: 'totalWithoutDelivery', value: totalWithoutDelivery.newPrice }));
        dispatch(updateCheckoutData({ field: 'discount', value: 10 }));
      } else {
        dispatch(updateCheckoutData({ field: 'totalWithoutDelivery', value: totalWithoutDelivery }));
        dispatch(updateCheckoutData({ field: 'discount', value: 0 }));
      }

      navigate('/checkout'); // Redirect to the payment page
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatPrice = (price) => {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.endsWith('.00') ? parseFloat(formattedPrice).toFixed(0) : formattedPrice;
  };

  return (
    <div className="min-h-screen flex flex-col items-center w-full h-full bg-palette-body-3 sm:w-[710px]">
      <div className="flex items-center flex-col w-full h-full max-w-7xl px-1 md:px-5 lg-6 mx-auto">
        {/* Show loading spinner while fetching data */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
              <span className='sr-only'>Loading...</span>
              <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
            </div>
          </div>
        ) : (
          // Product List
          cartItems.length === 0 ? (
            <div className="text-center text-3xl font-bold text-gray-600 mt-10">Your cart is empty!</div>
          ) : (
            cartItems.map((product, index) => (
              <div key={index} className="bg-white w-[90%] grid grid-cols-1 lg:grid-cols-2 shadow-md border-2 border-gray-200 rounded-lg m-2 py-3">
                <div className="flex justify-between w-full max-xl:max-w-xl max-xl:mx-auto">
                  {/* Left side - Image and Product Name */}
                  <div className="flex items-center gap-2 w-full">
                    <div className="img-box min-w-[100px] max-w-[100px] sm:w-[250px]">
                      <img
                        src={`/images/products/${product.image}`}
                        alt={product.title}
                        className="w-[100px] rounded-xl object-cover"
                      />
                    </div>
                    <div className="pro-data w-full">
                      <h5 className="font-semibold text-xl sm:text-xl leading-8 text-black">{product.title}</h5>
                      <p className="font-medium text-sm sm:text-lg text-black">{product.scentName}</p>
                      <h6 className="font-medium text-sm sm:text-lg leading-8 text-black">${formatPrice(product.newPrice)}</h6>
                    </div>
                  </div>

                  {/* Right side - Quantity controls and Remove button */}
                  <div className="flex flex-col items-center justify-center w-full max-w-[220px] sm:max-w-[250px]">
                    <div className="flex items-center gap-2">
                      {/* Decrement Button */}
                      <button
                        onClick={() => handleQuantityChange(product.productId, Math.max(product.quantity - 1, 1))}
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      >
                        <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                        </svg>
                      </button>

                      {/* Quantity Input */}
                      <input
                        type="text"
                        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value, 10))}
                      />

                      {/* Increment Button */}
                      <button
                        onClick={() => handleQuantityChange(product.productId, product.quantity + 1)}
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      >
                        <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>

                    <h6 className="text-palette-button font-manrope font-bold text-base sm:text-2xl leading-9 w-full max-w-[176px] text-center">
                      ${formatPrice(product.newPrice * product.quantity)}
                    </h6>

                    {/* Remove Item Button */}
                    <button onClick={() => handleRemoveItem(product.productId, product.scentId)} className="text-red-600 font-semibold text-sm sm:text-lg">
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            ))
          )
        )}

        {/* Fixed Total Summary */}
        <div className="bg-white rounded-xl mt-6 p-4 sm:p-6 w-full mb-2 max-lg:max-w-xl max-lg:mx-auto fixed w-full bottom-0 left-1/2 transform -translate-x-1/2 max-w-[710px] z-1 pb-1">
          <div className="flex flex-col items-center justify-between w-full py-4 sm:py-6">
            <p className="font-manrope font-medium text-lg sm:text-2xl leading-9 text-gray-900">Total (Without Delivery)</p>
            <h6 className="font-manrope font-medium text-xl sm:text-2xl leading-9 text-palette-button mx-2">
              {(orderNumber === 0 && isFirstOffer) ? (
                <>
                  ${formatPrice(totalWithoutDelivery.newPrice)}
                  <span className="line-through text-gray-500 text-lg font-['Roboto'] mx-1">
                    ${formatPrice(totalWithoutDelivery.originalPrice)}
                  </span>
                </>
              ) : (
                <>
                  ${formatPrice(totalWithoutDelivery)}
                </>
              )}
            </h6>
          </div>
          {orderNumber === 0 && isFirstOffer && (
            <p className="font-manrope font-medium text-md text-center sm:text-2xl text-red-600">{firstOfferAmount}% Discount on your first order!</p>
          )}

          {/* Continue to Payment Button */}
          <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-2 mb-20">
            <button
              onClick={handleContinueToPayment} // Add the click handler
              className="rounded-full w-full max-w-[240px] py-3 sm:py-4 text-center justify-center items-center bg-palette-button font-semibold text-sm sm:text-lg text-white flex transition-all duration-500">
              Continue to Payment
              <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                <path d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
