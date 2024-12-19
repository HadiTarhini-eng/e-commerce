import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckoutData } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { fetchDeliveryMethods, fetchFormFields, fetchPaymentMethods } from '../../api/clientApi';
import InputField from '../../components/InputField';

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const totalWithoutDelivery = parseInt(useSelector(state => state.cart.checkoutData.totalWithoutDelivery), 10);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    city: '',
    address: '',
    paymentMethod: '',
    deliveryMethod: '',
    sendAsGift: false,
    noteForDriver: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [formFields, setFormFields] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formFieldsData, paymentMethodsData, deliveryMethodsData] = await Promise.all([
          fetchFormFields(),
          fetchPaymentMethods(),
          fetchDeliveryMethods(),
        ]);

        setFormFields(formFieldsData.fields);
        setPaymentMethods(paymentMethodsData.paymentMethods);
        setDeliveryMethods(deliveryMethodsData.deliveryMethods);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target || e; // Added fallback in case e.target is undefined
  
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  
    // Dispatch to Redux store
    dispatch(updateCheckoutData({ field: id, value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;

    // Update formData state to reflect the selected radio button
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,  // Set the formData's paymentMethod or deliveryMethod value
    }));
    
    // Find the method by matching the value
    const selectedMethod = (name === 'paymentMethod' ? paymentMethods : deliveryMethods).find(
      (method) => method.value === value
    );

    // Dispatch both the id, label, and delivery price (without the "$" sign) for deliveryMethod
    if (name === 'deliveryMethod') {
      const { id, label, deliveryPrice } = selectedMethod;
      dispatch(updateCheckoutData({
        field: name,
        value: { id, label, deliveryPrice: parseFloat(deliveryPrice) }, // Remove '$' and convert to number
      }));

      const totalWithDelivery = totalWithoutDelivery + parseInt(deliveryPrice, 10);  // Add delivery charge
      dispatch(updateCheckoutData({ field: 'totalWithDelivery', value: totalWithDelivery }));
    } else {
      // Dispatch paymentMethod id and label for payment method
      dispatch(updateCheckoutData({
        field: name,
        value: { id: selectedMethod.id, label: selectedMethod.label },
      }));
    }
  };

  const handleGiftCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      sendAsGift: checked,
    }));

    // Dispatch to Redux store
    dispatch(updateCheckoutData({ field: 'sendAsGift', value: checked }));

    if (checked) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast("Please update information of the gift's recipient if needed!", {
        duration: 5000,
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Dispatch the entire formData to Redux store
    for (const field in formData) {
      dispatch(updateCheckoutData({ field, value: formData[field] }));
    }

    // Show success toast
    toast.success('Your order has been successfully submitted!', {
      duration: 3000,
    });

    // Navigate to the /payment page
    navigate('/payment');
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name || /\d/.test(data.name)) {
      errors.name = 'Name cannot be empty or contain numbers';
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!data.phoneNumber || !isPossiblePhoneNumber(data.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    return errors;
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full px-4 2xl:px-0 mb-16 bg-palette-body-3">
      <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
        <div className="min-w-0 flex-1 space-y-8">
          {/* Personal Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {formFields.map((field) => {
                if (field.type === 'select') {
                  return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
                      <select
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        required={field.required}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="" className='text-grey-200'>{field.placeholder}</option>
                        {field.options.map((option, idx) => (
                          <option key={idx} value={option.title}>
                            {option.title}
                          </option>
                        ))}
                      </select>
                      {errors[field.id] && <p className="text-xs text-red-600">{errors[field.id]}</p>}
                    </div>
                  );
                } else if(field.type === 'phoneNumber') {
                  return (
                    <div key={field.id}>
                      <InputField
                        type="phoneNumber"
                        title={field.label}
                        placeholder={'Enter phone number'}
                        id={'phoneNumber'}
                        value={formData.phoneNumber}
                        onChange={(value) => handleChange({ target: { id: 'phoneNumber', value } })}
                        required={field.required}
                      />
                      {errors[field.id] && <p className="text-xs text-red-600">{errors[field.id]}</p>}
                    </div>
                  );
                }
                return (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                    {errors[field.id] && <p className="text-xs text-red-600">{errors[field.id]}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <input
                      id={method.id}
                      type="radio"
                      name="paymentMethod" // This remains 'paymentMethod' to differentiate in handleRadioChange
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleRadioChange}
                      className="h-4 w-4 border-gray-300 bg-white text-primary-600"
                    />
                    <div className="ms-4 text-sm">
                      <label htmlFor={method.id} className="font-medium leading-none text-gray-900 dark:text-white">{method.label}</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Methods</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {deliveryMethods.map((method) => (
                <div key={method.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={method.id}
                        type="radio"
                        name="deliveryMethod" // This remains 'deliveryMethod' to differentiate in handleRadioChange
                        value={method.value}
                        checked={formData.deliveryMethod === method.value}
                        onChange={handleRadioChange}
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600"
                      />
                    </div>
                    <div className="ms-4 text-sm">
                      <label htmlFor={method.id} className="font-medium leading-none text-gray-900 dark:text-white">{method.label}</label>
                      <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note for Driver (conditional) */}
          {(formData.deliveryMethod === 'wakilni' || formData.deliveryMethod === 'pickUp' || formData.deliveryMethod === 'delivery') && (
            <div className="space-y-4">
              <label htmlFor="noteForDriver" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Add Note
              </label>
              <textarea
                id="noteForDriver"
                value={formData.noteForDriver}
                onChange={handleChange}
                placeholder="Please add any instructions."
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                rows="3"
              />
            </div>
          )}

          {/* Send as Gift Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendAsGift"
                checked={formData.sendAsGift}
                onChange={handleGiftCheckboxChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="sendAsGift" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Send as a gift?</label>
            </div>

            {formData.sendAsGift && (
              <p className="text-sm text-red-600 dark:text-gray-400">Please contact us on WhatsApp for more details on the gift!</p>
            )}
          </div>

          <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
