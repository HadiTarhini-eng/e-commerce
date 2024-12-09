import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderHistory } from '../../api/ClientApi';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const orders = await fetchOrderHistory();
            setOrders(orders);
          } catch (error) {
            console.error('Error fetching order data:', error);
          }
        };
      
        fetchData();
      }, []);

    const handleButtonClick = (orderID, status) => {
        if (status === 'Delivered') {
            navigate(`/orderDetails/${orderID}`);
        } else {
            navigate(`/OrderTrack/${orderID}`);
        }
    };

    return (
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 mt-12">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-slate-800 text-lg font-semibold">
                        Latest orders
                    </h5>
                </div>
                <div className="divide-y divide-slate-200">
                    {orders.map((order, index) => (
                        <div className="flex items-center justify-between pb-3 pt-3 last:pb-0" key={index}>
                            <div className="flex items-center gap-x-3">
                                <div>
                                    <h6 className="text-slate-800 font-semibold">
                                        Order #{order.orderID}
                                    </h6>
                                    <p className="text-slate-600 text-sm">
                                        {order.dateOrdered}
                                    </p>
                                    <h6 className="text-slate-600 font-medium">
                                        Total: {order.total}
                                    </h6>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <div>
                                    <h6 className="text-slate-800 font-semibold">
                                        Status
                                    </h6>
                                    <h6 className={`font-medium ${order.status === 'Delivered' ? 'text-blue-600' : 'text-pink-600'}`}>
                                        {order.status}
                                    </h6>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <div>
                                    <button 
                                        className={`px-4 py-2 rounded-lg font-semibold text-white ${order.status === 'Delivered' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'} cursor-pointer`}
                                        onClick={() => handleButtonClick(order.orderID, order.status)} // Pass both orderID and status
                                    >
                                        {order.status === 'Delivered' ? 'View' : 'Track'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
