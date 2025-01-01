import React, { useState, useEffect } from 'react';
import { fetchClientsColumnData, fetchClientsTableData, postClientDelete } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import toast from 'react-hot-toast';

const ClientsTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

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

  // Handle client delete
  const handleClientDelete = async (clientId) => {
    try {
      const response = await postClientDelete({ id: clientId });

      // Update the table data after successful delete
      setData((prevData) => prevData.filter(client => client.id !== clientId));

      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
      toast.success('Deleted client successfully!')
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error deleting client')
    }
  };

  // Open the confirmation modal
  const openConfirmationModal = (client) => {
    const clientId = client;
    setSelectedClientId(clientId);
    setIsConfirmationModalOpen(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedClientId(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        Client List
      </h1>      

      <div className="bg-white p-6 rounded-lg shadow-top-lg">
        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionDelete={openConfirmationModal} // Open the confirmation modal on delete action
          deleteAction={true} 
        />
      </div>

      {/* Use the ConfirmationModal component */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleClientDelete}
        deleteId={selectedClientId}
      />
    </div>
  );
};

export default ClientsTablePage;
