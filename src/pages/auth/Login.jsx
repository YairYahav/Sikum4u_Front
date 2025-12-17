import React from "react";
import { useState } from "react";

export default function Login({authApi, onSuccess}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = () => {
        const errors = {};
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        
        if (!password) {
            errors.password = "Password is required";
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
            const response = await authApi.login(email, password);
            console.log("Login successful:", response);
            
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
            console.error("Login failed:", error);
            
            let errorMessage = "Login failed. Please check your credentials and try again.";
            
            // Handle different types of errors
            if (error.response) {
                // API returned an error response
                const apiError = error.response.data;
                if (apiError.message) {
                    errorMessage = apiError.message;
                    
                    // Handle specific errors
                    if (apiError.message.includes('Invalid credentials')) {
                        errorMessage = "Invalid email or password. Please try again.";
                    } else if (apiError.message.includes('Too many attempts')) {
                        errorMessage = "Too many login attempts. Please try again in 10 minutes.";
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12">
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

                    <div className="space-y-8">
                        {/* Email Field */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full px-6 py-5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-lg ${
                                    validationErrors.email 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : 'border-gray-200 focus:ring-purple-400'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                                className={`w-full px-6 py-5 bg-gray-50/50 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-lg ${
                                    validationErrors.password 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : 'border-gray-200 focus:ring-purple-400'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            {validationErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <a
                                href="/forgot-password"
                                className="text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`w-full py-5 px-6 text-white font-medium rounded-xl focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-lg text-lg ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <a
                                href="/register"
                                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 hover:underline"
                            >
                                Create one now
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-xs text-gray-400">
                        Secure authentication powered by advanced encryption
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-300">
                        <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
                        <span>•</span>
                        <a href="/terms" className="hover:text-gray-400 transition-colors">Terms</a>
                        <span>•</span>
                        <a href="/help" className="hover:text-gray-400 transition-colors">Help</a>
                    </div>
                </div>
            </div>
        </div>
    );
}