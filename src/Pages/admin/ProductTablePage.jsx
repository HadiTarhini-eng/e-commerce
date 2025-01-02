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

  const updateData = (updatedData) => {
    const modifiedData = updatedData.map((product) => ({
      ...product,
      price: `$${product.price}`, // Add $ symbol to price
      discountAmount: `${product.discountAmount}%`, // Add % symbol to discountAmount
      discountedPrice: `$${product.discountedPrice}`,
    }));
    setData(modifiedData);
  };

  // Fetch columns and data on page load
  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        const columnsResponse = await fetchProductColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchProductTableData();
        updateData(dataResponse)
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

  const handleOpenReviewPage = (id) => {
    navigate(`../productReviews/${id}`);
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
      window.location.reload();
    } catch (error) {
      toast.error('Error applying discount.');
      console.error('API Error:', error);
    }
  
    setIsDiscountModalOpen(false); // Close the modal after saving the discount
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
      },
      required: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
      </svg>
        Product List
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-top-lg">

        <GenericTable 
          showSearch={true}
          showAdd={true}
          addName={'Product'}
          showDiscount={true}
          showSelection={true} 
          showReview={true}
          reviewAction={handleOpenReviewPage}
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
          imageType={'products'}
          isReverse={true}
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
