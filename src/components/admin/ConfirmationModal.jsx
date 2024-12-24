import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, clientId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow w-full max-w-md p-5">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900"
            onClick={onClose}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mt-4 text-center">
          <p>Are you sure you want to delete the user with ID: "{clientId}"?</p>
          <div className="flex justify-between space-x-4">
            <button
              className="w-full bg-gray-300 text-black py-2 rounded"
              onClick={onClose}
            >
              No
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 rounded"
              onClick={() => onConfirm(clientId)}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
