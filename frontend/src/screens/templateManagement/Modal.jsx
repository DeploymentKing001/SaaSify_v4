// src/components/Modal.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Updated for v2

const Modal = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Message Text</h2>
        <div className="overflow-auto max-h-80">
          <p>{text}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
