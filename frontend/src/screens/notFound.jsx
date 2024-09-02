// src/screens/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="text-4xl font-bold text-gray-700 mb-4">404 - Page Not Found</div>
            <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</p>
            <button
                className="bg-[#4CAF4F] hover:bg-green-900 text-white px-6 py-2 rounded-lg"
                onClick={() => navigate('/')}
            >
                Go Back to Home
            </button>
        </div>
    );
};

export default NotFound;
