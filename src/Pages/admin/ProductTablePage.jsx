import React, { useState, useEffect } from 'react';
import { fetchCategoryOptions, fetchProductColumnData, fetchProductTableData } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';

const ProductTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchProductColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchProductTableData();
        setData(dataResponse);
        
        // Fetch category options
        const optionsResponse = await fetchCategoryOptions();
        setCategoryOptions(optionsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  // Handle new product addition
  const handleProductAdd = async (product) => {
    try {
      const addedProduct = await postProduct(product); // Call the postProduct API to add the new product
      console.log('Product added:', addedProduct);

      // Update the table data after successful POST request
      setData((prevData) => [...prevData, addedProduct]);

      // Optionally, handle success (e.g., close the modal)
      closeModal();
    } catch (error) {
      console.error('Error adding product:', error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Product Name',
      placeholder: 'Enter product name',
      id: 'name',
      value: '', // This value will be handled dynamically via formData
      onChange: () => {},
      required: true,
    },
    {
      type: 'number',
      title: 'Price',
      placeholder: '$2999',
      id: 'price',
      value: '',
      onChange: () => {},
      required: true,
    },
    {
      type: 'select',
      title: 'Category',
      placeholder: 'Select category',
      id: 'category',
      value: '',
      onChange: () => {},
      options: categoryOptions,
      required: true,
    },
    {
      type: 'textarea',
      title: 'Product Description',
      placeholder: 'Write product description here',
      id: 'description',
      rows: '4',
      value: '',
      onChange: () => {},
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Product Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Product List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Product
          </button>
        </div>

        <GenericTable data={data} columns={columns} rowClickable={true} />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onProductAdd={handleProductAdd}
          inputFields={inputFields}
          modalTitle="Create New Product"
          buttonText="Add Product"
        />
      </div>
    </div>
  );
};

export default ProductTablePage;
