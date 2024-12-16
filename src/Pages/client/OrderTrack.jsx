import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderTrackById, fetchOrderTrackSteps } from '../../api/clientApi';

const OrderTrack = () => {
  const [trackSteps, setTrackSteps] = useState([]);
  const [orderTrack, setOrderTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orderID } = useParams();
  const navigate = useNavigate();  // Hook for programmatic navigation

  // Fetch the fixed steps data
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const trackSteps = await fetchOrderTrackSteps();
        setTrackSteps(trackSteps);
        setLoading(false);
      } catch (error) {
        setError('Error loading track steps');
        setLoading(false);
      }
    };

    fetchSteps();
  }, []);

  // Fetch the order tracking data for the specific orderID
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

  // Merge the fetched order's steps with the predefined track steps
  const mergedSteps = trackSteps.map((step) => {
    const matchingOrderStep = orderTrack.find(orderStep => orderStep.status === step.type);

    if (matchingOrderStep) {
      return {
        id: step.id,
        date: matchingOrderStep.date || "TBA",
        description: step.description,
        status: matchingOrderStep.status || step.status,
        isActive: true,
      };
    } else {
      return {
        id: step.id,
        date: "TBA",
        description: step.description,
        status: step.status,
        isActive: false,
      };
    }
  });

  // Reverse the merged steps to show the most recent steps first
  const reversedSteps = mergedSteps.reverse();

  // Find the first matching step to apply the fading animation to
  const mostRecentStepIndex = reversedSteps.findIndex(step => step.isActive);

  return (
    <section className="bg-white py-4 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="lg:flex lg:gap-8">
          <div className="grow">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 px py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                {reversedSteps.map((step, index) => {
                  const isActive = step.isActive;
                  const fadeClass = index === mostRecentStepIndex ? 'animate-fadeInOut transition-colors duration-1500 ease-in-out' : '';

                  // Define dynamic text and icon colors
                  let textColor = step.date === 'TBA'
                    ? `text-gray-400 dark:text-gray-200 ${fadeClass}`
                    : !isActive
                    ? `text-pink-500 dark:text-pink-400 ${fadeClass}`
                    : `text-green-500 dark:text-green-400 ${fadeClass}`;

                  let iconColor = step.date === 'TBA'
                    ? `text-gray-400 dark:text-gray-200 ${fadeClass}`
                    : !isActive
                    ? `text-pink-500 dark:text-pink-400 ${fadeClass}`
                    : `text-green-500 dark:text-green-400 ${fadeClass}`;

                  let bgColor = step.date === 'TBA'
                    ? `bg-gray-100 dark:bg-gray-200 ${fadeClass}`
                    : !isActive
                    ? `bg-pink-100 dark:bg-pink-700 ${fadeClass}`
                    : `bg-green-100 dark:bg-green-700 ${fadeClass}`;

                  // Icon path: Update the most recent step to have a pink icon
                  const iconPath = index === mostRecentStepIndex
                    ? `M5 11.917 9.724 16.5 19 7.5 ${fadeClass}` // Special check mark icon for the most recent step (pink)
                    : isActive
                    ? 'M5 11.917 9.724 16.5 19 7.5' // Check mark icon for active steps
                    : 'm4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5'; // Icon for non-active steps

                  // Set pink color for most recent step
                  if (index === mostRecentStepIndex) {
                    textColor = `text-pink-500 dark:text-pink-400 ${fadeClass}`;
                    iconColor = `text-pink-500 dark:text-pink-400 ${fadeClass}`;
                    bgColor = `bg-pink-100 dark:bg-pink-700 ${fadeClass}`;
                  }

                  return (
                    <li key={step.id} className="mb-10 ms-6">
                      <span
                        className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${bgColor} ring-8 ring-white dark:ring-gray-800`}
                      >
                        {iconPath && (
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
                              d={iconPath}
                            />
                          </svg>
                        )}
                      </span>
                      <h4 className={`mb-0.5 text-base font-semibold ${textColor} ${fadeClass}`}>{step.date}</h4>
                      <p className={`text-sm font-normal ${textColor} ${fadeClass}`}>{step.description}</p>
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


