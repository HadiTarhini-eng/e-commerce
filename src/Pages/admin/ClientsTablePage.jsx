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
      console.log('Client deleted:', response);

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
    const clientId = client.id;
    setSelectedClientId(clientId);
    setIsConfirmationModalOpen(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedClientId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Clients Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Clients List</h2>
        </div>

        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClick={openConfirmationModal} // Open the confirmation modal on delete action
          deleteAction={true} 
        />
      </div>

      {/* Use the ConfirmationModal component */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleClientDelete}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default ClientsTablePage;
