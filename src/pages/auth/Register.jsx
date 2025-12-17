import React from "react";
import { useState } from "react";

export default function Register({authApi, onSuccess}){
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Validation regexes
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    
    const validateForm = () => {
        const errors = {};
        
        if (!firstName.trim()) {
            errors.firstName = "First name is required";
        } else if (firstName.length > 50) {
            errors.firstName = "First name must be 50 characters or less";
        }
        
        if (!lastName.trim()) {
            errors.lastName = "Last name is required";
        } else if (lastName.length > 50) {
            errors.lastName = "Last name must be 50 characters or less";
        }
        
        if (!username.trim()) {
            errors.username = "Username is required";
        } else if (!usernameRegex.test(username)) {
            errors.username = "Username must be 3-50 characters, letters, numbers, and underscores only";
        }
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        
        if (!password) {
            errors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            errors.password = "Password must be at least 8 characters with at least 1 letter and 1 number";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setError("");
        setValidationErrors({}); // Clear any previous validation errors
        
        try {
            const response = await authApi.register(username, firstName, lastName, email, password);
            console.log("Registration successful:", response);
            
            // Store token if provided
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            
            // Redirect to home or call success callback
            if (onSuccess) {
                onSuccess();
            } else {
                // Fallback redirect
                window.location.href = '/';
            }
            
        } catch (error) {
            console.error("Registration failed:", error);
            
            let errorMessage = "Registration failed. Please try again.";
            
            // Handle different types of errors
            if (error.response) {
                // API returned an error response
                const apiError = error.response.data;
                if (apiError.message) {
                    errorMessage = apiError.message;
                    
                    // Handle specific field errors
                    if (apiError.message.includes('email already exists')) {
                        setValidationErrors({email: 'This email is already registered'});
                    } else if (apiError.message.includes('username already exists')) {
                        setValidationErrors({username: 'This username is already taken'});
                    }
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Join us and unlock the future
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Name Fields Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                        validationErrors.firstName 
                                            ? 'border-red-300 focus:ring-red-400' 
                                            : 'border-gray-200 focus:ring-blue-400'
                                    }`}
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                {validationErrors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                        validationErrors.lastName 
                                            ? 'border-red-300 focus:ring-red-400' 
                                            : 'border-gray-200 focus:ring-blue-400'
                                    }`}
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                {validationErrors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                    validationErrors.username 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : 'border-gray-200 focus:ring-blue-400'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            {validationErrors.username && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                    validationErrors.email 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : 'border-gray-200 focus:ring-blue-400'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            {validationErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                                    validationErrors.password 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : 'border-gray-200 focus:ring-blue-400'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            {validationErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`w-full py-3 px-4 text-white font-medium rounded-xl focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <a
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}