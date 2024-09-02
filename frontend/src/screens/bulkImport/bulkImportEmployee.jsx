import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [processStatus, setProcessStatus] = useState(false);
  const [importName, setImportName] = useState('');
  const businessId = useSelector((state) => state.user.id);
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [reRender, setReRender] = useState(0)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!importName) {
      alert('Please enter a name before uploading the file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3000/import-bulk-contacts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setContactNumbers(response.data.contactNumbers);
      setProcessStatus(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const saveData = async () => {
    try {
      await axios.post('http://localhost:3000/api/save-bulk-import/businesses', {
        name: importName,
        businessId,
        contactNumbers
      });

      // Reset all states to their default values
      setFile(null);
      setContactNumbers([]);
      setProcessStatus(false);
      setImportName('');
      setIsLoading(false)
      setReRender((prevReRender) => { prevReRender + 1 })

      alert('Contact saved successfully!');
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business.');
    }
  };

  useEffect(() => {
    if (processStatus && contactNumbers.length > 0) {
      saveData();
    }
  }, [processStatus, contactNumbers]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/data-bulk-import/${businessId}`);
        setBusinesses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [businessId, reRender]);

  const handleViewContacts = (business) => {
    setSelectedBusiness(business);
  };

  const handleDeleteBusiness = async (businessId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this business?');

    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:3000/bulk-data-delete/${businessId}`);
      setReRender((prevReRender) => prevReRender + 1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error deleting business: ', errorMessage);
    }
  };


  return (
    <div className='flex flex-col items-start gap-y-6 px-4 py-6 w-full max-w-screen sm:mt-0 mt-16 md:max-w-[80vw]'>
      <div className="w-full mb-1">
        <h2 className="text-2xl font-semibold mb-4">Businesses</h2>
        {businesses.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#E8F2E8]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider rounded-s-md">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider">Business ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider">Total Numbers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider rounded-e-md">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {businesses.map((business) => (
                  <tr key={business._id} className='hover:bg-gray-100 transition-all duration-300'>
                    <td className='px-4 py-3 text-sm text-gray-800'>{business.name}</td>
                    <td className='px-4 py-3 text-sm text-gray-800'>{business.businessId}</td>
                    <td className='px-4 py-3 text-sm text-gray-800'>{business.contactNumbers.length}</td>
                    <td className='px-4 py-3'>
                      <button
                        className='bg-blue-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-blue-600 transition-all duration-300'
                        onClick={() => handleViewContacts(business)}
                      >
                        View Contacts
                      </button>
                    </td>
                    <td className='px-4 py-3'>
                      <button
                        className='bg-red-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-all duration-300'
                        onClick={() => handleDeleteBusiness(business.businessId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No businesses available.</p>
        )}

        {/* Modal for Viewing Contacts */}
        {selectedBusiness && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-3">
            <div className="bg-gray-200 p-6 rounded-lg shadow-md max-w-lg w-full h-auto overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">{selectedBusiness.name}</h2>
              <p className="text-gray-600 mb-4">Created At: {new Date(selectedBusiness.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-2">Total Numbers: {selectedBusiness.contactNumbers.length}</p>
              <div className="h-64 overflow-y-scroll">
                <ul className="list-disc pl-5">
                  {selectedBusiness.contactNumbers.map((number, index) => (
                    <li key={index} className="text-gray-600">{number}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-semibold mb-6">Upload Excel File</h1>
        <div className="mb-6">
          <label htmlFor="importName" className="block text-sm font-medium text-gray-700">Import Name</label>
          <input
            id="importName"
            type="text"
            value={importName}
            onChange={(e) => setImportName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter a name for this import"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleFileUpload}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
        >
          Upload
        </button>

        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );

};

export default BulkImport;
