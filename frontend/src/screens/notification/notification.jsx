// // src/components/SendNotification.js
// import React, { useState } from 'react';
// import axios from 'axios'

// const SendNotification = () => {
//     const [title, setTitle] = useState('');
//     const [body, setBody] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const tokenResponse = await axios.get(`http://localhost:3000/tokens-all-tokens`)
//         const newToken = tokenResponse.data

//         // You need to set up an endpoint in your Express.js server to handle this
//         const response = await fetch('http://localhost:3000/send-notification', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ title, body, tokens: newToken }),
//         });

//         const data = await response.json();
//         console.log('Notification sent:', data);
//     };

//     return (
//         <div className="container mx-auto p-4 sm:mt-0 mt-16">
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block text-gray-700">Title</label>
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700">Body</label>
//                     <textarea
//                         value={body}
//                         onChange={(e) => setBody(e.target.value)}
//                         className="w-full px-3 py-2 border rounded"
//                         required
//                     ></textarea>
//                 </div>
//                 <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                     Send Notification
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SendNotification;


// src/components/SendNotification.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SendNotification = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tokenResponse = await axios.get(`http://localhost:3000/tokens-all-tokens`);
        const newToken = tokenResponse.data;

        // You need to set up an endpoint in your Express.js server to handle this
        const response = await fetch('http://localhost:3000/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body, tokens: newToken }),
        });

        const data = await response.json();
        console.log('Notification sent:', data);
    };

    return (
        <div className="container mx-auto p-6 flex justify-center items-center min-h-screen bg-gradient-to-r">
            <motion.div
                className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Send Notification</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform-gpu"
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Body</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform-gpu"
                            rows="4"
                            required
                        ></textarea>
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Send Notification
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default SendNotification;
