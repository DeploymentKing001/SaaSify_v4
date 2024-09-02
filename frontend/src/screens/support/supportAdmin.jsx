import React, { useEffect, useState } from 'react';

const SupportRequests = () => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const fetchSupportRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/all/support');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setSupportRequests(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSupportRequests();
    }, []);

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-4">Error: {error}</div>;

    const handleToggleDetails = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="p-6 max-w-4xl space-y-4 mx-auto" style={{ width: '80vw' }}>
            <h1 className="text-2xl font-bold text-center mb-4">Support Requests</h1>
            {supportRequests.length === 0 ? (
                <p className="text-center">No support requests found.</p>
            ) : (
                <div className="space-y-4">
                    {supportRequests.slice().reverse().map((request, index) => (
                        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-center gap-x-4">
                                    <h2 className="text-lg font-semibold">{request.subject}</h2>
                                    <button
                                        onClick={() => handleToggleDetails(index)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {expandedIndex === index ? 'Hide Details' : 'Show Details'}
                                    </button>
                                </div>
                                <p className="text-gray-500">Email: {request.email}</p>
                                {expandedIndex === index && (
                                    <div className="mt-2">
                                        <p className="text-gray-700">{request.description}</p>
                                        <p className="mt-2 text-gray-500">Business ID: {request.businessId}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportRequests;
