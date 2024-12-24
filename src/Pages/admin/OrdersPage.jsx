import React, { useState, useEffect } from 'react';
import { fetchOrdersColumnData, fetchOrdersTableData, fetchStatusOptions, postOrderStatus } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const OrdersPage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchOrdersColumnData();
        setColumns(columnsResponse);

        const statusResponse = await fetchStatusOptions();
        setStatusOptions(statusResponse);
        
        const dataResponse = await fetchOrdersTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  // Handle new status change
  const handleStatusChange = async (formData) => {
    try {
      const { status } = formData; 

      // const updatedStatus = await postOrderStatus(status);
      // console.log('Status updated:', updatedStatus);

      // Update the table data after successful POST request
      setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedOrder.id ? { ...item, status  } : item
      )
    );

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
      options: statusOptions,
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

        <GenericTable data={data} columns={columns} rowClickable={true} actionClick={handleOpenModal} />

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
