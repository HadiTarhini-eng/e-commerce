import React, { useState, useEffect } from 'react';
import { fetchScentsColumnData, fetchScentsTableData, postScentUpdates, addScent, deleteScent } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; // Import the confirmation modal
import toast from 'react-hot-toast';

const ScentsTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Confirmation modal state
  const [selectedScent, setSelectedScent] = useState(null);
  const [selectedScentIdToDelete, setSelectedScentIdToDelete] = useState(null); // Track scent to delete
  const [isEditing, setIsEditing] = useState(false); // Track if it's edit or add

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
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false); // Close confirmation modal

  // This function will open the modal either for editing or adding a new scent
  const handleOpenModal = (scent = null) => {
    if (scent) {
      setSelectedScent(scent);
      setIsEditing(true);  // Edit mode
    } else {
      setSelectedScent(null);  // Reset to add new scent
      setIsEditing(false);  // Add mode
    }
    setIsModalOpen(true);
  }

  // Handle Scent Update or Add
  const handleScentUpdate = async (updatedScent) => {
    try {
      if (isEditing) {
        // Update the scent if in edit mode
        const updatedData = await postScentUpdates(updatedScent);  // Call the API to update scent
        console.log(updatedData)
        setData((prevData) =>
          prevData.map((item) => item.id === updatedScent.id ? updatedScent : item)
        );
        console.log(data)
        toast.success('Updated scent successfully!');
      } else {
        // Add new scent logic here
        const { id, ...newScentData } = updatedScent; // Exclude `id` when adding
        const addedScentData = await addScent(newScentData);  // Call the API to add a new scent
        setData((prevData) => [...prevData, addedScentData]);
        toast.success('Added new scent successfully!');
        window.location.reload();
      }

      closeModal(); // Close the modal after action
    } catch (error) {
      console.error('Error handling scent data:', error);
      toast.error('Error handling scent data');
    }
  };

  // Handle the delete action
  const handleScentDelete = async () => {
    try {
      await deleteScent(selectedScentIdToDelete); // Call the deleteScent API
      setData((prevData) => prevData.filter(scent => scent.id !== selectedScentIdToDelete)); // Remove deleted scent from state
      toast.success('Scent deleted successfully!');
      closeConfirmationModal();
    } catch (error) {
      console.error('Error deleting scent:', error);
      toast.error('Error deleting scent');
    }
  };

  // Open confirmation modal for delete
  const openConfirmationModalForDelete = (scent) => {
    console.log(scent)
    setSelectedScentIdToDelete(scent);
    setIsConfirmationModalOpen(true);
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Scent ID',
      placeholder: '',
      id: 'id',
      value: selectedScent ? selectedScent.id : '',
      required: false,
      onChange: () => {}, // Disable editing the ID
      disabled: true
    },
    {
      type: 'text',
      title: 'Scent Name',
      placeholder: 'Enter Scent Name',
      id: 'name',
      value: selectedScent ? selectedScent.name : '',
      onChange: (e) => {
        setSelectedScent((prevScent) => ({
          ...prevScent,
          name: e.target.value,
        }));
      },
      required: true,
    },
  ];

  // Remove the 'Scent ID' input field for adding new scents
  const dynamicInputFields = isEditing
    ? inputFields  // Keep all fields if editing
    : inputFields.filter(field => field.id !== 'id'); // Remove 'id' field when adding new scent

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        Scent List
      </h1>   

      <div className="bg-white p-6 rounded-lg shadow-top-lg">
        <GenericTable
          showSearch={true} 
          showAdd={true}
          addName={'Scent'}
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClickEdit={handleOpenModal} 
          actionClickAdd={handleOpenModal} 
          deleteAction={true}
          editAction={true}
          actionDelete={openConfirmationModalForDelete} // Pass delete action to table
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleScentUpdate}
          inputFields={dynamicInputFields} // Pass dynamic input fields
          modalTitle={isEditing ? "Edit Scent" : "Add New Scent"} // Dynamic title
          buttonText={isEditing ? "Update" : "Add"} // Dynamic button text
        />

        {/* Confirmation Modal for Delete */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleScentDelete}
          deleteId={selectedScentIdToDelete}
        />
      </div>
    </div>
  );
};

export default ScentsTablePage;
