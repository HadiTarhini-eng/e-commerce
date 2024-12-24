import React, { useState, useEffect } from 'react';
import InputField from '../InputField';

const DynamicModal = ({ isOpen, closeModal, handleFucntion, inputFields, modalTitle, buttonText }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    inputFields.forEach((field) => {
      initialData[field.id] = field.value || '';
    });
    setFormData(initialData);
  }, [inputFields]);

  const handleChange = (e, id, type) => {
    if (type === 'file') {
      handleFileChange(e, id);
    } else {
      const { value } = e.target;
      console.log(id)
      console.log(`Changing to ${value}`);  // Log input changes
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
      console.log(`File selected: ${fileName}`);
      setFormData((prevData) => ({
        ...prevData,
        [id]: `/${fileName}`,  // Save the file path to state
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFucntion(formData);
  };

  return isOpen ? (
    <div id="crud-modal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow w-full max-w-md p-5">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">{modalTitle}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900"
            onClick={closeModal}
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
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default DynamicModal;
