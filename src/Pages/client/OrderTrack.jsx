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

  // Merge the fetched order's steps with the predefined track steps, 
  // and update the status and date accordingly
  const mergedSteps = trackSteps.map((step) => {
    // Find the corresponding step in the order's steps data
    const matchingOrderStep = orderTrack.find(orderStep => orderStep.status === step.type);

    // If a matching step is found, extract necessary data
    if (matchingOrderStep) {
      return {
        id: step.id, // Take id from orderSteps
        date: matchingOrderStep.date || "TBA", // Take date from orderTrack, or set to "TBA"
        description: step.description, // Take description from orderSteps
        status: matchingOrderStep.status || step.status, // Take status from either orderSteps or orderTrack
        isActive: false, // Mark as active
      };
    } else {
      // If no matching step is found, mark the step as inactive and set "TBA" for date
      return {
        id: step.id,
        date: "TBA", // Default date for missing steps
        description: step.description,
        status: step.status, // Default status from predefined steps
        isActive: true, // Mark as inactive
      };
    }
  });

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 mt-4">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="lg:flex lg:gap-8">
          <div className="grow sm:mt-8 lg:mt-0">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Track your order</h3>

              <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                {mergedSteps.map((step) => {
                  // Apply dynamic text and icon colors based on whether the step is active or not
                  const isActive = step.isActive;
                  const fadeClass = 'animate-fadeInOut transition-colors duration-1500 ease-in-out';

                  // Define dynamic text and icon colors
                  const textColor = isActive ? `text-gray-500 dark:text-gray-400 ${fadeClass}` : 'text-primary-700 dark:text-primary-500';
                  const iconColor = isActive ? `text-gray-500 dark:text-gray-400 ${fadeClass}` : 'text-primary-700 dark:text-primary-500';
                  const bgColor = isActive ? `bg-gray-100 dark:bg-gray-700 ${fadeClass}` : 'bg-primary-100 dark:bg-primary-900';

                  // Define icon path depending on whether step is active or not
                  const iconPath = isActive ? 'm4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5' : 'M5 11.917 9.724 16.5 19 7.5';

                  return (
                    <li key={step.id} className="mb-10 ms-6">
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
                            d={iconPath}
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
