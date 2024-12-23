import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderHistory } from '../../api/clientApi';
import { useAuth } from '../../components/client/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState([]);  // To store the status data from the JSON file
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('User is not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOrderHistory(userId);
        if (Array.isArray(response) && response.length === 0) {
          setError('No orders yet!');
        } else if (Array.isArray(response)) {
          setOrders(response);
          setError(null);
        } else {
          setError('Unexpected response structure');
          console.error('Unexpected response structure:', response);
        }
      } catch (err) {
        setError('Failed to fetch order data. Please try again later.');
        console.error('Error fetching order data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch status data from the JSON file
    const fetchStatusData = async () => {
      try {
        const response = await fetch('/data/orderStatus.json');
        if (response.ok) {
          const data = await response.json();
          setStatusData(data);
        } else {
          console.error('Failed to load status data');
        }
      } catch (err) {
        console.error('Error loading status data:', err);
      }
    };

    fetchData();
    fetchStatusData(); // Fetch the status data
  }, [userId]);

  const handleButtonClick = (orderID, status) => {
    if (status === 'Delivered') {
      navigate(`/orderDetails/${orderID}`);
    } else {
      navigate(`/OrderTrack/${orderID}`);
    }
  };

  // Function to get the color and comment based on status
  const getStatusInfo = (status) => {
    const statusInfo = statusData.find((item) => item.status === status);
    return statusInfo || { color: '#000', comment: 'Unknown status' }; // Default fallback
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-6">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center my-6">
        <span className="text-grey-500 font-bold text-3xl mt-10">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-full">
      <div className="p-4">
        <div className="divide-y divide-slate-200">
          {orders.length === 0 ? (
            <div className="flex justify-center items-center py-6">
              <span>No orders available</span>
            </div>
          ) : (
            orders.map((order, index) => {
              const { color, comment } = getStatusInfo(order.status); // Get the status info
              return (
                <div className={`flex items-center ${order.status === 'Canceled' ? 'justify-center' : 'justify-between'} pb-3 pt-3 last:pb-0`} key={index}>
                  <div className={`flex items-center gap-x-3 ${order.status === 'Canceled' ? 'absolute left-4' : ''}`}>
                    <div>
                      <h6 className="text-slate-800 font-semibold">Order #{order.orderID}</h6>
                      <p className="text-slate-600 text-sm">{order.dateOrdered}</p>
                      <h6 className="text-slate-600 font-medium">Total: {order.total}</h6>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div>
                      <h6 className="text-slate-800 font-semibold">Status</h6>
                      <h6
                        className="font-medium"
                        style={{ color: color }} // Apply color dynamically
                      >
                        {order.status}
                      </h6>
                    </div>
                  </div>
                  {order.status !== 'Canceled' && (
                    <div className="flex items-center gap-x-3">
                      <div>
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold text-white ${order.status === 'Delivered' ? 'bg-palette-button hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'} cursor-pointer`}
                          onClick={() => handleButtonClick(order.orderID, order.status)}
                        >
                          {order.status === 'Delivered' ? 'View' : 'Track'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
