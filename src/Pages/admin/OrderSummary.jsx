import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOrderSummaryData } from '../../api/adminApi';

// Component for Billing Information (already created)
const BillingInfo = ({ billingDetails }) => {
    return (
        <div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Billing & Delivery information</h4>
            <dl>
                <dd className="flex flex-col mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                    <div>{billingDetails.name}</div>
                    <div>{billingDetails.phone}</div>
                    <div>{billingDetails.address}</div>
                </dd>
            </dl>
        </div>
    );
};

// Product Row Component (already created)
const ProductRow = ({ product }) => {
    return (
        <tr className="table-fixed">
            <td className="whitespace-nowrap py-4 px-4 w-1/3">
                <div className="flex items-center gap-4">
                    <div href="#" className="flex items-center aspect-square w-10 h-10 shrink-0">
                        <img className="h-auto w-full max-h-full dark:hidden" src={product.imageLight} alt={product.name} />
                    </div>
                    <div className='flex flex-col'>
                        <span>{product.name}</span>
                        <span>{product.scent}</span>
                    </div>
                </div>
            </td>
            <td className="p-4 text-base font-normal text-gray-900 dark:text-white w-1/3">Quantity: {product.quantity}</td>
            <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white w-1/3">Price: ${product.price}</td>
        </tr>
    );
};

// Checkout Info Component (new)
const CheckoutInfo = ({ checkoutDetails }) => {
    return (
        <div className="space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Checkout Information</h4>
            <dl>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Delivery Method</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{checkoutDetails.deliveryMethod}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Delivery Price</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${checkoutDetails.deliveryPrice}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Payment Method</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{checkoutDetails.paymentMethod}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Is Gift?</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{checkoutDetails.isGift ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Discount</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${checkoutDetails.discount}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-gray-500 dark:text-gray-400">Date Ordered</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{checkoutDetails.dateOrdered}</dd>
                </div>
            </dl>
        </div>
    );
};

const OrderSummaryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);

    // Fetch order data using fetchOrderSummaryData
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOrderSummaryData(); // Call the fetch function
                const order = data.find((item) => item.id === parseInt(id)); // Find the order by ID
                setOrderData(order); // Set the order data
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!orderData) {
        return <div>Loading...</div>;
    }

    // Extract fields from the flat structure
    const billingDetails = {
        name: orderData.billingName,
        phone: orderData.billingPhone,
        address: orderData.billingAddress
    };

    const products = [
        {
            name: orderData.productName1,
            scent: orderData.productScent1,
            imageLight: orderData.productImageLight1,
            quantity: orderData.productQuantity1,
            price: orderData.productPrice1
        },
        {
            name: orderData.productName2,
            scent: orderData.productScent2,
            imageLight: orderData.productImageLight2,
            quantity: orderData.productQuantity2,
            price: orderData.productPrice2
        }
    ];

    const checkoutDetails = {
        deliveryMethod: orderData.deliveryMethod,
        deliveryPrice: orderData.deliveryPrice,
        note: orderData.note,
        paymentMethod: orderData.paymentMethod,
        isGift: orderData.isGift,
        city: orderData.city,
        totalPrice: orderData.totalPrice,
        discount: orderData.discount,
        dateOrdered: orderData.dateOrdered
    };

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-3xl flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
                    {/* Billing Info */}
                    <div className="flex-1">
                        <BillingInfo billingDetails={billingDetails} />
                    </div>

                    {/* Checkout Info */}
                    <div className="flex-1">
                        <CheckoutInfo checkoutDetails={checkoutDetails} />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {products.map((product, index) => (
                                    <ProductRow key={index} product={product} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>

            <button
                onClick={() => navigate('/ordersTable')}
                className={`mt-20 px-2 py-1 rounded-md text-white font-semibold transition-all shadow-sm 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none`}
            >
                Back
            </button>
        </section>
    );
};

export default OrderSummaryPage;
