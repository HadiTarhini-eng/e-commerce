import React, { useState, useEffect } from 'react';
import InputField from '../InputField';

const DynamicModal = ({ isOpen, closeModal, handleFucntion, inputFields, modalTitle, buttonText, disabled = false, fromOrders }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  
  useEffect(() => {
    if (isOpen) {
      // Reset the formData and imagePreview when the modal is opened
      const initialData = {};
      inputFields.forEach((field) => {
        initialData[field.id] = field.value || '';
      });
      setFormData(initialData);
      setImagePreview(null); // Reset the image preview
    }
  }, [isOpen, inputFields]);

  const handleChange = (e, id, type) => {
    if (type === 'file') {
      handleFileChange(e, id);
    } else {
      const { value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  // Handle file input changes separately
  const handleFileChange = (e, id) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileName = file.name;  // Get the file name
      setFormData((prevData) => ({
        ...prevData,
        [id]: file,  // Save the file to state
      }));
      // Set image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFucntion(formData);
  };

  const handleClose = () => {
    setFormData({});  // Reset the form data
    setImagePreview(null);  // Reset the image preview
    closeModal();  // Close the modal
  };

  return isOpen ? (
    <div id="crud-modal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow w-full max-w-md p-5">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">{modalTitle}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900"
            onClick={handleClose} // Use handleClose to reset the state and close the modal
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {inputFields.map((field) => (
            <InputField
              key={field.id}
              type={field.type}
              title={field.title}
              placeholder={field.placeholder}
              id={field.id}
              name={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id, field.type)}
              options={field.options}
              required={field.required}
              disabled={field.disabled}
              fromOrders={fromOrders}
            />
          ))}

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="File preview"
                className="max-w-[200px] h-auto rounded"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-palette-button text-white py-2 rounded"
            disabled={disabled} // Disable submit button when modal is disabled
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default DynamicModal;
