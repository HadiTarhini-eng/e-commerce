import React, { useState, useEffect } from 'react';
import { fetchReviewsColumnData, fetchReviewsTableData, postReviewDelete } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ProductReviewsPage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const productId = useParams();

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchReviewsColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchReviewsTableData(productId);
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  // Handle review delete
  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await postReviewDelete({ id: reviewId });

      // Update the table data after successful delete
      setData((prevData) => prevData.filter(review => review.id !== reviewId));

      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
      toast.success('Deleted review successfully!')
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error deleting review')
    }
  };

  // Open the confirmation modal
  const openConfirmationModal = (review) => {
    const reviewId = review;
    setSelectedReviewId(reviewId);
    setIsConfirmationModalOpen(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedReviewId(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
        <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
      </svg>
        Reviews List
      </h1>      

      <div className="bg-white p-6 rounded-lg shadow-top-lg">
        <GenericTable
          showSearch={true} 
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionDelete={openConfirmationModal} // Open the confirmation modal on delete action
          deleteAction={true} 
          isReverse={true}
        />
      </div>

      {/* Use the ConfirmationModal component */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleReviewDelete}
        deleteId={selectedReviewId}
      />
    </div>
  );
};

export default ProductReviewsPage;
