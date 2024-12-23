import React, { useState, useEffect } from 'react';
import { fetchScentsColumnData, fetchScentsTableData, postScentUpdates, addScent } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';
import toast from 'react-hot-toast';

const ScentsTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScent, setSelectedScent] = useState(null);
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

  // This function will open the modal either for editing or adding a new scent
  const handleOpenModal = (scent = null) => {
    if (scent) {
      setSelectedScent(scent);
      setIsEditing(true);  // Edit mode
      toast.success('Updated scent successfully!')
    } else {
      setSelectedScent(null);  // Reset to add new scent
      setIsEditing(false);  // Add mode
      toast.success('Added new scent successfully!')
    }
    setIsModalOpen(true);
  }

  // Handle Scent Update or Add
  const handleScentUpdate = async (updatedScent) => {
    try {
      if (isEditing) {
        // Update the scent if in edit mode
        const updatedData = await postScentUpdates(updatedScent);  // Call the API to update scent
        setData((prevData) =>
          prevData.map((item) => item.id === updatedScent.id ? updatedData : item)
        );
      } else {
        // Add new scent logic here
        const { id, ...newScentData } = updatedScent; // Exclude `id` when adding
        const addedScentData = await addScent(newScentData);  // Call the API to add a new scent
        setData((prevData) => [...prevData, addedScentData]);
      }

      closeModal(); // Close the modal after action
    } catch (error) {
      console.error('Error handling scent data:', error);
    }
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Scents Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Scents List</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleOpenModal()} // Open modal to add new scent
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Scent
            </button>
          </div>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={false} actionClick={handleOpenModal} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleScentUpdate}
          inputFields={dynamicInputFields} // Pass dynamic input fields
          modalTitle={isEditing ? "Edit Scent" : "Add New Scent"} // Dynamic title
          buttonText={isEditing ? "Update" : "Add"} // Dynamic button text
        />
      </div>
    </div>
  );
};

export default ScentsTablePage;
