import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, text }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <pre className="whitespace-pre-wrap">{text}</pre>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
