import React from 'react';
import { useNavigate } from 'react-router-dom'

// Import images
import insta from '../../assets/svgs/insta.svg';
import youtube from '../../assets/svgs/youtube.svg';
import send from '../../assets/svgs/send.svg';

const Footer = () => {
    const navigate = useNavigate();

    const handleSend = async () => {
        const email = document.querySelector('input[type="text"]').value;

        try {
            const response = await fetch('http://localhost:3000/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Notify the user of success
                setEmail(''); // Clear the input field
            } else {
                alert(data.message); // Notify the user of the error
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while subscribing.');
        }
    };

    return (
        <div className='flex flex-col lg:flex-row justify-around items-center py-6 bg-[#263238] z-50'>
            <div className='text-white flex flex-col gap-y-4 text-center lg:text-left'>
                <div className='text-3xl font-semibold'>SaaSify</div>
                <div className='text-xs'>Copyright © 2024 by SaaSify.</div>
                <div className='text-xs'>All rights reserved.</div>
                <div className='flex justify-center lg:justify-start gap-x-3'>
                    <img src={insta} className='w-5 cursor-pointer' alt='Instagram'></img>
                    <img src={youtube} className='w-5 cursor-pointer' alt='YouTube'></img>
                </div>
            </div>
            <div className='text-white flex flex-col lg:flex-row gap-y-4 lg:gap-x-12'>
                <div className='flex flex-col gap-y-2'>
                    <div className='text-lg font-semibold text-center lg:text-left'>Useful Links</div>
                    <div className='text-xs cursor-pointer hover:underline text-center lg:text-left' onClick={() => { navigate('/register') }}>Register</div>
                    <div className='text-xs cursor-pointer hover:underline text-center lg:text-left' onClick={() => { navigate('/login') }}>Sign in</div>
                    <div className='text-xs cursor-pointer hover:underline text-center lg:text-left' onClick={() => { navigate('/guide') }}>Guides</div>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <div className='text-lg font-semibold text-center lg:text-left'>Support</div>
                    <div className='text-xs cursor-pointer hover:underline text-center lg:text-left'>Privacy policy</div>
                    <div className='text-xs cursor-pointer hover:underline text-center lg:text-left'>Terms of service</div>
                </div>
                <div className='flex flex-col gap-y-3'>
                    <div className='text-lg font-semibold text-center lg:text-left'>Stay up to date</div>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder='Your email address'
                            className='px-4 py-1 pr-10 placeholder:text-white placeholder:text-xs rounded-xl bg-opacity-50 text-xs bg-slate-500 w-full lg:w-auto'
                        />
                        <img
                            src={send}
                            className='absolute right-4 bottom-1 w-4 cursor-pointer'
                            alt='Send'
                            onClick={handleSend}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
