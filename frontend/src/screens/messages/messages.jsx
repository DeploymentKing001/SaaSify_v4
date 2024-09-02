import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { fetchBusinessAccount } from '../../redux/sideBar/accountInfoSlice';
import './messages.css'
import io from 'socket.io-client';

// import images
import search from '../../assets/images/icons8-search-48.png';
import man2 from '../../assets/images/man2.png';
import read from '../../assets/images/read.png';
import sent from '../../assets/images/sent.png';
import attachment from '../../assets/svgs/attachment.svg';
import send from '../../assets/svgs/send.svg';
import deliver from '../../assets/images/delivered.png';
import pictureImage from '../../assets/images/picture.png'
import videoImage from '../../assets/images/video.png'
import audioImage from '../../assets/images/audio-book.png'
import documentationImage from '../../assets/images/documentation.png'

const socket = io('http://localhost:3000');

const Messages = () => {
  const chatContainerRef = useRef(null);
  const [messageData, setMessageData] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [previousMessages, setPreviousMessages] = useState([])
  const [inputValue, setInputValue] = useState('');
  const businessId = useSelector((state) => state.user.id);
  const user = useSelector((state) => state.user);
  const { data, loading, errorNew } = useSelector((state) => state.businessAccount);
  const dispatch = useDispatch();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [statusCounts, setStatusCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [initateConversation, setinitateConversation] = useState(true)
  const [isYes, setIsYes] = useState(false);
  const [templateRecepient, setTemplateRecepient] = useState('')
  const [phoneNumberIndo, setPhoneNumberIndo] = useState([])
  const [showMessages, setShowMessages] = useState(false)
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedVidoes, setSelectedVidoes] = useState([])
  const [selectedAudio, setSelectedAudio] = useState([])
  const selectedConversationRef = useRef(null);
  const [templateNames, setTemplateNames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [preDefinedTemplates, setPreDefinedTemplates] = useState([]);
  const [showPreDefinedDropDown, setShowPreDefinedDropDown] = useState(false);
  const preDefinedDropDown = useRef(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/names-templates/${businessId}`);
        setTemplateNames(response.data);
      } catch (error) {
        console.error('Error fetching template names:', error);
      }

      try {
        const response = await axios.get(`http://localhost:3000/pre-defined-messages/${businessId}`);
        setPreDefinedTemplates(response.data);
      } catch (error) {
        console.error('Error fetching preDefined template names:', error);
      }
    };
    if (businessId) {
      fetchTemplates();
    }
  }, [businessId]);

  useEffect(() => {
    const handleClickOutsidePreDefinde = (event) => {
      if (preDefinedDropDown.current && !preDefinedDropDown.current.contains(event.target)) {
        setShowPreDefinedDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsidePreDefinde);
    return () => document.removeEventListener('mousedown', handleClickOutsidePreDefinde);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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

  const sendTemplateMessage = async (template, parameters = {}) => {

    const newPayload = transformData(template, parameters);

    // API request payload
    const payload = {
      messaging_product: "whatsapp",
      to: selectedConversation.participants, // Update with actual recipient phone number
      type: "template",
      template: {
        name: template.name, // Use the required template name
        language: { code: "en_US" }, // Ensure language code matches your requirements
        components: newPayload
      }
    };

    try {
      const response = await axios.post('http://localhost:3000/direct-template-send-message', {
        recipientPhoneNumber: selectedConversation.participants,
        senderId: user?.name,
        designation: user?.designation,
        businessId: data._id,
        phon_no: phoneNumberIndo.phon_no,
        phon_no_id: phoneNumberIndo.phon_no_id,
        token: data.longToken,
        templateName: template.name,
        payload: payload,
      });

      console.log(response.data)
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  const handleTemplateClickPreDefined = (name) => {
    setShowPreDefinedDropDown(false)
    preDefinedTemplates.forEach(element => {
      if (element.name == name) {
        setInputValue(element.text)
      }
    });
  }

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
      console.log('NwqParams', params)
      sendTemplateMessage(template, params);

    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };

  const handleToggle = () => {
    setIsYes(!isYes);
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

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
    const handleMessage = (data) => {
      let number = null;
      let receivedId = null;

      dispatch(fetchBusinessAccount(businessId))

      number = data.to;
      receivedId = data.id;

      // Use the ref value for the selected conversation
      const currentConversation = selectedConversationRef.current;

      if (currentConversation) {
        if (number && currentConversation._id === receivedId) {
          loadMessages(number);
          setLoadingMessages(false);
          updateStatus(currentConversation._id, currentConversation.participants)
        }
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket]);


  useEffect(() => {
    if (chatContainerRef.current && selectedConversation) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load the first 50 conversations on mount
  useEffect(() => {
    const loadInitialConversations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/conversations?businessId=${data._id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setMessageData(data);
          }
        } else {
          console.error('Error fetching initial conversations: ', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching initial conversations:', err);
      }
    };
    if (data?._id) {
      loadInitialConversations();
    }
  }, [data]);

  const loadMessages = async (phoneNumber) => {
    setLoadingMessages(true);
    if (!data) { return };

    try {
      const response = await fetch(`http://localhost:3000/messages/${phoneNumber}?businessId=${data._id}`);
      if (response.ok) {
        const data = await response.json();

        setMessages(data);
        setPreviousMessages(data)
      } else {
        console.error('Error fetching messages: ', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const containsSubstring = (str, substr) => str.includes(substr);

  const recentMessageActualData = (message) => {
    if (message.content.body && message.content.mime_type === '') {
      return message.content.body

    } else if (message.content.body === '' && message.content.mime_type) {
      if (containsSubstring(message.content.mime_type, "image")) {
        return (
          <div className='flex gap-x-3 items-center'>
            <div>Image</div>
            <img src={pictureImage} className='w-5' alt="picture logo" />
          </div>
        )
      }
      else if (containsSubstring(message.content.mime_type, "video")) {
        return (
          <div className='flex gap-x-3 items-center'>
            <div>Video</div>
            <img src={videoImage} className='w-5' alt="picture logo" />
          </div>
        )
      }
      else if (containsSubstring(message.content.mime_type, "audio")) {
        return (
          <div className='flex gap-x-3 items-center'>
            <div>Audio</div>
            <img src={audioImage} className='w-5' alt="picture logo" />
          </div>
        )
      }
      else if (containsSubstring(message.content.mime_type, "document") || containsSubstring(message.content.mime_type, "pdf")) {
        return (
          <div className='flex gap-x-3 items-center'>
            <div>Document</div>
            <img src={documentationImage} className='w-5' alt="picture logo" />
          </div>
        )
      }
    }
  }

  const handleDownload = async (mediaId, id) => {
    const fileName = 'myMediaFile'; // Replace with the desired file name

    try {
      const response = await axios.post('http://localhost:3000/download-media', {
        id,
        mediaId,
        fileName,
        token: data.longToken,
      });

      // Construct the URL and open it in a new tab
      const fileUrl = `http://localhost:3000/public/${id}/${response.data.fileName}`;
      window.open(fileUrl, '_blank');

      return response.data.fileName;
    } catch (error) {
      console.error('Error downloading media:', error);
      throw error;
    }
  };

  const handleOpenImages = async (mediaId, id) => {
    const fileName = 'myMediaFile'; // Replace with the desired file name

    try {
      const response = await axios.post('http://localhost:3000/download-media', {
        id,
        mediaId,
        fileName,
        token: data.longToken,
      });

      // Construct the URL and open it in a new tab
      const fileUrl = `http://localhost:3000/public/${id}/${response.data.fileName}`;

      const fetchDataUrl = async (id, fileName) => {
        try {
          const response = await fetch(`http://localhost:3000/file-dataurl/${id}/${fileName}`);
          const data = await response.json();
          if (data) {
            localStorage.setItem(mediaId, data.dataUrl); // Changed 'mediaId' to 'id' to match the parameter
          }
        } catch (error) {
          console.error('Error fetching Data URL:', error);
        }
      };

      fetchDataUrl(id, 'myMediaFile.jpg')
      fetchDataUrl(id, 'myMediaFile.png');



      // Update the state with new image data
      setSelectedImage(prevSelectedImage => {

        // Check if prevSelectedImage is an array
        if (!Array.isArray(prevSelectedImage)) {
          console.error('Expected prevSelectedImage to be an array.');
          return [{ mediaId, fileUrl }]; // Handle unexpected state
        }

        // Append new image data to the existing array
        return [
          ...prevSelectedImage,
          { mediaId, fileUrl }
        ];
      });

    } catch (error) {
      console.error('Error downloading media:', error);
      throw error;
    }
  };

  const handleOpenVideos = async (mediaId, id) => {
    const fileName = 'myMediaFile'; // Replace with the desired file name

    try {
      const response = await axios.post('http://localhost:3000/download-media', {
        id,
        mediaId,
        fileName,
        token: data.longToken,
      });

      // Construct the URL and open it in a new tab
      const fileUrl = `http://localhost:3000/public/${id}/${response.data.fileName}`;

      const fetchDataUrl = async (id, fileName) => {
        try {
          const response = await fetch(`http://localhost:3000/video/file-dataurl/${id}/${fileName}`);
          const data = await response.json();
          localStorage.setItem(mediaId, data.dataUrl); // Changed 'mediaId' to 'id' to match the parameter

        } catch (error) {
          console.error('Error fetching Data URL:', error);
        }
      };

      fetchDataUrl(id, 'myMediaFile.mp4')

      // Update the state with new image data
      setSelectedVidoes(prevsesetSelectedVidoes => {

        // Check if prevsesetSelectedVidoes is an array
        if (!Array.isArray(prevsesetSelectedVidoes)) {
          console.error('Expected prevsesetSelectedVidoes to be an array.');
          return [{ mediaId, fileUrl }]; // Handle unexpected state
        }

        // Append new image data to the existing array
        return [
          ...prevsesetSelectedVidoes,
          { mediaId, fileUrl }
        ];
      });

    } catch (error) {
      console.error('Error downloading media:', error);
      throw error;
    }
  };

  const handleOpenAudios = async (mediaId, id) => {
    const fileName = 'myMediaFile'; // Replace with the desired file name

    try {
      const response = await axios.post('http://localhost:3000/download-media', {
        id,
        mediaId,
        fileName,
        token: data.longToken,
      });

      // Construct the URL and open it in a new tab
      const fileUrl = `http://localhost:3000/public/${id}/${response.data.fileName}`;

      const fetchDataUrl = async (id, fileName) => {
        try {
          const response = await fetch(`http://localhost:3000/audio/file-dataurl/${id}/${fileName}`);
          const data = await response.json();
          localStorage.setItem(mediaId, data.dataUrl); // Changed 'mediaId' to 'id' to match the parameter

        } catch (error) {
          console.error('Error fetching Data URL:', error);
        }
      };

      fetchDataUrl(id, 'myMediaFile.mp3')

      // Update the state with new image data
      setSelectedAudio(prevSelectedAudio => {

        // Check if prevsesetSelectedAudio is an array
        if (!Array.isArray(prevSelectedAudio)) {
          console.error('Expected prevsesetSelectedAudio to be an array.');
          return [{ mediaId, fileUrl }]; // Handle unexpected state
        }

        // Append new image data to the existing array
        return [
          ...prevSelectedAudio,
          { mediaId, fileUrl }
        ];
      });

    } catch (error) {
      console.error('Error downloading media:', error);
      throw error;
    }
  };

  const showImages = (passedId) => {
    const image = localStorage.getItem(passedId)

    if (image) {
      return (
        <div>
          <img src={image} alt="image" className='sm:max-h-80' />
        </div>);
    } else {
      if (selectedImage.length > 0) {
        for (const element of selectedImage) {
          if (element.mediaId === passedId) {

            return (
              <div>
                <img src={element.fileUrl} alt="image" className='sm:max-h-80' />
              </div>);
          }
        }
        return false;
      }
    }
    return false;
  }

  const showVideos = (passedId) => {
    const video = localStorage.getItem(passedId)

    if (video) {
      return (
        <div>
          <video src={video} alt="video" controls />
        </div>);
    } else {
      if (selectedVidoes.length > 0) {
        for (const element of selectedVidoes) {
          if (element.mediaId === passedId) {

            return (
              <div>
                <video src={element.fileUrl} alt="video" controls />
              </div>);
          }
        }
        return false;
      }
    }
    return false;
  }

  const showAudio = (passedId) => {
    const audio = localStorage.getItem(passedId)
    if (audio) {
      return (
        <div>
          <audio
            src={audio}
            alt="audio"
            className='max-w-56 sm:max-w-full'
            controls
          />
        </div>
      );
    } else {
      if (selectedAudio.length > 0) {  // Consider renaming selectedVidoes to something more appropriate for audio
        for (const element of selectedAudio) {
          if (element.mediaId === passedId) {
            return (
              <div>
                <audio
                  src={element.fileUrl}
                  alt="audio"
                  className='max-w-56 sm:max-w-full'
                  controls
                />
              </div>
            );
          }
        }
      }
    }
    return null; // return null instead of false for React rendering
  }

  const messageActualData = (message) => {
    const renderMedia = (type, path, id, mediaHandler, showMedia, label, icon) => (
      <div onClick={() => mediaHandler(path, id)} className=''>
        {showMedia(path) || (
          <div className='flex gap-x-3 items-center bg-sky-50 text-black px-3 py-1 cursor-pointer hover:bg-white transition-all duration-500 rounded-md'>
            <div>{label}</div>
            <img src={icon} className='w-5' alt={`${label} logo`} />
          </div>
        )}
      </div>
    );

    const handleMediaRendering = (type, path, id) => {
      switch (type) {
        case "image":
          return renderMedia(type, path, id, handleOpenImages, showImages, "Image", pictureImage);
        case "video":
          return renderMedia(type, path, id, handleOpenVideos, showVideos, "Video", videoImage);
        case "audio":
          return renderMedia(type, path, id, handleOpenAudios, showAudio, "Audio", audioImage);
        case "document":
          return (
            <div
              className='flex gap-x-3 items-center bg-sky-50 text-black px-3 py-1 cursor-pointer hover:bg-white transition-all duration-500 rounded-md'
              onClick={() => handleDownload(path, id)}
            >
              <div>Document</div>
              <img src={documentationImage} className='w-5' alt="Document logo" />
            </div>
          );
        default:
          return null;
      }
    };

    // Render based on ourData
    if (message.ourData.text !== '') {
      return message.ourData.text;
    } else if (!message.ourData.text && !message.content.body && !message.content.mime_type) {
      return handleMediaRendering(message.ourData.messageType, message.ourData.path, message.message_id);
    }

    // Render based on content body and mime_type
    if (message.content.body && !message.content.mime_type) {
      return message.content.body;
    } else if (!message.content.body && message.content.mime_type) {
      return handleMediaRendering(message.type, message.content.media_id, message.message_id);
    }
  };

  const handleStatus = (status) => {
    if (status == 'sent') {
      return (
        <div className='bg-slate-200 p-1 rounded-full'>
          <img src={sent} alt="sent Image" className='w-3' />
        </div>
      )
    }
    else if (status == 'delivered') {
      return (
        <div className='bg-slate-200 p-1 rounded-full'>
          <img src={deliver} alt="delivered Image" className='w-4' />
        </div>
      )
    }
    else if (status == 'read') {
      return (
        <div className='bg-slate-200 p-1 rounded-full'>
          <img src={read} alt="read Image" className='w-4' />
        </div>
      )
    }
  }

  const handleConversationClick = (conversation) => {
    // Check if the clicked conversation is the same as the currently selected conversation
    if (selectedConversation && selectedConversation._id === conversation._id) {
      setinitateConversation(false)
      setShowMessages(true)
      return; // Do nothing if the same conversation is clicked
    }

    setSelectedConversation(conversation);

    fetchStatus(conversation._id, conversation.participants)
    setinitateConversation(false)
    setShowMessages(true)
  };

  const handleAttachmentClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    let mediaId;

    if (file) {
      let fileType = 'other file';
      if (file.type.includes('image')) fileType = 'image';
      else if (file.type.includes('video')) fileType = 'video';
      else if (file.type.includes('audio')) fileType = 'audio';
      else if (file.type.includes('application')) fileType = 'document';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);
      formData.append('messaging_product', 'whatsapp');

      try {
        const accessToken = data.longToken;
        const phoneNumberId = phoneNumberIndo.phon_no_id; // Replace with your phone number ID

        const uploadResponse = await axios.post(`https://graph.facebook.com/v20.0/${phoneNumberId}/media`, formData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        mediaId = uploadResponse.data.id
      } catch (error) {
        console.error('Error uploading file', error);
      }

      if (loading) return <div>Loading...</div>;
      if (errorNew) return <div>Error: {errorNew}</div>;
      if (!data) { return };
      if (!user) { return };

      try {
        const response = await axios.post('http://localhost:3000/media/send-message', {
          recipientPhoneNumber: selectedConversation.participants,
          senderId: user?.name,
          designation: user?.designation,
          businessId: data._id,
          phon_no: phoneNumberIndo.phon_no,
          phon_no_id: phoneNumberIndo.phon_no_id,
          token: data.longToken,
          mediaId: mediaId,
          type: fileType,
        });

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangeTemplateRecepient = (e) => {
    setTemplateRecepient(e.target.value);
  };


  const handleSubmit = async () => {
    if (loading) return <div>Loading...</div>;
    if (errorNew) return <div>Error: {errorNew}</div>;
    if (!data) { return };
    if (!user) { return };

    if (!isYes && !initateConversation) {
      try {
        const response = await axios.post('http://localhost:3000/send-message', {
          recipientPhoneNumber: selectedConversation.participants,
          senderId: user?.name,
          designation: user?.designation,
          messageBody: inputValue,
          businessId: data._id,
          templateName: '',
          phon_no: phoneNumberIndo.phon_no,
          phon_no_id: phoneNumberIndo.phon_no_id,
          token: data.longToken
        });

        // Clear the input field
        setInputValue('');

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
      }
    } else if (isYes && !initateConversation) {
      try {
        const response = await axios.post('http://localhost:3000/send-message', {
          recipientPhoneNumber: selectedConversation.participants,
          senderId: user?.name,
          designation: user?.designation,
          messageBody: '',
          businessId: data._id,
          templateName: inputValue,
          phon_no: phoneNumberIndo.phon_no,
          phon_no_id: phoneNumberIndo.phon_no_id,
          token: data.longToken
        });

        // Clear the input field
        setInputValue('');
        setIsYes(false)

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending Template message, make sure your message template is verified');
      }
    } else if (isYes && initateConversation) {
      try {
        const response = await axios.post('http://localhost:3000/send-message', {
          recipientPhoneNumber: templateRecepient,
          senderId: user?.name,
          designation: user?.designation,
          messageBody: '',
          businessId: data._id,
          templateName: inputValue,
          phon_no: phoneNumberIndo.phon_no,
          phon_no_id: phoneNumberIndo.phon_no_id,
          token: data.longToken
        });

        // Clear the input field
        setInputValue('');
        setTemplateRecepient('')

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending Template message, make sure your message template is verified');
      }
    } else if (!isYes && initateConversation) {
      alert('New conversation can only be started with message template.')
    }
  };

  // Function to call the API and update status
  const updateStatus = async (conversationId, recepient) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/messages/update-status/${conversationId}/${recepient}`);

    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  const fetchStatus = async (conversationId, recepient) => {
    try {
      const response = await axios.put(`http://localhost:3000/first-time/api/messages/update-status/${conversationId}/${recepient}`);

    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  useEffect(() => {
    const loadStatusCounts = async () => {
      try {
        const counts = {};
        for (const conversation of messageData) {
          const response = await axios.get(`http://localhost:3000/api/messages/status-count/${conversation._id}`);
          counts[conversation._id] = response.data.count;
        }
        setStatusCounts(counts);
      } catch (error) {
        console.error('Error fetching message status count:', error);
      }
    };

    loadStatusCounts();
  }, [data, messages, messageData]); // Dependency array includes messageData to reload counts when conversations change

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action (form submission)
      handleSubmit();
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();

    const filtered = messageData.filter(conversation => {
      const nameMatch = conversation.lastMessageSender?.toLowerCase().includes(lowercasedQuery);
      const numberMatch = conversation.participants.toLowerCase().includes(lowercasedQuery);
      return nameMatch || numberMatch;
    });

    setFilteredConversations(filtered);
  };

  useEffect(() => {
    setFilteredConversations(messageData)
  }, [messageData])

  useEffect(() => {
    if (initateConversation) {
      setIsYes(true)
    } else {
      setIsYes(false)
    }
  }, [initateConversation])

  const handleNewConversation = () => {
    setinitateConversation(true)
    setShowMessages(true)
  }

  const getReqnew = async () => {
    const response = await axios.get('http://localhost:3000')
  }

  return (
    <div className={`w-full max-w-screen-md md:max-w-[80vw] px-3 flex relative gap-x-3 flex-row items-center justify-end-start sm:mb-0 ${showMessages ? 'mb-[580px]' : 'mb-[630px]'}`}>
      <div className={`mx-auto flex flex-col px-4 mt-16 bg-gray-200 h-[540px] rounded-lg md:mt-0 gap-y-3 py-5 min-w-[95%] sm:min-w-[33.333%] md:w-1/3 ${showMessages ? '-left-[2000px]' : 'left-2 '} transition-all duration-500 sm:left-0 sm:relative absolute top-0`}>
        <div className='flex flex-col gap-y-2'>
          <div className='flex justify-between items-center flex-wrap'>
            <div className='font-semibold text-2xl'>Messaging</div>
            <div className='font-semibold text-sm bg-blue-700 hover:bg-blue-300 text-white cursor-pointer px-3 py-1 w-fit rounded-lg' onClick={() => { handleNewConversation() }}>New Conversation!</div>
          </div>
          <div>
            <div className='w-full bg-[#F7F7FD] rounded-md text-xs px-3 py-1 flex items-center gap-x-2 md:gap-x-4 hover:bg-[#E1E1FF] duration-500 transition-all'>
              <div><img src={search} className='w-6 md:w-5' alt='search' /></div>
              <input type="text" placeholder='Search by name or number' onChange={handleSearch} className='bg-transparent outline-none py-1 w-full' />
            </div>
          </div>
        </div>
        {/* <button onClick={getReqnew}>hey</button> */}
        <div className='flex flex-col gap-y-2 h-[350px] overflow-y-auto'>
          <div className='flex flex-col gap-y-2 h-[350px] overflow-y-auto'>
            {filteredConversations.map((message) => (
              <div key={message._id} className='h-14 bg-[#F7F7FD] min-h-14 mr-2 rounded-md flex justify-between items-center px-3 cursor-pointer hover:bg-[#E1E1FF] duration-500 transition-all gap-x-3' onClick={() => { handleConversationClick(message) }}>
                <div><img src={man2} className='w-9' alt='user' /></div>
                <div className='opacity-60 text-xs'>
                  <div className='font-semibold'>{message.lastMessageSender ? message.lastMessageSender : message.participants}</div>
                  <div style={{ width: '12rem', overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {recentMessageActualData(message)}
                  </div>
                </div>
                <div>{handleStatus(message.status)}</div>

                <div className={`text-xs font-semibold ${statusCounts[message._id] ? 'bg-red-500 text-white px-2 py-1 rounded-full' : ''}`}>
                  {statusCounts[message._id] > 0 ? statusCounts[message._id] : <></>}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      <button className={`sm:mt-0 mt-[80px] px-5 bg-blue-600 mr-4 text-white sm:hidden ${showMessages ? '' : 'hidden'} transition-all duration-500 rounded-md text-sm py-1`} onClick={() => { setShowMessages(false) }}>Back!</button>


      <div className={`md:w-2/3 my-4 h-[550px] md:h-[540px] sm:mt-3 mt-28 bg-gray-200 rounded-md px-3 py-3 flex transition-all duration-500 flex-col gap-y-3 ${showMessages ? 'left-2 right-2' : '-left-[2500px] sm:left-0'} sm:relative sm:right-0 sm:left-0 absolute top-2 sm:top-0`}>
        <div className='flex justify-between items-center gap-x-3 bg-slate-50 px-2 py-2 rounded-md'>
          <div className='flex gap-x-3 items-center w-[60%]'>
            <div><img src={man2} className='w-10'></img></div>
            <div className={`font-semibold ${initateConversation ? 'hidden' : ''} sm:text-xl text-xs`}>{selectedConversation?.lastMessageSender || selectedConversation?.participants || ''}</div>
            <input type="text" placeholder='91xxxxxxxxxx...' value={templateRecepient} onChange={handleChangeTemplateRecepient} className={`bg-transparent ${initateConversation ? '' : 'hidden'} sm:placeholder:text-sm placeholder:text-xs outline-blue-300 w-full py-1 px-1 rounded-md border border-blue-300 `} />
          </div>
          {/* <div className="flex items-center space-x-4">
            <span className='text-xs sm:text-sm'>Template?</span>
            <span className="text-gray-700">{isYes ? 'Yes' : 'No'}</span>
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${isYes ? 'bg-green-500' : 'bg-gray-300'
                }`}
              onClick={handleToggle}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isYes ? 'translate-x-6' : ''
                  }`}
              ></div>
            </div>
          </div> */}

          <div className='flex gap-x-2'>
            <div className="relative inline-block text-left text-xs">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition ease-in-out duration-150"
              >
                Templates
              </button>
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <ul className="py-1">
                    {templateNames.length > 0 ? (
                      templateNames.map((name, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTemplateClick(name)}
                        >
                          {name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No templates available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {!initateConversation && <div className="relative inline-block text-left text-xs">
              <button
                onClick={() => setShowPreDefinedDropDown(prev => !prev)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition ease-in-out duration-150 "
              >
                PreDefined
              </button>
              {showPreDefinedDropDown && (
                <div
                  ref={preDefinedDropDown}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <ul className="py-1">
                    {preDefinedTemplates.length > 0 ? (
                      preDefinedTemplates.map((name, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTemplateClickPreDefined(name.name)}
                        >
                          {name.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No templates available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>}
          </div>


        </div>
        <div ref={chatContainerRef} className='w-full h-4/5 rounded-md px-3 py-1 text-xs flex flex-col gap-y-1 overflow-y-auto'>

          {!initateConversation && loadingMessages && (
            previousMessages.slice(0).reverse().map((message, index) => (
              <div key={index} className={`flex flex-row items-start gap-x-2 ${message.metadata.sender_id !== '' ? 'justify-end' : ''}`}>
                <div className={`${message.metadata.sender_id !== '' ? 'bg-green-500 pl-3 pt-3 pr-2 pb-2' : 'bg-[#335fb6] pl-2 pt-2 pb-2'} text-white rounded-md sm:max-w-[50%] max-w-[85%]`}>
                  <div className='flex justify-between gap-x-4'>
                    <div className=''>{messageActualData(message)}</div>
                    <div className='font-semibold text-black'>{message.isTemplate ? 'Template Message' : ''}</div>
                  </div>
                  <div className='flex items-center justify-between gap-x-4 text-xs text-white text-[8px] mt-2'>
                    {new Date(message.received_at).toISOString().slice(11, 16)} {message.metadata.sender_id && `— ${message.metadata.sender_id}`}
                    <div className=''>{handleStatus(message.status)}</div>
                  </div>
                </div>
              </div>
            ))
          )}

          {!initateConversation && !loadingMessages && messages.slice(0).reverse().map((message, index) => (
            <div key={index} className={`flex flex-row items-start gap-x-2 ${message.metadata.sender_id !== '' ? 'justify-end' : ''}`}>
              <div className={`${message.metadata.sender_id !== '' ? 'bg-green-500 pl-3 pt-3 pr-2 pb-2' : 'bg-[#335fb6] pl-2 pt-2 pb-2'} text-white rounded-md sm:max-w-[50%] max-w-[85%]`}>
                <div className='flex justify-between gap-x-4'>
                  <div className=''>{messageActualData(message)}</div>
                  <div className='font-semibold text-black'>{message.isTemplate ? 'Template Message' : ''}</div>
                </div>
                <div className='flex items-center justify-between gap-x-4 text-xs text-white text-[8px] mt-2'>
                  {new Date(message.received_at).toISOString().slice(11, 16)} {message.metadata.sender_id && `— ${message.metadata.sender_id}`}
                  <div className=''>{handleStatus(message.status)}</div>
                </div>
              </div>
            </div>
          ))}

          {initateConversation && <div className='w-full flex justify-center text-xs sm:text-xl text-gray-400'>Start Conversation Now, By Sending A Template Message...</div>}
        </div>

        <div>
          <div className='flex flex-row md:justify-between items-start md:items-center gap-y-2 gap-x-3'>
            <div className='w-full rounded-md px-3 py-1 flex items-center gap-x-2 md:gap-x-4 bg-[#F7F7FD] hover:bg-[#E1E1FF] duration-500 transition-all'>
              <input type="text" onKeyDown={handleKeyDown} placeholder='Write Template Name or Just a messages...' value={inputValue} onChange={handleChange} className='sm:placeholder:text-sm placeholder:text-xs bg-transparent outline-none py-1 w-full' />
              <div className='cursor-pointer'>
                <img src={attachment} onClick={handleAttachmentClick}></img>
                <input
                  id="fileInput"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

              </div>
              <div className='bg-[#2E3B5B] px-3 py-1 z-20 rounded-md cursor-pointer' onClick={handleSubmit}><img src={send} className='w-6 mt-1'></img></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Messages;
