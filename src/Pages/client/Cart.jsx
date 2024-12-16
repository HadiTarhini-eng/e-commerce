import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast and Toaster
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { removeFromCart, updateQuantity } from '../../redux/cartSlice'; // Import actions from cartSlice

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const dispatch = useDispatch(); // Initialize dispatch function
  const cartItems = useSelector(state => state.cart.cart); // Get cart items from Redux store

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false); // Loading state

  // Calculate subtotal and total (fixed delivery charge)
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, product) => acc + product.newPrice * product.quantity, 0);
    return subtotal;
  };

  // Handle updating product quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent going below 1
    dispatch(updateQuantity({ id, newQuantity }));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.error('Item removed from cart!');
  };

  // Handle Continue to Payment button click
  const handleContinueToPayment = () => {
    navigate('/checkout'); // Redirect to the payment page
  };

  // Calculate totals when cart items change
  const total = calculateTotals();
  
  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-palette-body-3">
      <section className="md:py-24 relative mt-2">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
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
              <div className="text-center text-xl text-gray-600">Your cart is empty!</div>
            ) : (
              cartItems.map((product) => (
                <div key={product.productId} className="bg-white grid grid-cols-1 lg:grid-cols-2 shadow-md border-2 border-gray-200 rounded-lg m-2 py-3">
                  <div className="flex items-center flex-row gap-4 w-full max-xl:max-w-xl max-xl:mx-auto">
                    {/* Left side - Image and Product Name */}
                    <div className="flex items-center gap-1 w-full max-w-[200px] sm:max-w-[250px]">
                      <div className="img-box">
                        <img src={product.image} alt={product.title} className="w-fit rounded-xl object-cover" />
                      </div>
                      <div className="pro-data w-full">
                        <h5 className="font-semibold text-base sm:text-xl leading-8 text-black">{product.title}</h5>
                        <h6 className="font-medium text-sm sm:text-lg leading-8 text-indigo-600">${product.newPrice}</h6>
                      </div>
                    </div>

                    {/* Right side - Quantity controls and Remove button */}
                    <div className="flex flex-col items-center w-full max-w-[200px] sm:max-w-[220px]">
                      <div className="flex items-center">
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
                      <h6 className="text-indigo-600 font-manrope font-bold text-base sm:text-2xl leading-9 w-full max-w-[176px] text-center">
                        ${parseFloat(product.newPrice * product.quantity).toFixed(0)}
                      </h6>
                      {/* Remove Item Button */}
                      <button onClick={() => handleRemoveItem(product.productId)} className="text-red-600 font-semibold text-sm sm:text-lg">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* Fixed Total Summary */}
          <div className="bg-white rounded-xl mt-6 p-4 sm:p-6 w-full mb-2 max-lg:max-w-xl max-lg:mx-auto sticky bottom-0 left-0 z-1">
            <div className="flex items-center justify-between w-full mb-4 sm:mb-6">
              <p className="font-normal text-sm sm:text-xl leading-8 text-gray-400">Sub Total</p>
              <h6 className="font-semibold text-sm sm:text-xl leading-8 text-gray-900">${parseFloat(total).toFixed(0)}</h6>
            </div>
            <div className="flex items-center justify-between w-full py-4 sm:py-6">
              <p className="font-manrope font-medium text-lg sm:text-2xl leading-9 text-gray-900">Total</p>
              <h6 className="font-manrope font-medium text-lg sm:text-2xl leading-9 text-indigo-500">${parseFloat(total).toFixed(0)}</h6>
            </div>
          </div>

          {/* Continue to Payment Button */}
          <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-2 mb-20">
            <button 
              onClick={handleContinueToPayment} // Add the click handler
              className="rounded-full w-full max-w-[240px] py-3 sm:py-4 text-center justify-center items-center bg-indigo-600 font-semibold text-sm sm:text-lg text-white flex transition-all duration-500 hover:bg-indigo-700">
              Continue to Payment
              <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                <path d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
