import React, { useState, useEffect } from 'react';
import { fetchClientsColumnData, fetchClientsTableData, postClientUpdates } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const ClientsTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchClientsColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchClientsTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  // Handle client data edit
  const handleClientEdit = async (clientData) => {
    try {
      const newData = await postClientUpdates(clientData); 
      console.log('Update:', newData);

      // Update the table data after successful POST request
      setData((prevData) => [...prevData, newData]);

      // Optionally, handle success (e.g., close the modal)
      closeModal();
    } catch (error) {
      console.error('Error editing client data:', error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Client Name',
      placeholder: 'Enter product name',
      id: 'name',
      value: '', // This value will be handled dynamically via formData
      onChange: () => {},
      required: true,
    },
    {
      type: 'phoneNumber',
      title: 'Phone Number',
      placeholder: 'Input phone number',
      id: 'phoneNumber',
      value: '',
      onChange: () => {},
      required: true,
    },
    {
      type: 'text',
      title: 'text',
      placeholder: 'Email',
      id: 'email',
      value: '',
      onChange: () => {},
      required: true,
    },
    {
      type: 'password',
      title: 'Password',
      placeholder: 'Enter password',
      id: 'password',
      rows: '4',
      value: '',
      onChange: () => {},
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Clients Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Clients List</h2>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={false} actionClick={handleOpenModal} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onProductAdd={handleClientEdit}
          inputFields={inputFields}
          modalTitle="Update User Information"
          buttonText="Update"
        />
      </div>
    </div>
  );
};

export default ClientsTablePage;
