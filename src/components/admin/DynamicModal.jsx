import React, { useState, useEffect } from 'react';
import InputField from './InputField';

const DynamicModal = ({ isOpen, closeModal, onProductAdd, inputFields, modalTitle, buttonText }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    inputFields.forEach((field) => {
      initialData[field.id] = field.value || '';
    });
    setFormData(initialData);
  }, [inputFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const newProductId = getNextId();

    // Prepare the new product data for submission
    const newProduct = {
      title: 'Product',
      image: `/src/assets/image/products/${formData.name}`,
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price, 10),
      discount: 'No Discount',
      discountAmount: null,
    };

    onProductAdd(newProduct);
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
              onChange={handleChange}
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