import React, { useState } from 'react';
import DynamicModal from '../../components/admin/DynamicModal';
import { useNavigate } from 'react-router-dom';

// Component for Billing & Delivery Info
const BillingInfo = ({ billingDetails, onEditClick }) => {
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
            <button
                type="button"
                onClick={onEditClick}
                className="text-base font-medium text-primary-700 hover:underline dark:text-primary-500"
            >
                Edit
            </button>
        </div>
    );
};

// Component for Product Table Row
const ProductRow = ({ product }) => {
    return (
        <tr className="table-fixed">
            <td className="whitespace-nowrap py-4 px-4 w-1/3">
                <div className="flex items-center gap-4">
                    <a href="#" className="flex items-center aspect-square w-10 h-10 shrink-0">
                        <img className="h-auto w-full max-h-full dark:hidden" src={product.imageLight} alt={product.name} />
                    </a>
                    <div className='flex flex-col'>
                        <span className="hover:underline">{product.name}</span>
                        <span className="hover:underline">{product.scent}</span>
                    </div>
                </div>
            </td>
            <td className="p-4 text-base font-normal text-gray-900 dark:text-white w-1/3">Quantity: {product.quantity}</td>
            <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white w-1/3">Price: ${product.price}</td>
        </tr>
    );
};

// Main Component for Order Summary Page
const OrderSummaryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [billingDetails, setBillingDetails] = useState({
        name: 'Hadi tarhini',
        phone: '78916479',
        address: 'bchamoun'
    });

    const [products, setProducts] = useState([
        {
            name: 'Cream',
            scent: 'pink',
            imageLight: '/image00003.png',
            quantity: 1,
            price: 20
        },
        {
            name: 'Cream',
            scent: 'red',
            imageLight: '/image00002.png',
            quantity: 2,
            price: 35
        },
        {
            name: 'Cream',
            scent: 'black',
            imageLight: '/image00001.png',
            quantity: 1,
            price: 15
        }
    ]);

    const [orderSummary, setOrderSummary] = useState({
        originalPrice: 70,
        delivery: 10,
        total: 80
    });

    const closeModal = () => setIsModalOpen(false);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    // Handle edit
    const handleEdit = async (product) => {
        try {
            const addedProduct = await postProduct(product); // Call the postProduct API to add the new product
            console.log('Product added:', addedProduct);

            // Update the table data after successful POST request
            setData((prevData) => [...prevData, addedProduct]);

            // Optionally, handle success (e.g., close the modal)
            closeModal();
        } catch (error) {
            console.error('Error adding product:', error);
            // Optionally, handle error (e.g., show an error message)
        }
    };

    // Define the input fields dynamically
    const inputFields = [
        {
            type: 'text',
            title: 'Client Name',
            placeholder: 'Hadi Tarhini',
            id: 'name',
            value: '', // This value will be handled dynamically via formData
            onChange: () => { },
            required: true,
        },
        {
            type: 'phoneNumber',
            title: 'Phone Number',
            placeholder: '78916479',
            id: 'phoneNumber',
            value: '',
            onChange: () => { },
            required: true,
        },
        {
            type: 'textarea',
            title: 'Address',
            placeholder: 'bchamoun',
            id: 'address',
            rows: '4',
            value: '',
            onChange: () => { },
            required: true,
        },
    ];

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Order summary</h2>

                    <BillingInfo billingDetails={billingDetails} onEditClick={handleEditClick} />

                    <div className="mt-6 sm:mt-8">
                        <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                            <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {products.map((product, index) => (
                                        <ProductRow key={index} product={product} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 space-y-6">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Original price</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">${orderSummary.originalPrice}</dd>
                                    </dl>
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Delivery</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">${orderSummary.delivery}</dd>
                                    </dl>
                                </div>

                                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                    <dt className="text-lg font-bold text-gray-900 dark:text-white">Total</dt>
                                    <dd className="text-lg font-bold text-gray-900 dark:text-white">${orderSummary.total}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <DynamicModal
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                        onProductAdd={handleEdit}
                        inputFields={inputFields}
                        modalTitle="Create New Product"
                        buttonText="Add Product"
                    />
                </div>
            </form>
            <button
                className={`mt-20 px-2 py-1 rounded-md text-white font-semibold transition-all shadow-sm 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none`}
            >
                Back
            </button>
        </section>
    );
};

export default OrderSummaryPage;
