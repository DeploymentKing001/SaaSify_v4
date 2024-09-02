// src/components/PreDefinedMessages.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Modal from './Modal.jsx'; // Import the Modal component
import TemplateModal from './Modal2.jsx'
import ModifyTemplateModal from './Modal3.jsx'

const PreDefinedMessages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ name: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMessageText, setSelectedMessageText] = useState(''); // State to store the selected message text
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const businessId = useSelector((state) => state.user.id); // Get businessId from Redux store

    const [templateList, setTemplateList] = useState([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const [templateNameToModify, setTemplateNameToModify] = useState('');
    const [templateIdToModify, setTemplateIdToModify] = useState('');


    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`http://localhost:3000/templates/${businessId}`);
                const data = await response.json();
                setTemplateList(data);
                setIsLoadingTemplates(false);
            } catch (error) {
                setFetchError('Failed to fetch templates.');
                setIsLoadingTemplates(false);
            }
        };

        if (businessId) {
            fetchTemplates();
        }
    }, [businessId]);

    const handleViewTemplateText = (template) => {
        setCurrentTemplate(template);
        setIsTemplateModalOpen(true);
    };

    const handleOpenModifyModal = (template) => {
        setTemplateNameToModify(template.templateName || '');
        setTemplateIdToModify(template._id);
        setIsModifyModalOpen(true);
    };

    const handleCloseTemplateModal = () => {
        setIsTemplateModalOpen(false);
        setCurrentTemplate(null);
    };

    const handleCloseModifyModal = () => {
        setIsModifyModalOpen(false);
        setTemplateNameToModify('');
        setTemplateIdToModify('');
    };

    const handleSaveTemplateName = async () => {
        try {
            const response = await fetch(`http://localhost:3000/templates/${templateIdToModify}/update-name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newTemplateName: templateNameToModify }),
            });

            const updatedTemplate = await response.json();
            if (response.ok) {
                setTemplateList((prevTemplates) =>
                    prevTemplates.map((template) =>
                        template._id === updatedTemplate._id ? updatedTemplate : template
                    )
                );
                handleCloseModifyModal();
            } else {
                setFetchError(updatedTemplate.message || 'Failed to update template name');
            }
        } catch (error) {
            setFetchError('Failed to update template name.');
        }
    };


    // Fetch pre-defined messages from the server
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/pre-defined-messages');
                setMessages(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const messageToSend = { ...newMessage, businessId }; // Include businessId
            await axios.post('http://localhost:3000/pre-defined-messages', messageToSend);
            setMessages([...messages, messageToSend]); // Update state with new message
            setNewMessage({ name: '', text: '' }); // Clear form
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        // Ask the user for confirmation before proceeding
        const isConfirmed = window.confirm('Are you sure you want to delete this message?');

        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/pre-defined-messages/${id}`);
                setMessages(messages.filter((message) => message._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Open the modal and set the selected message text
    const handleViewText = (text) => {
        setSelectedMessageText(text);
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMessageText(''); // Clear the text when the modal is closed
    };

    return (
        <div className="container mx-auto p-4 mt-16 sm:mt-0 md:max-w-[80vw]">

            <h2 className="text-3xl font-semibold mb-4">Whatsapp Cloud Templates</h2>

            <div className="overflow-x-auto mb-7">
                <table className="min-w-full">
                    <thead className="bg-[#E8F2E8]">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-s-md">Template Label</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Created At</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Information</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-e-md">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {isLoadingTemplates ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">Loading...</td>
                            </tr>
                        ) : fetchError ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-red-500">Error: {fetchError}</td>
                            </tr>
                        ) : templateList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">No templates found.</td>
                            </tr>
                        ) : (
                            templateList.map((template) => (
                                <tr key={template._id} className="hover:bg-gray-100 transition-all duration-300">
                                    <td className="px-4 py-3 text-sm text-gray-800">{template.templateName || 'No Name'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{template.category || 'No Category'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{new Date(template.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <button
                                            onClick={() => handleViewTemplateText(template)}
                                            className="bg-blue-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-blue-600 transition-all duration-300"
                                        >
                                            Show
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <button
                                            onClick={() => handleOpenModifyModal(template)}
                                            className="bg-red-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-all duration-300"
                                        >
                                            Modify
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {currentTemplate && (
                    <TemplateModal
                        isOpen={isTemplateModalOpen}
                        onClose={handleCloseTemplateModal}
                        text={currentTemplate.components.map(c => c.text).join('\n')}
                    />
                )}

                {isModifyModalOpen && (
                    <ModifyTemplateModal
                        isOpen={isModifyModalOpen}
                        onClose={handleCloseModifyModal}
                        currentName={templateNameToModify}
                        onSave={handleSaveTemplateName}
                        onNameChange={(e) => setTemplateNameToModify(e.target.value)}
                    />
                )}
            </div>

            <h2 className="text-3xl font-semibold mb-4">Pre-Defined Messages</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-[#E8F2E8]">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-s-md">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Text</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Created At</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Information</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-e-md">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-red-500">Error: {error}</td>
                            </tr>
                        ) : messages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">No messages found.</td>
                            </tr>
                        ) : (
                            messages.map((message) => (
                                <tr key={message._id} className="hover:bg-gray-100 transition-all duration-300">
                                    <td className="px-4 py-3 text-sm text-gray-800">{message.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 truncate max-w-xs">{message.text}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{new Date(message.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <button
                                            onClick={() => handleViewText(message.text)}
                                            className="bg-blue-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-blue-600 transition-all duration-300"
                                        >
                                            Show
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <button
                                            onClick={() => handleDelete(message._id)}
                                            className="bg-red-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-all duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                text={selectedMessageText}
            />

            <div className='w-full h-[0.5px] bg-slate-200'></div>

            <form onSubmit={handleSubmit} className="mt-6">
                <h2 className="text-3xl font-semibold mb-4">Create New Message</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={newMessage.name}
                        onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Text</label>
                    <textarea
                        value={newMessage.text}
                        onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Create Message
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default PreDefinedMessages;
