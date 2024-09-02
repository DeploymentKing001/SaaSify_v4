import React from 'react';
import ReactDOM from 'react-dom';

const ModifyTemplateModal = ({ isOpen, onClose, currentName, onSave, onNameChange }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h3 className="text-lg font-medium mb-4">Modify Template Name</h3>
                <input
                    type="text"
                    value={currentName}
                    onChange={onNameChange}
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModifyTemplateModal;
