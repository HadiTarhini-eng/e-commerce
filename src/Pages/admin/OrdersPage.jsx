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

  // Update the disableButton flag for each row based on the status
  const updateDisableButtonFlag = (updatedData) => {
    const modifiedData = updatedData.map((order) => ({
      ...order,
      disableButton: order.status === 'Canceled' || order.status === 'Delivered'
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
      placeholder: 'Select new status',
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Orders Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Orders List</h2>
        </div>

        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={true} 
          actionClick={handleOpenModal} 
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleStatusChange}
          inputFields={inputFields}
          modalTitle="Update Status"
          buttonText="Save"
        />
      </div>
    </div>
  );
};

export default OrdersPage;
