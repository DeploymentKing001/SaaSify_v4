import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './broasdCast.css'
import { fetchBusinessAccount } from '../../redux/sideBar/accountInfoSlice';

const broadCast = () => {
  const businessId = useSelector((state) => state.user.id);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedImports, setSelectedImports] = useState([])
  const [templateNames, setTemplateNames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user);
  const { data, loading, errorNew } = useSelector((state) => state.businessAccount);
  const [phoneNumberIndo, setPhoneNumberIndo] = useState([])
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/data-bulk-import/${businessId}`);
        setBusinesses(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/names-templates/${businessId}`);
        setTemplateNames(response.data);
      } catch (error) {
        console.error('Error fetching template names:', error);
      }
    };

    if (businessId) {
      fetchTemplates();
      fetchBusinesses();
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinessAccount(businessId));

      const fetchPhoneInfo = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/whatsapp-config/${businessId}`);
          setPhoneNumberIndo(response.data)
        } catch (err) {
          console.log(err)
        }
      }
      fetchPhoneInfo()
    }
  }, [businessId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewContacts = (business) => {
    setSelectedBusiness(business);
  };

  const handleImportAdd = async (id) => {
    if (!selectedImports.includes(id)) {
      setSelectedImports([...selectedImports, id])
    }
  };

  const handleDeleteImport = async (id) => {
    setSelectedImports(selectedImports.filter(item => item !== id));
  }

  function transformData(template, parameters) {
    // Define the mapping of component types to payload types
    const typeMapping = {
      'HEADER': 'header',
      'BODY': 'body',
    };

    // Initialize the result array
    const result = [];

    // Iterate over the components in the template
    for (const component of template.components) {
      // Map the type of the component
      const payloadType = typeMapping[component.type];
      if (!payloadType) continue;

      // Prepare the parameters for this component
      const componentParameters = [];

      if (component.type === 'BODY') {
        // For BODY type, map parameters from the given data
        for (const paramSet of parameters) {
          const componentParams = [];
          component.parameters.forEach(param => {
            if (paramSet[param.name]) {
              componentParams.push({
                type: 'text',
                text: paramSet[param.name]
              });
            }
          });
          if (componentParams.length) {
            componentParameters.push(...componentParams);
          }
        }
      }

      // Add the component to the result
      result.push({
        type: payloadType,
        parameters: componentParameters
      });
    }

    return result;
  }

  // const sendTemplateMessage = async (template, parameters = {}) => {
  //   const newPayload = transformData(template, parameters);
  //   const selectedSet = new Set(selectedImports);
  //   const matchedBusinesses = businesses.filter(element => selectedSet.has(element._id));

  //   setisLoading(true)

  //   matchedBusinesses.forEach(element => {
  //     element.contactNumbers.forEach(number => {
  //       // API request payload
  //       const payload = {
  //         messaging_product: "whatsapp",
  //         to: number, // Update with actual recipient phone number
  //         type: "template",
  //         template: {
  //           name: template.name, // Use the required template name
  //           language: { code: "en_US" }, // Ensure language code matches your requirements
  //           components: newPayload
  //         }
  //       };

  //       const sendIt = async (number) => {
  //         try {
  //           const response = await axios.post('http://localhost:3000/direct-template-send-message', {
  //             recipientPhoneNumber: number,
  //             senderId: user?.name,
  //             designation: user?.designation,
  //             businessId: data._id,
  //             phon_no: phoneNumberIndo.phon_no,
  //             phon_no_id: phoneNumberIndo.phon_no_id,
  //             token: data.longToken,
  //             templateName: template.name,
  //             payload: payload,
  //           });

  //           console.log(response.data)
  //         } catch (error) {
  //           console.error('Error sending message:', error.response?.data || error.message);
  //         }
  //       };
  //       sendIt(number)
  //     });
  //   });

  //   return setisLoading(false)
  // }

  const sendTemplateMessage = async (template, parameters = {}) => {
    const newPayload = transformData(template, parameters);
    const selectedSet = new Set(selectedImports);
    const matchedBusinesses = businesses.filter(element => selectedSet.has(element._id));

    setisLoading(true);

    // Collect all the promises
    const promises = [];

    matchedBusinesses.forEach(element => {
      element.contactNumbers.forEach(number => {
        // API request payload
        const payload = {
          messaging_product: "whatsapp",
          to: number, // Update with actual recipient phone number
          type: "template",
          template: {
            name: template.name, // Use the required template name
            language: { code: "en_US" }, // Ensure language code matches your requirements
            components: newPayload
          }
        };

        const sendIt = async (number) => {
          try {
            const response = await axios.post('http://localhost:3000/direct-template-send-message', {
              recipientPhoneNumber: number,
              senderId: user?.name,
              designation: user?.designation,
              businessId: data._id,
              phon_no: phoneNumberIndo.phon_no,
              phon_no_id: phoneNumberIndo.phon_no_id,
              token: data.longToken,
              templateName: template.name,
              payload: payload,
            });

            console.log(response.data);
          } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
          }
        };

        // Add each sendIt call to the promises array
        promises.push(sendIt(number));
      });
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    setisLoading(false);
  };

  useEffect(() => {
    console.log(user, data)
  }, [user, data])


  const handleTemplateClick = async (name) => {
    setShowDropdown(false); // Close the dropdown

    try {
      const response = await axios.get(`http://localhost:3000/template-details`, {
        params: { name, accountId: businessId } // Adjust accountId if needed
      });

      const template = response.data;
      let params = [];

      template.components.forEach(element => {
        if (element.parameters && element.parameters.length > 0) {
          // Create an object to hold user input for parameters
          let newParameters = {};

          // Prompt the user to enter values for each parameter
          element.parameters.forEach(param => {
            const value = prompt(`Enter value for ${param.name}:`);
            if (value !== null && value.trim() !== '') {
              newParameters[param.name] = value.trim();
            } else {
              console.warn(`No value entered for ${param.name}.`);
            }
          });
          params.push(newParameters)
        }
      });
      sendTemplateMessage(template, params);

    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };


  return (
    <div className='sm:mt-0 mt-16 flex flex-col md:max-w-[80vw] w-full max-w-screen p-4'>
      <div className="w-full mb-1">
        <h2 className="text-2xl font-semibold mb-4">Imports</h2>
        {businesses.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#E8F2E8]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider rounded-s-md">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider">Total Numbers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[150px] tracking-wider rounded-e-md">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {businesses.map((business) => (
                  <tr key={business._id} className='hover:bg-gray-100 transition-all duration-300'>
                    <td className='px-4 py-3 text-sm text-gray-800'>{business.name}</td>
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
                      {!selectedImports.includes(business._id) ? <button
                        className='bg-green-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-green-600 transition-all duration-300' onClick={() => handleImportAdd(business._id)} >Add</button>
                        :
                        <button className='bg-green-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-green-600 transition-all duration-300' onClick={() => handleDeleteImport(business._id)}>Remove</button>}
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
          <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center p-3">
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
      <div className='w-full bg-white shadow-lg rounded-lg p-4 flex items-center justify-between '>
        <h2 className='text-xl sm:text-2xl font-semibold mt-6 mb-4 text-gray-800'>Send Messages</h2>
        <div className="relative inline-block text-left text-xs">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Templates
          </button>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
            >
              <ul className="py-2">
                {templateNames.length > 0 ? (
                  templateNames.map((name, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors"
                      onClick={() => handleTemplateClick(name)}
                    >
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-600">No templates available</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isLoading && <div className='w-full flex justify-center mt-11'>

        <div role="status">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>

      </div>}

    </div>
  )
}

export default broadCast
