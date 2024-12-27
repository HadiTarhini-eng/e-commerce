import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckoutData } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { fetchVisaCardStatus, fetchDeliveryMethods, fetchFormFields, fetchPaymentMethods, fetchDeliveryThreshold, fetchUserDetails } from '../../api/clientApi';
import InputField from '../../components/InputField';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../../components/client/AuthContext';
import VisaCardForm from '../../components/client/VisaCardForm';

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [activeVisaCard, setActiveVisaCard] = useState(false);
  const totalWithoutDelivery = parseFloat(useSelector(state => state.cart.checkoutData.totalWithoutDelivery), 10);
  const { userId } = useAuth();

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
    visaFullName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [formFields, setFormFields] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [deliveryThreshold, setDeliveryThreshold] = useState([]);
  const [freeDelivery, setIsDeliveryOffer] = useState([]);
  const [userDetailsData, setUserDetailsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          formFieldsData,
          paymentMethodsData,
          deliveryMethodsData,
          deliveryThresholdData,
          userDetails,
          visaCardsStatus,
        ] = await Promise.all([
          fetchFormFields(),
          fetchPaymentMethods(),
          fetchDeliveryMethods(),
          fetchDeliveryThreshold(),
          fetchUserDetails(userId),
          fetchVisaCardStatus(),
        ]);

        setFormFields(formFieldsData.fields);
        setPaymentMethods(paymentMethodsData.paymentMethods);
        setDeliveryMethods(deliveryMethodsData.deliveryMethods);
        setDeliveryThreshold(deliveryThresholdData.deliveryThreshold);
        setIsDeliveryOffer(deliveryThresholdData.freeDelivery);
        setActiveVisaCard(visaCardsStatus);

        // Set user details data
        setUserDetailsData(userDetails);

        // Update formData based on userDetails
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: userDetails.name || prevFormData.name,
          email: userDetails.email || prevFormData.email,
          phoneNumber: userDetails.phoneNumber || prevFormData.phoneNumber,
          city: userDetails.city || prevFormData.city,
          address: userDetails.address || prevFormData.address,
        }));
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

  const handleVisaInput = (formVisaData) => {
    setFormData((prevState) => ({
      ...prevState,
      visaFullName: formVisaData.visaFullName,
      cardNumber: formVisaData.cardNumber,
      expiration: formVisaData.expiration,
      cvv: formVisaData.cvv,
    }));
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
  
    // Update formData state to reflect the selected radio button
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Set the formData's paymentMethod or deliveryMethod value
    }));
  
    // Find the method by matching the value
    const selectedMethod = (name === 'paymentMethod' ? paymentMethods : deliveryMethods).find(
      (method) => method.value === value
    );
  
    if (name === 'deliveryMethod') {
      const { id, label, deliveryPrice } = selectedMethod;

      if(freeDelivery) {
        let adjustedDeliveryPrice = totalWithoutDelivery > deliveryThreshold ? 0 : parseFloat(deliveryPrice); // Set delivery price to 0 if totalWithoutDelivery > 75

        // Dispatch the delivery method with the adjusted delivery price
        dispatch(updateCheckoutData({
          field: name,
          value: { id, label, deliveryPrice: adjustedDeliveryPrice },
        }));
    
        const totalWithDelivery = totalWithoutDelivery + adjustedDeliveryPrice;

        // Dispatch the total with delivery
        dispatch(updateCheckoutData({ field: 'totalWithDelivery', value: totalWithDelivery }));
      } else {
        // Dispatch the delivery method with the adjusted delivery price
        dispatch(updateCheckoutData({
          field: name,
          value: { id, label, deliveryPrice: parseFloat(deliveryPrice) },
        }));
    
        const totalWithDelivery = totalWithoutDelivery + parseFloat(deliveryPrice);

        // Dispatch the total with delivery
        dispatch(updateCheckoutData({ field: 'totalWithDelivery', value: totalWithDelivery }));
      }
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
                      <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        required={field.required}
                        list={`${field.id}-options`}
                        placeholder='Enter your City name'
                        className={`block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 ${formData[field.id] ? 'text-black' : 'text-gray-500'}`}
                      />
                      <datalist id={`${field.id}-options`}>
                        {field.options.map((option, idx) => (
                          <option key={idx} value={option.title} />
                        ))}
                      </datalist>
                      {errors[field.id] && <p className="text-xs text-red-600">{errors[field.id]}</p>}
                    </div>
                  );
                } else if(field.type === 'phoneNumber') {
                  return (
                    <div key={field.id}>
                      <InputField
                        type="phoneNumber"
                        title={field.label}
                        placeholder={field.placeholder}
                        id={'phoneNumber'}
                        value={formData.phoneNumber}
                        onChange={(value) => handleChange({ target: { id: 'phoneNumber', value } })}
                        required={field.required}
                        className='bg-white border rounded border-gray-300'
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
              {paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.formId} className="rounded-lg border border-gray-200 bg-white p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <input
                      id={paymentMethod.id}
                      type="radio"
                      name="paymentMethod" // This remains 'paymentMethod' to differentiate in handleRadioChange
                      value={paymentMethod.value}
                      checked={formData.paymentMethod === paymentMethod.value}
                      onChange={handleRadioChange}
                      className="h-4 w-4 border-gray-300 bg-white text-palette-button"
                      required
                    />
                    <div className="ms-4 text-sm">
                      <label className="font-medium leading-none text-gray-900 dark:text-white">{paymentMethod.label}</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISA CARD (OPTIONAL) */}
          {formData.paymentMethod === 'visa-card' && activeVisaCard && <VisaCardForm handleVisaInput={handleVisaInput} />}

          {/* Delivery Methods */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Methods</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {deliveryMethods.map((deliveryMethod) => (
                <div key={deliveryMethod.formId} className="rounded-lg border border-gray-200 bg-white p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={deliveryMethod.id}
                        type="radio"
                        name="deliveryMethod" // This remains 'deliveryMethod' to differentiate in handleRadioChange
                        value={deliveryMethod.value}
                        checked={formData.deliveryMethod === deliveryMethod.value}
                        onChange={handleRadioChange}
                        className="h-4 w-4 border-gray-300 bg-white text-palette-button"
                        required
                      />
                    </div>
                    <div className="ms-4 text-sm">
                      <label className="font-medium leading-none text-gray-900 dark:text-white">{deliveryMethod.label}</label>
                      <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">{deliveryMethod.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note for Driver (conditional) */}
          {(formData.deliveryMethod) && (
            <div className="space-y-4">
              <label htmlFor="noteForDriver" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Add Note
              </label>
              <textarea
                id="noteForDriver"
                value={formData.noteForDriver}
                onChange={handleChange}
                placeholder="Please add any instructions."
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
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
                className="h-4 w-4 text-palette-button focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
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
              className="flex w-full items-center justify-center rounded-lg bg-palette-button px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
