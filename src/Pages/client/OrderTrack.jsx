import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderTrackById } from '../../api/ClientApi';

const OrderTrack = () => {
  const [orderTrack, setOrderTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orderID } = useParams();
  const navigate = useNavigate();  // Hook for programmatic navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderTrack = await fetchOrderTrackById(orderID);
        setOrderTrack(orderTrack);
        setLoading(false);
      } catch (error) {
        setError('Error loading order track');
        setLoading(false);
      }
    };

    fetchData();
  }, [orderID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle the "Order Details" link click
  const handleOrderDetailsClick = () => {
    navigate(`/orderDetails/${orderID}`);  // Navigate to Order Details page
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 mt-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="lg:flex lg:gap-8">
          <div className="grow sm:mt-8 lg:mt-0">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Track your order</h3>

              <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                {orderTrack.map((step, index) => {
                  // Determine the color based on the step status
                  const isActive = step.status === 'in-progress';
                  const fadeClass = 'animate-fadeInOut transition-colors duration-1500 ease-in-out';

                  // Define dynamic text and icon colors
                  const textColor = isActive ? `text-gray-500 dark:text-gray-400 ${fadeClass}` : 'text-primary-700 dark:text-primary-500';
                  const iconColor = isActive ? `text-gray-500 dark:text-gray-400 ${fadeClass}` : 'text-primary-700 dark:text-primary-500';
                  const bgColor = isActive ? `bg-gray-100 dark:bg-gray-700 ${fadeClass}` : 'bg-primary-100 dark:bg-primary-900';

                  return (
                    <li key={index} className="mb-10 ms-6">
                      <span
                        className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${bgColor} ring-8 ring-white dark:ring-gray-800`}
                      >
                        <svg
                          className={`h-4 w-4 ${iconColor}`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={step.iconPath}
                          />
                        </svg>
                      </span>
                      <h4 className={`mb-0.5 text-base font-semibold ${textColor}`}>{step.date}</h4>
                      <p className={`text-sm font-normal ${textColor}`}>{step.description}</p>
                    </li>
                  );
                })}
              </ol>

              <div className="gap-4 sm:flex sm:items-center">
                <a
                  href="#"
                  onClick={handleOrderDetailsClick} // Call the handler to navigate
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0"
                >
                  Order Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTrack;
