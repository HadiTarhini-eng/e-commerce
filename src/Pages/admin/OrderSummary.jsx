import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderSummaryData } from '../../api/adminApi';
import GenericTable from '../../components/admin/table/GenericTable';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const data = await fetchOrderSummaryData(orderId); // Fetch data based on orderId
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order data", error);
      }
    };
    getOrderData();
  }, [orderId]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  // Assuming orderData is an array of orders and we're displaying the first order.
  const order = orderData[0];

  // Helper function to calculate total after discount
  const totalAfterDiscount = (order.totalPrice - order.orderDiscount).toFixed(2);

  // Product Data (Mapped from order.orderData)
  const productColumns = [
    { Header: 'Product Name', accessor: 'name' },
    { Header: 'Scent', accessor: 'scent' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Total', accessor: 'total' },
  ];

  const products = order.orderData.map((product) => ({
    name: product.productName || "N/A", // Default to "N/A" if null
    scent: product.scentName || "N/A",
    quantity: product.quantity,
    price: parseFloat(product.price).toFixed(2),
    total: (parseFloat(product.price) * parseInt(product.quantity)).toFixed(2),
  }));

  // Client Info Table Data
  const clientInfoColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' },
  ];

  const clientInfo = [
    { field: 'Name', value: order.name },
    { field: 'Phone', value: order.phone },
    { field: 'Address', value: order.address },
    { field: 'City', value: order.city },
  ];

  // Checkout Info Table Data
  const checkoutInfoColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' },
  ];

  const checkoutInfo = [
    { field: 'Shipping Method', value: order.deliveryName },
    { field: 'Shipping Price', value: `$${order.deliveryCost}` },
    { field: 'Note', value: order.note || "N/A" },
    { field: 'Payment Method', value: order.paymentName },
  ];

  // Order Summary Data
  const orderSummaryColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' },
  ];

  const orderSummary = [
    { field: 'Order ID', value: order.orderId },
    { field: 'Date Ordered', value: order.Date },
    { field: 'Total Price', value: `$${order.totalPrice}` },
    { field: 'Discount', value: `-$${order.orderDiscount}` },
    { field: 'Total After Discount', value: `$${totalAfterDiscount}` },
  ];

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex flex-col space-y-14">
        {/* Client Info Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Client Info</h2>
          <GenericTable
            showSearch={false}
            columns={clientInfoColumns}
            data={clientInfo}
            rowClickable={false}  // No row click for client info
          />
        </div>

        <div>
          {/* Checkout Info Table */}
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Checkout Info</h2>
          <GenericTable
            showSearch={false}
            columns={checkoutInfoColumns}
            data={checkoutInfo}
            rowClickable={false}  // No row click for checkout info
          />
        </div>

        <div>
          {/* Order Summary Table */}
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Order Summary</h2>
          <GenericTable
            showSearch={false}
            columns={orderSummaryColumns}
            data={orderSummary}
            rowClickable={false}  // No row click for order summary
          />  
        </div>

        <div>
          {/* Product Table */}
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Products</h2>
          <GenericTable
            showSearch={true}
            columns={productColumns}
            data={products}
            rowClickable={false}  // No row click for products
          /> 
        </div>     
      </div>
    </div>
  );
};

export default OrderDetails;
