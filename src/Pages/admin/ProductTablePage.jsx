import React, { useState, useEffect } from 'react';
import { fetchCategoryOptions, fetchProductColumnData, fetchProductTableData, deleteProduct } from '../../api/adminApi'; 
import DynamicModal from '../../components/admin/DynamicModal';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../components/admin/table/GenericTable';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; // Import the confirmation modal

const ProductTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Confirmation modal state
  const [selectedProductIdToDelete, setSelectedProductIdToDelete] = useState(null); // Track product to delete
  const navigate = useNavigate();

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

  // Pass selected rows data back to parent component via this function
  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false); // Close confirmation modal

  const handleOpenPage = (row) => {
    const productId = row.id;
    navigate(`../productDetailsPage/${productId}`);
  };

  const handleDiscount = () => {
    if (selectedRows.length === 0) {
      toast.error("You must select at least one product.");
    } else {
      // Proceed with discount logic for selected rows
      console.log("Applying discount to selected products", selectedRows);
    }
  };

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

  // Handle Product Deletion
  const handleProductDelete = async () => {
    try {
      await deleteProduct(selectedProductIdToDelete); // Call the deleteProduct API
      setData((prevData) => prevData.filter(product => product.id !== selectedProductIdToDelete)); // Remove deleted product from state
      toast.success('Product deleted successfully!');
      closeConfirmationModal();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  // Open confirmation modal for delete
  const openConfirmationModalForDelete = (product) => {
    setSelectedProductIdToDelete(product);
    setIsConfirmationModalOpen(true);
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Product Name',
      placeholder: 'Enter product name',
      id: 'name',
      value: selectedProduct ? selectedProduct.name : '',
      onChange: () => {},
      required: true,
    },
    {
      type: 'number',
      title: 'Price',
      placeholder: '$2999',
      id: 'price',
      value: selectedProduct ? selectedProduct.price : '',
      onChange: () => {},
      required: true,
    },
    {
      type: 'select',
      title: 'Category',
      placeholder: 'Select category',
      id: 'category',
      value: selectedProduct ? selectedProduct.category : '',
      onChange: () => {},
      options: categoryOptions,
      required: true,
    },
    {
      type: 'textarea',
      title: 'Product Specifications',
      placeholder: 'Write product description here',
      id: 'specification',
      rows: '4',
      value: selectedProduct ? selectedProduct.specifications : '',
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
          <div className='flex flex-col gap-4'>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Product
            </button>
            <button
              onClick={handleDiscount}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Discount
            </button>
          </div>
        </div>

        <GenericTable 
          showSearch={true}
          showSelection={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClick={handleOpenPage} 
          deleteAction={true} 
          onSelectionChange={handleSelectionChange} 
          editAction={true}
          actionDelete={openConfirmationModalForDelete} // Pass delete action to table
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          onProductAdd={handleProductAdd}
          inputFields={inputFields}
          modalTitle="Create New Product"
          buttonText="Add Product"
        />

        {/* Confirmation Modal for Delete */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleProductDelete}
          deleteId={selectedProductIdToDelete}
        />
      </div>
    </div>
  );
};

export default ProductTablePage;
