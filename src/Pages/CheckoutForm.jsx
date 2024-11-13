import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast'; // Import toast and Toaster

export default function CheckoutForm() {
  const navigate = useNavigate(); // Initialize navigate function
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);  // Add loading state for skeleton

  const [formData, setFormData] = useState({
    username: '',
    about: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // New phone number field
    country: 'United States',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    comments: false,
    candidates: false,
    offers: false,
    pushNotifications: 'push-everything',
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show loading skeleton while processing
    setLoading(true);

    // Custom validations
    const errors = [];

    // Name validation: should not include numbers
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(formData.firstName)) {
      errors.push('First name should not include numbers.');
    }
    if (!namePattern.test(formData.lastName)) {
      errors.push('Last name should not include numbers.');
    }

    // City and Region validation: should not include numbers
    if (!namePattern.test(formData.city)) {
      errors.push('City should not include numbers.');
    }
    if (!namePattern.test(formData.region)) {
      errors.push('State/Province should not include numbers.');
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }

    // Phone number validation (US format: e.g., (123) 456-7890)
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phonePattern.test(formData.phone)) {
      errors.push('Please enter a valid phone number (e.g., (123) 456-7890).');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      setLoading(false);  // Hide skeleton if there's an error
    } else {
      console.log('Form Data:', formData);
      // Store data (e.g., send it to an API or local storage)
    }

    toast.success('Order Sent!'); // Show toast notification
    setClicked(true);

    // Reset animation after a short delay (the duration of the animation)
    setTimeout(() => setClicked(false), 1000); // Animation lasts 1000ms
    setTimeout(() => navigate('/'), 1000); // Navigate to home after animation

    // Scroll to the top of the page
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    navigate('/cart'); // Redirect to the cart page
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center w-full mt-20">
      <div className="space-y-12">
        {/* Personal Information */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive the order.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="grid grid-cols-2 gap-x-2">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  {loading ? (
                    <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                  ) : (
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      pattern="[A-Za-z\s]+"
                      title="First name should not contain numbers"
                    />
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  {loading ? (
                    <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                  ) : (
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      pattern="[A-Za-z\s]+"
                      title="Last name should not contain numbers"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                {loading ? (
                  <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                ) : (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address"
                  />
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                Phone number
              </label>
              <div className="mt-2">
                {loading ? (
                  <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                ) : (
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="(123) 456-7890"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    title="Please enter a valid phone number (e.g., (123) 456-7890)"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2">
              {/* City */}
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-900">
                  City
                </label>
                <div className="mt-2">
                  {loading ? (
                    <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                  ) : (
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      pattern="[A-Za-z\s]+"
                      title="City should not contain numbers"
                    />
                  )}
                </div>
              </div>

              {/* State */}
              <div className="sm:col-span-2">
                <label htmlFor="region" className="block text-sm font-medium text-gray-900">
                  State / Province
                </label>
                <div className="mt-2">
                  {loading ? (
                    <div className="h-10 bg-gray-300 animate-pulse rounded-md w-full"></div> // Skeleton loader
                  ) : (
                    <input
                      id="region"
                      name="region"
                      type="text"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      pattern="[A-Za-z\s]+"
                      title="State/Province should not contain numbers"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save and Cancel buttons */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button onClick={handleCancel} type="button" className="text-sm font-semibold text-gray-900">
            Cancel
          </button>
          <button
            className={`relative inline-flex items-center justify-center w-fit p-3 font-bold h-8 bg-blue-500 text-white rounded-md transition duration-300 ease-out ${clicked ? 'animate-click' : ''}`}
          >
            {/* Animation background span */}
            <span
              className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 rounded-md transform ${clicked ? 'bg-green-500 translate-x-0' : 'display-none'}`}
            >
              {/* Checkmark icon that appears when clicked */}
              {clicked && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            
            {/* Default content of the button */}
            <span
              className={`relative z-10 transition-all duration-300 ease ${clicked ? 'opacity-0' : 'opacity-100'}`}
            >
              Submit
            </span>
          </button>
        </div>
        </div>
      </form>
    );
}
