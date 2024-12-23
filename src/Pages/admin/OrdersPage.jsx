import React, { useState, useEffect } from 'react';
import { fetchOrdersColumnData, fetchOrdersTableData, postOrderStatus } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const OrdersPage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchOrdersColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchOrdersTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  // Handle new status change
  const handleStatusChange = async (newStatus) => {
    try {
      const updatedStatus = await postOrderStatus(newStatus);
      console.log('Status updated:', updatedStatus);

      // Update the table data after successful POST request
      setData((prevData) => [...prevData, updatedStatus]);

      // Optionally, handle success (e.g., close the modal)
      closeModal();
    } catch (error) {
      console.error('Error updating status:', error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Current Status',
      placeholder: 'Current Status',
      id: 'currentStatus',
      value: '',
      onChange: () => {},
      required: false,
      disabled: true,
    },
    {
      type: 'select',
      title: 'New Status',
      placeholder: 'Select new status',
      id: 'newStatus',
      value: '',
      onChange: () => {},
      options: statusOptions,
      required: true,
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

        <GenericTable data={data} columns={columns} rowClickable={false} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onProductAdd={handleStatusChange}
          inputFields={inputFields}
          modalTitle="Update Status"
          buttonText="Save"
        />
      </div>
    </div>
  );
};

export default OrdersPage;
