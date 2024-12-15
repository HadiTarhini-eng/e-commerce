import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Importing react-hot-toast for notifications
import { useAuth } from '../../components/client/AuthContext';
import { postSignInData, postSignUpData } from '../../api/clientApi';

const SignIn = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Sign In
  const [error, setError] = useState(null); // State to store error messages
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  }); // State to manage input errors
  const { isLoggedIn, login } = useAuth(); // Login function from context to set user as logged in
  const navigate = useNavigate();

  // Validate form for sign-up and sign-in (only credentials match for sign-in)
  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (isSignUp && !fullName) errors.fullName = 'Full Name is required';
    if (isSignUp && password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  // Handle Submit for Sign In and Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    const validationErrors = validateForm();
    setValidationErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    if (isSignUp) {
      // Sign-Up Logic
      const userData = { fullName, email, password };
      try {
        // Post user data to the server (simulated with mock API)
        await postSignUpData(userData);
        toast.success('Account created successfully!');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(false); // Switch to Sign In after successful sign up
      } catch (error) {
        toast.error('Error during sign-up. Please try again.');
      }
    } else {
      // Sign-In Logic
      const credentials = { email, password };
      try {
        const response = await postSignInData(credentials);
  
        if (response === "Sign-in successful") { // Assuming backend returns "true" if credentials are valid
          login({ email }); // You can also return user data if needed
          toast.success('Successfully signed in!');
          navigate('/'); // Redirect to home page after successful sign-in
        } else {
          setError('Invalid email or password');
          toast.error('Invalid credentials');
        }
      } catch (error) {
        toast.error('Error signing in. Please try again later.');
      }
    }
  };  

  // Handle the toggling of Sign-Up and Sign-In
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError(null); // Reset error when switching forms
  };

  // Dynamic styling for invalid inputs (red borders)
  const getInputClass = (inputType) => {
    return validationErrors[inputType] ? 'border-red-500' : 'border-gray-300';
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-12">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {isSignUp ? 'Sign up for an account' : 'Sign in to your account'}
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <InputField
                type="text"
                id="fullName"
                title="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                error={validationErrors.fullName}
                className={getInputClass('fullName')}
              />
            )}
            <InputField
              type="text"
              id="email"
              title="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              error={validationErrors.email}
              className={getInputClass('email')}
            />
            <InputField
              type="password"
              id="password"
              title="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={validationErrors.password}
              className={getInputClass('password')}
            />
            {isSignUp && (
              <InputField
                type="password"
                id="confirmPassword"
                title="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={validationErrors.confirmPassword}
                className={getInputClass('confirmPassword')}
              />
            )}
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {isSignUp ? 'Sign up' : 'Sign in'}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleForm(); // Switch to Sign In
                    }}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  Don’t have an account yet?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleForm(); // Switch to Sign Up
                    }}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
