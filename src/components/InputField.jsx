import React, { useState } from 'react';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const InputField = ({
  type,
  title,
  placeholder,
  id,
  value,
  onChange,
  required = false,
  options = [],
  rows,
  disabled = false, // Added disabled prop
}) => {
  // State to toggle password visibility and for search functionality
  const [showPassword, setShowPassword] = useState(false);

  // Handle different input types
  switch (type) {
    case 'text':
    case 'number':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled} // Disable input when disabled is true
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );

    case 'password':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled} // Disable input when disabled is true
              className="w-full px-3 py-2 border rounded"
            />
            {/* Toggle password visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-300"
              disabled={disabled} // Disable the button when input is disabled
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      );

    case 'phoneNumber':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium mb-1">
            {title}
          </label>
          <PhoneInput
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled} // Disable PhoneInput when disabled is true
            className="w-full px-3 py-2 border rounded bg-white"
          />
          {/* Phone number validation */}
          {value && !isPossiblePhoneNumber(value) && (
            <p className="text-xs text-red-600">Invalid phone number</p>
          )}
          {value && isPossiblePhoneNumber(value) && (
            <>
              <p className="text-xs text-green-600">Valid phone number</p>
              <p className="text-xs text-gray-600">National: {formatPhoneNumber(value)}</p>
              <p className="text-xs text-gray-600">International: {formatPhoneNumberIntl(value)}</p>
            </>
          )}
        </div>
      );

    case 'select':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <div className="relative">
            <select
              id={id}
              value={value} // Controls the currently selected value
              onChange={onChange}
              required={required}
              disabled={disabled} // Disable select input when disabled is true
              className="w-fit px-3 py-2 border rounded"
              style={{ width: 'fit-content' }}
            >
              {/* Placeholder option */}
              <option value="" disabled>
                {placeholder}
              </option>
              {/* Map options */}
              {Array.isArray(options) && options.length > 0 ? (
                options.map((option, idx) => (
                  <option key={idx} value={option.status}>
                    {option.status}
                  </option>
                ))
              ) : (
                <option disabled>No options available</option>
              )}
            </select>
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            disabled={disabled} // Disable textarea when disabled is true
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );

    case 'file':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <input
            type="file"
            id={id}
            onChange={onChange}
            required={required}
            disabled={disabled} // Disable file input when disabled is true
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );

    default:
      return null;
  }
};

export default InputField;
