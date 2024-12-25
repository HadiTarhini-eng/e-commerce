import React, { useState, useEffect } from 'react';
import { fetchCategoryColumnData, fetchCategoryTableData, postCategoryUpdates, addCategory, deleteCategory } from '../../api/adminApi'; // Added deleteCategory import
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; // Added import for ConfirmationModal
import toast from 'react-hot-toast';

const CategoryTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State for confirmation modal
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryIdToDelete, setSelectedCategoryIdToDelete] = useState(null); // Track the category to be deleted
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        const columnsResponse = await fetchCategoryColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchCategoryTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  // Function to open the modal for add/edit
  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setIsEditing(true);
    } else {
      setSelectedCategory(null);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  }

  // Handle Category Update or Add
  const handleCategoryEdit = async (updatedCategory) => {
    try {
      if (isEditing) {
        const updatedData = await postCategoryUpdates(updatedCategory);
        setData((prevData) =>
          prevData.map((item) => item.id === updatedCategory.id ? updatedData : item)
        );
        
        toast.success('Updated category successfully!');
        console.log(data)
      } else {
        const newCategoryData = await addCategory(updatedCategory);
        setData((prevData) => [...prevData, newCategoryData]);
        toast.success('Added new category successfully!');
      }

      closeModal();
    } catch (error) {
      console.error('Error handling category data:', error);
      toast.error('Error handling category data');
    }
  };

  // Open the confirmation modal for category deletion
  const openConfirmationModal = (categoryId) => {
    setSelectedCategoryIdToDelete(categoryId);
    setIsConfirmationModalOpen(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedCategoryIdToDelete(null);
  };

  // Handle Category Deletion
  const handleCategoryDelete = async () => {
    try {
      await deleteCategory(selectedCategoryIdToDelete); // Call the delete API
      setData((prevData) => prevData.filter((item) => item.id !== selectedCategoryIdToDelete)); // Update state
      closeConfirmationModal();
      toast.success('Deleted category successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const inputFields = [
    {
      type: 'text',
      title: 'Category ID',
      placeholder: '',
      id: 'id',
      value: selectedCategory ? selectedCategory.id : '',
      required: false,
      onChange: () => {}, // Disable editing the ID
      disabled: true
    },
    {
      type: 'text',
      title: 'Category Name',
      placeholder: 'Enter Category Name',
      id: 'name',
      value: selectedCategory ? selectedCategory.name : '',
      onChange: (e) => {
        setSelectedCategory((prevCategory) => ({
          ...prevCategory,
          name: e.target.value,
        }));
      },
      required: false,
    },
    {
      type: 'file',
      title: 'Category Image',
      placeholder: 'Drag or upload image',
      id: 'image',
      value: selectedCategory && selectedCategory.image ? selectedCategory.image : '',
      onChange: (filePath) => setSelectedCategory(prev => ({ ...prev, image: filePath })),
      required: false,
    },
  ];

  const dynamicInputFields = isEditing
    ? inputFields
    : inputFields.filter(field => field.id !== 'id');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Category Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Category List</h2>
          <div className='flex flex-col gap-4'>
            <button
              onClick={() => handleOpenModal()} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Category
            </button>
          </div>
        </div>

        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClick={handleOpenModal} // Open modal for edit/add
          deleteAction={true} // Show delete action
          editAction={true}
          actionDelete={openConfirmationModal} // Pass the delete handler
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleCategoryEdit}
          inputFields={dynamicInputFields}
          modalTitle={isEditing ? "Edit Category" : "Add New Category"}
          buttonText={isEditing ? "Update" : "Add"}
        />

        {/* Confirmation Modal for Deleting */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleCategoryDelete}
          message="Are you sure you want to delete this category?"
        />
      </div>
    </div>
  );
};

export default CategoryTablePage;
