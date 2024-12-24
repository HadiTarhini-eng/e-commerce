import React, { useState, useEffect } from 'react';
import { fetchCategoryColumnData, fetchCategoryTableData, postCategoryUpdates, addCategory } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const CategoryTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if it's edit or add

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
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

  // This function will determine if we're adding or editing
  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setIsEditing(true);  // Edit mode
    } else {
      setSelectedCategory(null);  // Reset to add new category
      setIsEditing(false);  // Add mode
    }
    setIsModalOpen(true);
  }

  // Handle Category Update or Add
  const handleCategoryEdit = async (updatedCategory) => {
    try {
      if (isEditing) {
        // Update the category if in edit mode
        const updatedData = await postCategoryUpdates(updatedCategory);  // Call the API to update category
        setData((prevData) =>
          prevData.map((item) => item.id === updatedCategory.id ? updatedData : item)
        );
      } else {
        // Add new category logic here
        const newCategoryData = await addCategory(updatedCategory);  // Call the API to add a new category
        setData((prevData) => [...prevData, newCategoryData]);
      }

      closeModal(); // Close the modal after action
    } catch (error) {
      console.error('Error handling category data:', error);
    }
  };

  // Define the input fields dynamically
  const inputFields = [
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Category Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Category List</h2>
          <div className='flex flex-col gap-4'>
            <button
              onClick={() => handleOpenModal()} // Open modal to add new category
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Category
            </button>
          </div>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={false} actionClick={handleOpenModal} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleCategoryEdit}
          inputFields={inputFields}
          modalTitle={isEditing ? "Edit Category" : "Add New Category"} // Dynamic title
          buttonText={isEditing ? "Update" : "Add"} // Dynamic button text
        />
      </div>
    </div>
  );
};

export default CategoryTablePage;
