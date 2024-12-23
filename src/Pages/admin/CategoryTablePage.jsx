import React, { useState, useEffect } from 'react';
import { fetchCategoryColumnData, fetchCategoryTableData, fetchScentsColumnData, fetchScentsTableData, postCategoryUpdates, postScentUpdates } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const CategoryTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }

  // Handle Category Update
  const handleCategoryEdit = async (updatedCategory) => {
    console.log(updatedCategory);
    // set categroy name to new category here
    try {
      const newCategoryData = await postCategoryUpdates(updatedCategory); 
      console.log('Category updated:', newCategoryData);

      // Update the table data after successful POST request
      setData((prevData) => 
        prevData.map((item) => item.id === newCategoryData.id ? newCategoryData : item)  // Replace the updated category
      );

      // Optionally, handle success (e.g., close the modal)
      closeModal();
    } catch (error) {
      console.error('Error editing category data:', error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Category ID',
      placeholder: '',
      id: 'id',
      value: selectedCategory ? selectedCategory.id : '',
      required: true,
      onChange: () => {},
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
      required: true,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Category Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Category List</h2>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={false} actionClick={handleOpenModal} editAction={true} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleCategoryEdit}
          inputFields={inputFields}
          modalTitle="Update Category"
          buttonText="Update"
        />
      </div>
    </div>
  );
};

export default CategoryTablePage;
