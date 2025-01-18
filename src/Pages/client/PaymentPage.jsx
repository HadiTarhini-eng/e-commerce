import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, clearCheckoutData, updateCheckoutData } from '../../redux/cartSlice';
import toast from 'react-hot-toast';
import { submitOrder } from '../../api/ClientApi';
import { useAuth } from '../../components/client/AuthContext';

const PaymentPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const dispatch = useDispatch();

  // Access cart and checkout data from Redux store
  const { cart, checkoutData } = useSelector((state) => state.cart);
  const totalWithoutDelivery = parseFloat(useSelector(state => state.cart.checkoutData.totalWithoutDelivery), 10);
  const deliveryPrice = parseFloat(useSelector(state => state.cart.checkoutData.deliveryMethod.deliveryPrice), 10);
  
  // Access the logged-in user ID from AuthContext
  const { isLoggedIn, userId } = useAuth(); // We now directly use userId from AuthContext

  const [coupon, setCoupon] = useState(null); // State to store coupon details
  const [couponInput, setCouponInput] = useState(null);
  const [couponValueFetched, setCouponValueFetched] = useState(null);
  const [isApplying, setIsApplying] = useState(false); // Flag to track if the coupon is applied
  const [discountedTotal, setDiscountedTotal] = useState(totalWithoutDelivery); // State for the discounted total

  useEffect(() => {
    const fetchData = async () => {
      try {
        const couponResponse = await fetchCouponValue(couponInput);
        setCouponValueFetched(couponResponse);
      } catch (error) {
        console.error('Error fetching coupon data:', error);
      }
    };

    fetchData();
  }, []);
  
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

      // dispatch new values
      dispatch(updateCheckoutData({ field: 'totalWithoutDelivery', value: discountedTotal }));
      if(coupon) {
        dispatch(updateCheckoutData({ field: 'couponName', value: coupon.couponName }));
      }

      // Prepare the payload to send in the POST request
      const payload = {
        cart,
        checkoutData,
        userId, // Include the user ID in the payload
      };

      // Call the submitOrder function from the API file
      const response = await submitOrder(payload); // Use the function from the API file

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

  const handleApplyCoupon = () => {
    const couponName = document.getElementById('voucher').value;
    setCouponInput(couponName);
    const couponValue = couponValueFetched; // Example fixed coupon value, you may replace this with actual logic to fetch the coupon value

    if (!couponName) {
      toast.error('Please enter a coupon code');
      return;
    }

    // Check if the coupon has a valid value and apply the discount to totalWithoutDelivery
    if (couponValue && totalWithoutDelivery > 0) {
      const discountAmount = (totalWithoutDelivery * couponValue) / 100;
      const discountedTotal = totalWithoutDelivery - discountAmount;

      // Update state with the new discounted total
      setDiscountedTotal(discountedTotal);

      // Set the coupon state
      setCoupon({ couponName, couponValue });
      setIsApplying(true);

      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon value or total.');
    }
  };

  const handleCancelCoupon = () => {
    // Reset the coupon and revert to the original totalWithoutDelivery
    setCoupon(null);
    setIsApplying(false);
    setDiscountedTotal(totalWithoutDelivery); // Reset the discounted total to the original value

    toast.success('Coupon has been removed!');
  };

  return (
    <div className="w-full max-w-[710px] sm:min-w-[710px] px-4 md:px-5 lg-6 mx-auto no-scrollbar mb-20 mt-4">
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
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-normal text-lg leading-8 text-gray-400">Total</p>
                  <div className="flex items-center gap-2">
                    {/* Show the discounted total if it is different from totalWithoutDelivery */}
                    {discountedTotal !== checkoutData.totalWithoutDelivery && (
                      <p className="font-medium text-lg leading-8 text-gray-400 line-through">
                        ${formatPrice(checkoutData.totalWithoutDelivery)} {/* Original total */}
                      </p>
                    )}

                    {/* Display the discounted total */}
                    <p className="font-medium text-xl leading-8 text-palette-button">
                      ${formatPrice(discountedTotal)} {/* Display the updated total with discount */}
                    </p>
                  </div>
                </div>
                 
               {/* Display the discount message */}
                {(checkoutData.isFirstOffer && checkoutData.totalWithoutDiscount !== checkoutData.totalWithDelivery) && (
                  <p className="text-sm text-center text-red-500 mt-2">
                    You got {checkoutData.discount}% off on your first order!
                  </p>
                )}

                {/* Display the free delivery message */}
                {((checkoutData.freeDelivery) && (parseFloat(checkoutData.totalWithoutDelivery) === checkoutData.totalWithDelivery)) && (
                  <p className="text-sm text-center text-red-500 mt-2">
                    You got free delivery on your order!
                  </p>
                )}

               {/* Display the coupon message */}
                {coupon && coupon.couponName && (
                  <p className="text-sm text-center text-red-500 mt-2">
                    You got {coupon.couponValue}% off on your order!
                  </p>
                )}
              </div>

              {/* Sub Total */}
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-normal text-lg leading-8 text-gray-400">Sub Total</p>
                  <p className="font-medium text-xl leading-8 text-palette-button">
                    {
                      discountedTotal !== totalWithoutDelivery
                        ? `$${formatPrice(discountedTotal + deliveryPrice)}` // Display discounted total + delivery
                        : `$${formatPrice(checkoutData.totalWithDelivery)}` // Display the normal total with delivery
                    }
                  </p>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex flex-col gap-2 mb-5">
                <label htmlFor="voucher" className="mb-2 block text-lg font-normal text-gray-400 dark:text-white">
                  Enter a gift card, voucher or promotional code
                </label>
                <div className="flex max-w-md items-center gap-4">
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder=""
                    required
                    disabled={isApplying}
                  />
                  <button
                    type="button"
                    className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white ${isApplying ? 'bg-red-500 hover:bg-red-600' : 'bg-palette-button hover:bg-primary-800'}`}
                    onClick={isApplying ? handleCancelCoupon : handleApplyCoupon}
                  >
                    {isApplying ? 'Cancel' : 'Apply'}
                  </button>
                </div>
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
                <div className="grid grid-cols-2 w-full gap-3 md:gap-8">
                  <div className="img-box">
                    <img
                      src={`/images/products/${product.hasScents ? product.scentImage : product.image}`}
                      alt={`${product.title} image`}
                      className="w-[80px] sm:w-[120px] rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex items-end justify-end gap-3">
                    <p className="font-medium text-lg leading-8 text-gray-700">Quantity: {product.quantity}</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <h2 className="font-medium text-xl leading-8 text-black">{product.title}</h2>
                      <p className="font-normal text-lg leading-8 text-gray-500">{product.scentName}</p>
                    </div>
                    <h6 className="font-medium text-xl leading-8 text-palette-button">Price: ${formatPrice(product.newPrice * product.quantity)}</h6>
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
