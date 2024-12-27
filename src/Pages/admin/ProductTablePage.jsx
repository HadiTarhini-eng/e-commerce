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
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        Product List
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">

        <GenericTable 
          showSearch={true}
          showAdd={true}
          addName={'Product'}
          showDiscount={true}
          showSelection={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClickEdit={handleOpenEditPage} 
          actionClickAdd={handleOpenAddPage} 
          actionClickDiscount={handleDiscount}
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
