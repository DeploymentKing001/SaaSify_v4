import React, { useState, useEffect } from 'react';
import apiIntegration from '../../assets/images/Api Integration 1.png';
import { useSelector, useDispatch } from 'react-redux';
import SaveConfiguration from '../../components/helperFunctions/saveConfig.jsx';
import { fetchBusinessAccount } from '../../redux/sideBar/accountInfoSlice.js';
import axios from 'axios';

const Settings = () => {
    const [longTermToken, setLongTermToken] = useState('');
    const [businessAccountId, setBusinessAccountId] = useState('');
    const businessId = useSelector((state) => state.user.id);
    const dispatch = useDispatch();
    const { data, loading, errorNew } = useSelector((state) => state.businessAccount);
    const [accountInfo, setAccountInfo] = useState([]);
    const [accountWhatsappConfig, setAccountWhatsappConfig] = useState([]);

    const handleFetchAccountInfo = async (accountId, accessToken) => {
        try {
            const response = await axios.post('http://localhost:3000/api/account', {
                accessToken,
                accountId
            });
            setAccountInfo(response.data);
            console.log(response.data);
        } catch (err) {
            console.error('Failed to fetch account info.', err);
        }
    };

    const handleFetchWhatsappConfig = async (businessId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/whatsapp-config/${businessId}`);
            setAccountWhatsappConfig(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (data && businessAccountId && longTermToken) {
            if (data.credentialsStatus) {
                handleFetchAccountInfo(businessAccountId, longTermToken);
            }
        }

        if (businessId) {
            handleFetchWhatsappConfig(businessId);
        }
    }, [data, businessAccountId, longTermToken, businessId]);

    useEffect(() => {
        if (businessId) {
            dispatch(fetchBusinessAccount(businessId));
        }
    }, [businessId, dispatch]);

    useEffect(() => {
        if (data && data.businessAccountId && data.longToken) {
            setBusinessAccountId(data.businessAccountId);
            setLongTermToken(data.longToken);
        }
    }, [data]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    };

    if (loading) return <div>Loading...</div>;
    if (errorNew) return <div>Error: {errorNew}</div>;

    return (
        <div className='font-poppins flex flex-col md:max-w-[80vw] mt-16 md:mt-0'>
            <div className='body flex flex-col sm:flex-row justify-center sm:justify-around w-full md:w-[80vw] items-center pt-1'>
                <div className='flex flex-col gap-y-2 w-full sm:w-1/2 px-4 sm:px-0'>
                    <div className='text-xl sm:text-3xl font-semibold'>WhatsApp API Configuration</div>
                    <div className='text-xs sm:text-sm opacity-60'>Connect your WhatsApp Business Account to SaaSify</div>
                    <div className='mt-2 flex flex-col gap-y-1 text-sm'>
                        <div className="label">Long-Term Token</div>
                        <input
                            type='text'
                            value={longTermToken}
                            onChange={(e) => setLongTermToken(e.target.value)}
                            placeholder='Paste your Long-Term Token Key here'
                            className='px-3 w-full py-2 rounded-lg bg-[#F0F5F2]'
                        />
                    </div>
                    <div className='mt-2 flex flex-col gap-y-1 text-sm'>
                        <div className="label">Business Account ID</div>
                        <input
                            type='text'
                            value={businessAccountId}
                            onChange={(e) => setBusinessAccountId(e.target.value)}
                            placeholder='Paste your Business Account ID here'
                            className='px-3 w-full py-2 rounded-lg bg-[#F0F5F2]'
                        />
                    </div>
                    <div className='flex w-full justify-end mt-4 gap-x-2 text-xs'>
                        <SaveConfiguration
                            longTermToken={longTermToken}
                            businessAccountId={businessAccountId}
                            businessId={businessId}
                        />
                        <button className='px-6 py-2 bg-blue-400 rounded-md transition-all duration-500'>
                            {data?.credentialsStatus ? 'Verified' : 'Not Verified'}
                        </button>
                    </div>
                </div>
                <div className='w-full sm:w-1/3 mt-4 sm:mt-0'>
                    <img src={apiIntegration} alt="API Integration" className='w-full h-auto' />
                </div>
            </div>
            <div className='w-full sm:w-[80vw] flex flex-col items-start justify-center mt-5 gap-y-2 px-4 sm:px-0 md:px-11 md:mb-5'>
                <div className='text-xl sm:text-3xl font-semibold'>WhatsApp Webhook Configuration</div>
                <div className='text-xs sm:text-sm opacity-60'>Connect your WhatsApp Business Account to SaaSify</div>
                <div className='flex flex-col sm:flex-row w-full text-sm'>
                    <div className='w-full sm:w-3/12 mb-2 sm:mb-0'>Verify Token:</div>
                    <div className='sm:block hidden w-full sm:w-1/2 mb-2 sm:mb-0'>ApplePie</div>
                    <div className='w-full sm:w-1/6 text-xs'>
                        <button onClick={() => copyToClipboard('ApplePie')} className='px-6 py-2 bg-[#DEFF9A] hover:bg-custom-button-green-color rounded-md transition-all duration-500 w-full'>Copy</button>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row w-full text-sm pb-5 md:pb-0'>
                    <div className='w-full sm:w-3/12 mb-2 sm:mb-0'>Webhook End-Point:</div>
                    <div className='sm:block hidden w-full sm:w-1/2 mb-2 sm:mb-0'>http://localhost:3000/webhook</div>
                    <div className='w-full sm:w-1/6 flex gap-2 text-xs'>
                        <button onClick={() => copyToClipboard('http://localhost:3000/webhook')} className='px-6 py-2 bg-[#DEFF9A] hover:bg-custom-button-green-color rounded-md transition-all duration-500 w-full'>Copy</button>
                    </div>
                </div>
            </div>

            {/* Display Account Info and WhatsApp Config */}
            <div className="w-full flex flex-col items-start justify-center mt-5 px-4 sm:px-6 md:px-8 lg:px-12 py-3">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Account and Business Details</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Here is the detailed information fetched from the API</p>
                <div className="w-full space-y-4 text-sm sm:text-base text-gray-800">
                    {accountInfo && (
                        <div className="space-y-2">
                            <div className="font-semibold">Account Name:</div>
                            <div className="bg-gray-100 p-2 rounded">{accountInfo.name || 'N/A'}</div>

                            <div className="font-semibold">Timezone ID:</div>
                            <div className="bg-gray-100 p-2 rounded">{accountInfo.timezone_id || 'N/A'}</div>

                            <div className="font-semibold">Message Template Namespace:</div>
                            <div className="bg-gray-100 p-2 rounded">{accountInfo.message_template_namespace || 'N/A'}</div>
                        </div>
                    )}
                    {accountWhatsappConfig && (
                        <div className="space-y-2">
                            <div className="font-semibold">Phone Number:</div>
                            <div className="bg-gray-100 p-2 rounded">{accountWhatsappConfig.phon_no || 'N/A'}</div>

                            <div className="font-semibold">Phone Number ID:</div>
                            <div className="bg-gray-100 p-2 rounded">{accountWhatsappConfig.phon_no_id || 'N/A'}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
