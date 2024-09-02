import React from 'react';

// import images
import Guide1 from '../../assets/images/Login 1.png';
import Guide2 from '../../assets/images/Guide 2.png';
import ApiIntegration from '../../assets/images/apiIntegration.png';

const guide = () => {
    return (
        <div className='page font-poppins'>
            <div className="first flex flex-col md:flex-row justify-around items-center w-full overflow-hidden">
                <div className='w-full md:w-auto flex justify-center'>
                    <img src={Guide1} className='max-w-full md:max-w-xl'></img>
                </div>
                <div className='w-full md:w-1/3 flex flex-col gap-y-5 p-4 md:p-0'>
                    <div className='text-lg md:text-xl text-center font-bold'>
                        How to Get Started with Your WhatsApp Cloud API Integration
                    </div>
                    <div className='text-sm md:text-xs opacity-70 text-center'>
                        Welcome to our step-by-step guide for setting up your WhatsApp Cloud API integration! To help you get started smoothly, we’ve outlined the essential steps you'll need to follow. By the end of this guide, you'll be ready to fully integrate your WhatsApp Cloud API and start leveraging its powerful features.
                    </div>
                    <div className='font-semibold text-base md:text-lg'>Step 1: Obtain Your Long-Term Token, WhatsApp Number ID, and WhatsApp Cloud Account ID</div>
                    <div className='font-semibold text-base md:text-lg'>Step 2: Provide Us with Your Credentials</div>
                    <div className='flex justify-center'>
                        <img src={ApiIntegration} className='sm:w-3/4'></img>
                    </div>
                </div>
            </div>

            <div className="first flex flex-col md:flex-row justify-around items-center w-full overflow-hidden">
                <div className='w-full md:w-auto flex justify-center'>
                    <img src={Guide2} className='max-w-full md:max-w-xl'></img>
                </div>
                <div className='w-full md:w-1/3 flex flex-col gap-y-5 p-4 md:p-0'>
                    <div className='font-semibold text-base md:text-lg'>Step 3: Setting Up the Webhook</div>
                    <div className='text-sm md:text-xs opacity-70 text-justify'>
                        1. Go to the bottom of the page and copy the Webhook endpoint and verify token.
                    </div>
                    <div className='text-sm md:text-xs opacity-70 text-justify'>
                        2. Log in and navigate back to your WhatsApp Business Settings.
                    </div>
                    <div className='text-sm md:text-xs opacity-70 text-justify'>
                        3. In the "Webhook" section, click on "Create Webhook." Enter the endpoint URL that we provide you. This is where all the incoming messages and events will be sent.
                    </div>
                    <div className='flex justify-center'>
                        <img src={ApiIntegration} className='sm:w-3/4'></img>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default guide;
