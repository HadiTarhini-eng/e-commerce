import React, { useState, useEffect } from 'react';

const VisaCardForm = ({ handleVisaInput }) => {
  const [formVisaData, setFormVisaData] = useState({
    visaFullName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = useState({
    visaFullName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  // Validate the card number: Visa cards start with 4 and are 13-19 digits long
  const validateCardNumber = (cardNumber) => {
    const regex = /^4\d{12,18}$/; // Visa card starting with 4 and length between 13 and 19 digits
    return regex.test(cardNumber);
  };

  // Validate the expiration date (MM/YY)
  const validateExpiration = (expiration) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    const currentDate = new Date();
    const [month, year] = expiration.split('/');
    const expirationDate = new Date(`20${year}`, month - 1);

    if (!regex.test(expiration)) return false; // Check if the format is valid
    return expirationDate > currentDate; // Ensure expiration date is not in the past
  };

  // Validate CVV: exactly 3 digits
  const validateCvv = (cvv) => {
    return /^[0-9]{3}$/.test(cvv); // CVV is 3 digits
  };

  // Handle input changes and validation
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormVisaData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle validation when an input field loses focus (onBlur event)
  const handleBlur = (e) => {
    const { id, value } = e.target;

    let errorMessage = '';

    if (id === 'visaFullName' && value.trim() === '') {
      errorMessage = 'Full name is required.';
    } else if (id === 'cardNumber' && !validateCardNumber(value)) {
      errorMessage = 'Please enter a valid Visa card number (13-19 digits starting with 4).';
    } else if (id === 'expiration' && !validateExpiration(value)) {
      errorMessage = 'Please enter a valid expiration date (MM/YY), and make sure it’s not expired.';
    } else if (id === 'cvv' && !validateCvv(value)) {
      errorMessage = 'CVV must be exactly 3 digits.';
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: errorMessage,
    }));
  };

  // Handle real-time validation and update the parent component
  useEffect(() => {
    const allFieldsValid = Object.values(formErrors).every((error) => error === '') && 
                           Object.values(formVisaData).every((field) => field !== '');

    if (allFieldsValid) {
      handleVisaInput(formVisaData); // Pass valid data to the parent
    }
  }, [formVisaData, formErrors, handleVisaInput]);

  return (
    <div className="visa-card-form">
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="visaFullName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Full name (as displayed on card)*
            </label>
            <input
              type="text"
              id="visaFullName"
              value={formVisaData.visaFullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full rounded-lg border ${formErrors.visaFullName ? 'border-red-500' : 'border-gray-300'} bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
              placeholder="Full Name"
            />
            {formErrors.visaFullName && <p className="text-sm text-red-500">{formErrors.visaFullName}</p>}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Card number*
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formVisaData.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full rounded-lg border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
            {formErrors.cardNumber && <p className="text-sm text-red-500">{formErrors.cardNumber}</p>}
          </div>

          <div>
            <label htmlFor="expiration" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Card expiration*
            </label>
            <input
              type="text"
              id="expiration"
              value={formVisaData.expiration}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full rounded-lg border ${formErrors.expiration ? 'border-red-500' : 'border-gray-300'} bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
              placeholder="MM/YY"
            />
            {formErrors.expiration && <p className="text-sm text-red-500">{formErrors.expiration}</p>}
          </div>

          <div>
            <label htmlFor="cvv" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
              CVV*
            </label>
            <input
              type="text"
              id="cvv"
              value={formVisaData.cvv}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full rounded-lg border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'} bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
              placeholder="•••"
            />
            {formErrors.cvv && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaCardForm;
