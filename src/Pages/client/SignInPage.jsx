import React, { useState } from 'react';
import InputField from '../../components/InputField';

const SignIn = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up forms

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add sign-in or sign-up logic here
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-12">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src="../../assets/image/icons/blushe.png" alt="BLUSHE" />
            </a>
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
                        />
                        <InputField
                            type="password"
                            id="password"
                            title="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        {isSignUp && (
                            <InputField
                                type="password"
                                id="confirmPassword"
                                title="Confirm Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        )}
                        <button
                            type="submit"
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            {isSignUp ? 'Sign up' : 'Sign in'}
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            {isSignUp ? (
                                <>
                                    Already have an account?{' '}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsSignUp(false); // Switch to Sign In
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
                                            setIsSignUp(true); // Switch to Sign Up
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
