import React from 'react';
import axios from 'axios';

const SaveConfiguration = ({ longTermToken, businessAccountId, businessId }) => {
    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/verify-whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    longTermToken,
                    businessAccountId,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                try {
                    const saveResponse = await fetch('http://localhost:3000/api/save-phone-no', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            businessId,
                            phoneNumbers: data.phoneNumbers,
                        }),
                    });
                    const saveData = await saveResponse.json();

                    if (saveResponse.ok) {
                        try {
                            const newResponse = await axios.put(`http://localhost:3000/api/users/${businessId}`, {
                                businessAccountId,
                                longToken: longTermToken,
                                credentialsStatus: true
                            });

                            alert('Configuration saved successfully!');
                        } catch (error) {
                            console.error('Error updating user:', error);
                        }
                    } else {
                        alert(`Error: ${saveData.message}`);
                    }
                } catch (error) {
                    console.error('Error saving configuration:', error);
                    alert(error);
                }
            } else {
                try {
                    const response = await fetch(`http://localhost:3000/api/users/false/${businessId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // No need to send a body since we're only setting `credentialsStatus` to false
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const updatedUser = await response.json();
                } catch (error) {
                    console.error('Failed to update user:', error);
                }
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error verifying WhatsApp:', error);
            alert(error);
        }
    };

    return (
        <button
            onClick={handleSave}
            className='px-6 py-2 bg-[#DEFF9A] hover:bg-custom-button-green-color rounded-md transition-all duration-500'
        >
            Save
        </button>
    );
};

export default SaveConfiguration;
