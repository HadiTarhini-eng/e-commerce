import React, { useState, useEffect } from 'react';
import { fetchOrdersColumnData, fetchOrdersTableData, fetchStatusOptions, postOrderStatus } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
console.log(data)
  // Fetch columns, status options, and table data on page load
  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and status options
        const columnsResponse = await fetchOrdersColumnData();
        setColumns(columnsResponse);
        const statusResponse = await fetchStatusOptions();
        setStatusOptions(statusResponse);

        // Fetch orders data and modify rows to include disableButton
        const dataResponse = await fetchOrdersTableData();
        updateDisableButtonFlag(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  // Update the disableButton flag for each row based on the status and format fields
  const updateDisableButtonFlag = (updatedData) => {
    const modifiedData = updatedData.map((order) => ({
      ...order,
      disableButton: order.status === 'Canceled' || order.status === 'Delivered',
      price: `$${order.price}`, // Add $ symbol to price
      total: `$${order.total}`, // Add $ symbol to total
      deliveryCost: `$${order.deliveryCost}`, // Add $ symbol to deliveryCost
      discount: `${order.discount}%`, // Add % symbol to discount
    }));
    setData(modifiedData);
  };

  // Close modal
  const closeModal = () => setIsModalOpen(false);

  // Open modal to edit order status
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle the status change and update the data accordingly
  const handleStatusChange = async (formData) => {
    try {
      const { status } = formData;
  
      // Find the status ID from statusOptions based on the selected status name
      const selectedStatusOption = statusOptions.find(
        (option) => option.status === status
      );
  
      // If the status is not found, show an error
      if (!selectedStatusOption) {
        toast.error('Selected status not found!');
        return;
      }
  
      const statusId = selectedStatusOption.id; // Get the status ID
      
      // Call the API to update the status with both the status name and its ID
      const updatedStatus = await postOrderStatus({
        id: selectedOrder.id,  // Pass the order ID
        status: status,        // Pass the status name
        statusId: statusId     // Pass the status ID
      });
  
      console.log('Status updated:', updatedStatus);
  
      // Update the row's status and recalculate the disableButton flag
      const updatedData = data.map((item) =>
        item.id === selectedOrder.id ? { ...item, status } : item
      );
  
      // After status update, reapply the disableButton check
      updateDisableButtonFlag(updatedData);
  
      // Optionally, close the modal after the update
      closeModal();
      toast.success('Updated status successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };
  

  // Filter the status options to include only the next option and the last option
  const getFilteredStatusOptions = () => {
    if (!selectedOrder || !statusOptions.length) return [];

    // Find the current status in the statusOptions array
    const currentStatusIndex = statusOptions.findIndex(
      (option) => option.status === selectedOrder.status
    );

    if (currentStatusIndex === -1) return []; // If status not found, return empty array

    // Get the next status (if available) and the last status
    const nextStatus = statusOptions[currentStatusIndex + 1];
    const lastStatus = statusOptions[statusOptions.length - 1];

    // Return an array with the next status and the last status
    return [nextStatus, lastStatus].filter(Boolean); // Remove undefined values if no next status exists
  };

  // Define input fields for the modal
  const inputFields = [
    {
      type: 'text',
      title: 'Order ID',
      placeholder: 'Enter order ID',
      id: 'orderID',
      value: selectedOrder ? selectedOrder.id : '',
      onChange: () => {},
      required: false,
      disabled: true,
    },
    {
      type: 'select',
      title: 'New Status',
      placeholder: selectedOrder ? selectedOrder.status : '',
      id: 'status',
      value: selectedOrder ? selectedOrder.status : '',
      onChange: (e) => {
        setSelectedOrder((prevOrder) => ({
          ...prevOrder,
          status: e.target.value,
        }));
      },
      options: getFilteredStatusOptions(),
      required: false,
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
        Order List
      </h1>   
      
      <div className="bg-white p-6 rounded-lg shadow-top-lg">

        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={true} 
          actionClickEdit={handleOpenModal} 
          editAction={true}
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleStatusChange}
          inputFields={inputFields}
          modalTitle="Update Status"
          buttonText="Save"
          fromOrders={true}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
