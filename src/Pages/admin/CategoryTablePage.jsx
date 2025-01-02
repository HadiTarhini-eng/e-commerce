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
          prevData.map((item) => item.id === updatedCategory.id ? updatedCategory : item)
        );
        
        toast.success('Updated category successfully!');
      } else {
        const newCategoryData = await addCategory(updatedCategory);
        setData((prevData) => [...prevData, updatedCategory]);
        toast.success('Added new category successfully!');
        window.location.reload();
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
      id: 'title',
      value: selectedCategory ? selectedCategory.title : '',
      onChange: (e) => {
        setSelectedCategory((prevCategory) => ({
          ...prevCategory,
          title: e.target.value,
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
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
        </svg>
        Category List
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-top-lg">
        <div className="flex justify-between items-center mb-4">
        </div>

        <GenericTable
          showSearch={true} 
          showAdd={true}
          addName="Category"
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClickEdit={handleOpenModal} // Open modal for edit/add
          actionClickAdd={handleOpenModal}
          deleteAction={true}
          editAction={true}
          actionDelete={openConfirmationModal} // Pass the delete handler
          imageType={'categories'}
          isReverse={true}
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
          deleteId={selectedCategoryIdToDelete}
        />
      </div>
    </div>
  );
};

export default CategoryTablePage;
