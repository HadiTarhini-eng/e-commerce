import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchOrderDetailsById } from '../../api/clientApi';

const OrderDetails = () => {
    const { orderID } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasScents, setHasScents] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Define an inner async function and call it immediately
        const fetchData = async () => {
          try {
            const order = await fetchOrderDetailsById(orderID);
            const hasNoScent = order.products.some(product => product.scent === null);
            setHasScents(hasNoScent);
            if (order) {
              setOrderData(order);
            } else {
              setError('Order not found');
            }
            setLoading(false);
          } catch (error) {
            setError('Failed to load order details');
            setLoading(false);
          }
        };
      
        fetchData();
      }, [orderID]);

    if (loading) return <div className="mt-20">Loading...</div>;
    if (error) return <div className="mt-20">{error}</div>;

    if (!orderData) return <div>No order data available.</div>;

    const { total, shipping, subtotal, products, status } = orderData;

    const formatPrice = (price) => {
        const formattedPrice = parseFloat(price).toFixed(2);
        return formattedPrice.endsWith('.00') ? parseFloat(formattedPrice).toFixed(0) : formattedPrice;
      };

    return (
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto no-scrollbar mb-20">
            <div className="flex items-start flex-col gap-6 xl:flex-row">
                {/* Order Details Section */}
                <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
                    <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400">
                        <div>
                            <h2 className="font-manrope pb-6 font-bold text-3xl leading-10 text-black border-b border-gray-200">
                                Order Details
                            </h2>
                        </div>

                        <div className="data py-6 border-b border-gray-200">
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <p className="font-normal text-lg leading-8 text-gray-400">Total Cost</p>
                                <p className="font-medium text-lg leading-8 text-gray-900">${formatPrice(total)}</p>
                            </div>
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <p className="font-normal text-lg leading-8 text-gray-400">Shipping</p>
                                <p className="font-medium text-lg leading-8 text-gray-600">${formatPrice(shipping)}</p>
                            </div>
                            {status !== 'Delivered' && (
                                <button 
                                    className="px-4 py-2 rounded-lg font-semibold text-white bg-pink-600 hover:bg-pink-700 cursor-pointer"
                                    onClick={()=>navigate(`/OrderTrack/${orderID}`)}
                                >
                                        Track Order
                                </button>
                            )}
                        </div>
                        <div className="total flex items-center justify-between pt-6">
                            <p className="font-normal text-xl leading-8 text-black">Subtotal</p>
                            <h5 className="font-manrope font-bold text-2xl leading-9 text-palette-button">${formatPrice(subtotal)}</h5>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="rounded-3xl p-6 bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
                            >
                                <div className="grid grid-cols-3 md:grid-cols-3 w-full gap-3 md:gap-8">
                                    <div className="img-box">
                                        <img
                                            src={`/images/products/${product.image}` || 'https://via.placeholder.com/122'}
                                            alt={`${product.name} image`}
                                            className="w-[80px] sm:w-[120px] rounded-xl object-cover"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <h2 className="font-medium text-xl leading-8 text-black">{product.name}</h2>
                                        {!hasScents && (
                                            <p className="font-normal text-lg leading-8 text-gray-500">Scent: {product.scent}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8">
                                    <div className="flex items-center justify-between gap-8">
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-lg leading-8 text-gray-700">Quantity: {product.quantity}</p>
                                        </div>
                                        <h6 className="font-medium text-xl leading-8 text-palette-button">Price: ${formatPrice(product.price)}</h6>
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

export default OrderDetails;
