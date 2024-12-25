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
  const totalAfterDiscount = order.totalPrice - order.discount;

  // Product Data (Mapped from order)
  const productColumns = [
    { Header: 'Product Name', accessor: 'name' },
    { Header: 'Scent', accessor: 'scent' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Total', accessor: 'total' }
  ];

  const products = [
    {
      name: order.productName1,
      scent: order.productScent1,
      quantity: order.productQuantity1,
      price: order.productPrice1,
      total: (order.productPrice1 * order.productQuantity1).toFixed(2),
    },
    {
      name: order.productName2,
      scent: order.productScent2,
      quantity: order.productQuantity2,
      price: order.productPrice2,
      total: (order.productPrice2 * order.productQuantity2).toFixed(2),
    }
  ];

  // Client Info Table Data
  const clientInfoColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' }
  ];

  const clientInfo = [
    { field: 'Name', value: order.billingName },
    { field: 'Phone', value: order.billingPhone },
    { field: 'Address', value: order.billingAddress },
    { field: 'City', value: order.city },
  ];

  // Checkout Info Table Data
  const checkoutInfoColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' }
  ];

  const checkoutInfo = [
    { field: 'Shipping Method', value: order.deliveryMethod },
    { field: 'Shipping Price', value: `$${order.deliveryPrice}` },
    { field: 'Note', value: order.note },
    { field: 'Payment Method', value: order.paymentMethod },
  ];

  // Order Summary Data
  const orderSummaryColumns = [
    { Header: 'Field', accessor: 'field' },
    { Header: 'Value', accessor: 'value' }
  ];

  const orderSummary = [
    { field: 'Order ID', value: order.id },
    { field: 'Date Ordered', value: order.dateOrdered },
    { field: 'Total Price', value: `$${order.totalPrice}` },
    { field: 'Discount', value: `-${order.discount}` },
    { field: 'Total After Discount', value: `$${totalAfterDiscount}` },
  ];

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex flex-col space-y-14">
        <div className='flex flex-row gap-4 justify-between'>
          {/* Client Info Table */}
          <GenericTable
            showSearch={false}
            columns={clientInfoColumns}
            data={clientInfo}
            rowClickable={false}  // No row click for client info
          />

          {/* Checkout Info Table */}
          <GenericTable
            showSearch={false}
            columns={checkoutInfoColumns}
            data={checkoutInfo}
            rowClickable={false}  // No row click for checkout info
          />

          {/* Order Summary Table */}
          <GenericTable
            showSearch={false}
            columns={orderSummaryColumns}
            data={orderSummary}
            rowClickable={false}  // No row click for order summary
          />  
        </div>

        {/* Product Table */}
        <GenericTable
          showSearch={true}
          columns={productColumns}
          data={products}
          rowClickable={false}  // No row click for products
        />      
      </div>
    </div>
  );
};

export default OrderDetails;
