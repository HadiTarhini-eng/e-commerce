import React, { useState, useEffect } from 'react';
import { fetchScentsColumnData, fetchScentsTableData, postScentUpdates } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const ScentsTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchScentsColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchScentsTableData();
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

  // Handle scent update
  const handleScentEdit = async (scent) => {
    try {
      const newData = await postScentUpdates(scent); 
      console.log('Scent updated:', newData);

      // Update the table data after successful POST request
      setData((prevData) => [...prevData, newData]);

      // Optionally, handle success (e.g., close the modal)
      closeModal();
    } catch (error) {
      console.error('Error editing scent data:', error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Scent Name',
      placeholder: 'Enter Scent Name',
      id: 'name',
      value: '', // This value will be handled dynamically via formData
      onChange: () => {},
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Scents Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Scents List</h2>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={false} actionClick={handleOpenModal} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onProductAdd={handleScentEdit}
          inputFields={inputFields}
          modalTitle="Update Scent"
          buttonText="Update"
        />
      </div>
    </div>
  );
};

export default ScentsTablePage;
