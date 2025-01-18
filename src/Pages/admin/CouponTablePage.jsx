import React, { useState, useEffect } from 'react';
import { fetchCouponsColumnData, fetchCouponsTableData, postCouponUpdates, addCoupon, deleteCoupon } from '../../api/adminApi'; 
import GenericTable from '../../components/admin/table/GenericTable';
import DynamicModal from '../../components/admin/DynamicModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; // Import the confirmation modal
import toast from 'react-hot-toast';

const CouponTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Confirmation modal state
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedCouponIdToDelete, setSelectedCouponIdToDelete] = useState(null); // Track coupon to delete
  const [isEditing, setIsEditing] = useState(false); // Track if it's edit or add

  useEffect(() => {
    const fetchColumnsAndData = async () => {
      try {
        // Fetch columns and table data
        const columnsResponse = await fetchCouponsColumnData();
        setColumns(columnsResponse);
        
        const dataResponse = await fetchCouponsTableData();
        setData(dataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchColumnsAndData();
  }, []);

  const closeModal = () => setIsModalOpen(false);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false); // Close confirmation modal

  // This function will open the modal either for editing or adding a new coupon
  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setSelectedCoupon(coupon);
      setIsEditing(true);  // Edit mode
    } else {
      setSelectedCoupon(null);  // Reset to add new coupon
      setIsEditing(false);  // Add mode
    }
    setIsModalOpen(true);
  };

  // Handle Coupon Update or Add
  const handleCouponUpdate = async (updatedCoupon) => {
    try {
      if (isEditing) {
        // Update the coupon if in edit mode
        const updatedData = await postCouponUpdates(updatedCoupon);  // Call the API to update coupon
        setData((prevData) =>
          prevData.map((item) => item.id === updatedCoupon.id ? updatedCoupon : item)
        );
        toast.success('Updated coupon successfully!');
      } else {
        // Add new coupon logic here
        const { id, ...newCouponData } = updatedCoupon; // Exclude `id` when adding
        const addedCouponData = await addCoupon(newCouponData);  // Call the API to add a new coupon
        setData((prevData) => [...prevData, addedCouponData]);
        toast.success('Added new coupon successfully!');
        window.location.reload();
      }

      closeModal(); // Close the modal after action
    } catch (error) {
      console.error('Error handling coupon data:', error);
      toast.error('Error handling coupon data');
    }
  };

  // Handle the delete action
  const handleCouponDelete = async () => {
    try {
      await deleteCoupon(selectedCouponIdToDelete); // Call the deleteCoupon API
      setData((prevData) => prevData.filter(coupon => coupon.id !== selectedCouponIdToDelete)); // Remove deleted coupon from state
      toast.success('Coupon deleted successfully!');
      closeConfirmationModal();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Error deleting coupon');
    }
  };

  // Open confirmation modal for delete
  const openConfirmationModalForDelete = (coupon) => {
    setSelectedCouponIdToDelete(coupon);
    setIsConfirmationModalOpen(true);
  };

  // Define the input fields dynamically
  const inputFields = [
    {
      type: 'text',
      title: 'Coupon ID',
      placeholder: '',
      id: 'id',
      value: selectedCoupon ? selectedCoupon.id : '',
      required: false,
      onChange: () => {}, // Disable editing the ID
      disabled: true
    },
    {
      type: 'text',
      title: 'Coupon Name',
      placeholder: 'Enter Coupon Name',
      id: 'name',
      value: selectedCoupon ? selectedCoupon.name : '',
      onChange: (e) => {
        setSelectedCoupon((prevCoupon) => ({
          ...prevCoupon,
          name: e.target.value,
        }));
      },
      required: true,
    },
    {
      type: 'number',
      title: 'Coupon Value',
      placeholder: 'Enter Coupon Value',
      id: 'value',
      value: selectedCoupon ? selectedCoupon.value : '',
      onChange: (e) => {
        setSelectedCoupon((prevCoupon) => ({
          ...prevCoupon,
          value: e.target.value,
        }));
      },
      required: true,
    },
  ];

  // Remove the 'Coupon ID' input field for adding new coupons
  const dynamicInputFields = isEditing
    ? inputFields  // Keep all fields if editing
    : inputFields.filter(field => field.id !== 'id'); // Remove 'id' field when adding new coupon

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="flex items-center flex-row gap-2 text-3xl font-bold text-gray-700 mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
      </svg>
        Coupon List
      </h1>   

      <div className="bg-white p-6 rounded-lg shadow-top-lg">
        <GenericTable
          showSearch={true} 
          showAdd={true}
          addName={'Coupon'}
          data={data} 
          columns={columns} 
          rowClickable={false} 
          actionClickEdit={handleOpenModal} 
          actionClickAdd={handleOpenModal} 
          deleteAction={true}
          editAction={true}
          actionDelete={openConfirmationModalForDelete} // Pass delete action to table
          isReverse={true}
        />

        <DynamicModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleFucntion={handleCouponUpdate}
          inputFields={dynamicInputFields} // Pass dynamic input fields
          modalTitle={isEditing ? "Edit Coupon" : "Add New Coupon"} // Dynamic title
          buttonText={isEditing ? "Update" : "Add"} // Dynamic button text
        />

        {/* Confirmation Modal for Delete */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleCouponDelete}
          deleteId={selectedCouponIdToDelete}
        />
      </div>
    </div>
  );
};

export default CouponTablePage;
