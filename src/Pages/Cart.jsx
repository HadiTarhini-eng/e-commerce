import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast and Toaster
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { removeFromCart, updateQuantity } from '../redux/cartSlice'; // Import actions from cartSlice

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const dispatch = useDispatch(); // Initialize dispatch function
  const cartItems = useSelector(state => state.cart.cart); // Get cart items from Redux store

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false); // Loading state

  // Fixed Delivery Charge
  const deliveryCharge = 15.00;

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
    navigate('/payment'); // Redirect to the payment page
  };

  // Calculate totals when cart items change
  const total = calculateTotals();
  
  return (
    <div className="min-h-screen flex flex-col items-center w-full mt-10">
      <section className="py-6 md:py-24 relative">
        <h2 className="text-2xl font-semibold text-dark-charcoal m-6">Shopping Cart</h2>
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-2 py-6">
            <div className="font-normal text-xl leading-8 text-gray-500">Product</div>
            <p className="font-normal text-xl leading-8 text-gray-500 flex items-center justify-between">
              <span className="w-full max-w-[150px] text-center">Quantity</span>
              <span className="w-full max-w-[150px] text-center">Total</span>
            </p>
          </div>

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
                <div key={product.productId} className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-gray-200 py-6">
                  <div className="flex items-center flex-row gap-4 w-full max-xl:max-w-xl max-xl:mx-auto">
                    {/* Left side - Image and Product Name */}
                    <div className="flex items-center gap-4 w-full max-w-[200px] sm:max-w-[250px]">
                      <div className="img-box">
                        <img src={product.image} alt={product.title} className="w-[80px] sm:w-[120px] rounded-xl object-cover" />
                      </div>
                      <div className="pro-data w-full">
                        <h5 className="font-semibold text-base sm:text-xl leading-8 text-black">{product.title}</h5>
                        <p className="font-normal text-sm sm:text-lg leading-8 text-gray-500 my-2">{product.category}</p>
                        <h6 className="font-medium text-sm sm:text-lg leading-8 text-indigo-600">${product.newPrice}</h6>
                      </div>
                    </div>

                    {/* Right side - Quantity controls and Remove button */}
                    <div className="flex flex-col items-center gap-2 w-full max-w-[200px] sm:max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(product.productId, Math.max(product.quantity - 1, 1))} className="group rounded-l-full px-4 sm:px-6 py-2 sm:py-[18px] border border-gray-200">
                          {/* Minus Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 22" fill="none">
                            <path d="M16.5 11H5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-sm sm:text-lg w-full max-w-[80px] sm:max-w-[100px] placeholder:text-gray-900 py-2 sm:py-[15px] text-center bg-transparent"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value, 10))}
                        />
                        <button onClick={() => handleQuantityChange(product.productId, product.quantity + 1)} className="group rounded-r-full px-4 sm:px-6 py-2 sm:py-[18px] border border-gray-200">
                          {/* Plus Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 22" fill="none">
                            <path d="M11 5.5V16.5M16.5 11H5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      <h6 className="text-indigo-600 font-manrope font-bold text-base sm:text-2xl leading-9 w-full max-w-[176px] text-center">
                        ${product.newPrice * product.quantity}
                      </h6>
                      {/* Remove Item Button */}
                      <button onClick={() => handleRemoveItem(product.productId)} className="mt-2 text-red-600 font-semibold text-sm sm:text-lg">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* Fixed Total Summary */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto sticky bottom-0 left-0 z-1">
            <div className="flex items-center justify-between w-full mb-4 sm:mb-6">
              <p className="font-normal text-sm sm:text-xl leading-8 text-gray-400">Sub Total</p>
              <h6 className="font-semibold text-sm sm:text-xl leading-8 text-gray-900">${total}</h6>
            </div>
            <div className="flex items-center justify-between w-full pb-4 sm:pb-6 border-b border-gray-200">
              <p className="font-normal text-sm sm:text-xl leading-8 text-gray-400">Delivery Charge</p>
              <h6 className="font-semibold text-sm sm:text-xl leading-8 text-gray-900">${deliveryCharge}</h6>
            </div>
            <div className="flex items-center justify-between w-full py-4 sm:py-6">
              <p className="font-manrope font-medium text-lg sm:text-2xl leading-9 text-gray-900">Total</p>
              <h6 className="font-manrope font-medium text-lg sm:text-2xl leading-9 text-indigo-500">${total + deliveryCharge}</h6>
            </div>
          </div>

          {/* Continue to Payment Button */}
          <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-6 sm:mt-8 mb-20">
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
