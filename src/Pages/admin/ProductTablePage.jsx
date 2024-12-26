import React, { useState, useEffect } from 'react';
import { fetchProductColumnData, fetchProductTableData, deleteProduct, applyDiscountToProducts } from '../../api/adminApi'; 
import DynamicModal from '../../components/admin/DynamicModal';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../components/admin/table/GenericTable';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; 

const ProductTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProductIdToDelete, setSelectedProductIdToDelete] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(''); // Track discount value
  const navigate = useNavigate();
console.log(data)
  // Fetch columns and data on page load
  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        const columnsResponse = await fetchProductColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchProductTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  // Handle row selection
  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  const handleOpenEditPage = (row) => {
    const productId = row.id;
    navigate(`../productDetailsPage/${productId}`);
  };

  const handleOpenAddPage = () => {
    navigate('../productDetailsPage/add');
  };

  // Handle Add Discount Button click
  const handleDiscount = () => {
    if (selectedRows.length === 0) {
      toast.error("You must select at least one product.");
    } else {
      setIsDiscountModalOpen(true); // Open the discount modal
    }
  };

  // Handle Save Discount
  const handleSaveDiscount = async (returnedDiscount) => {
 
    // Apply discount to selected rows locally first
    const updatedData = data.map((product) => {
      if (selectedRows.includes(product.id)) {
        return { ...product, discountAmount: parseFloat(returnedDiscount.discount) }; // Update discountAmount
      }
      return product;
    });
  
    // Update the local state with the new data
    setData(updatedData);
  
    // Send the updated discount values to the backend via API
    try {
      const productIds = selectedRows; // Get the IDs of the selected products

      await applyDiscountToProducts(returnedDiscount, productIds); // Call the POST API to apply the discount
      toast.success('Discount applied successfully!');
    } catch (error) {
      toast.error('Error applying discount.');
      console.error('API Error:', error);
    }
  
    setIsModalOpen(false); // Close the modal after saving the discount
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

  // Define the input fields dynamically for the product modal
  const inputFields = [
    {
      type: 'number',
      title: 'Discount Amount (%)',
      placeholder: 'Enter discount percentage',
      id: 'discount',
      value: discountValue,
      onChange: (e) => {
        setDiscountValue((prevDiscount) => ({
          ...prevDiscount,
          discountValue: e.target.value,
        }));
        console.log(e.target.value)
      },
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Product Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-700">Product List</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleOpenAddPage('add')}
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
          actionClick={handleOpenEditPage} 
          deleteAction={true} 
          onSelectionChange={handleSelectionChange} 
          editAction={true}
          actionDelete={openConfirmationModalForDelete}
        />

        {/* Discount Modal */}
        <DynamicModal
          isOpen={isDiscountModalOpen}
          closeModal={() => setIsDiscountModalOpen(false)}
          handleFucntion={handleSaveDiscount}
          inputFields={inputFields}
          modalTitle="Apply Discount to Selected Products"
          buttonText="Apply Discount"
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
