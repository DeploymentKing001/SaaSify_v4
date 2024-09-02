import React from 'react'
import { useNavigate } from 'react-router-dom';

// Import Images
import home1 from '../assets/images/Home 1.png'
import home2 from '../assets/images/Home 2.png'
import home3 from '../assets/images/Home 3.png'
import home4 from '../assets/images/Home 4.png'
import icon1 from '../assets/svgs/icon1.svg'
import icon2 from '../assets/svgs/icon2.svg'
import icon3 from '../assets/svgs/icon3.svg'
import icon4 from '../assets/svgs/icon4.svg'
import icon6 from '../assets/svgs/icon6.svg'
import icon7 from '../assets/svgs/icon7.svg'
import man from '../assets/svgs/man.png'
import webhook1 from '../assets/images/webhook1.png'
import webhook2 from '../assets/images/webhook2.png'
import webhook3 from '../assets/images/webhook3.png'

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className='parent  font-poppins'>
            <div className='body w-full pt-5 sm:pt-0'>
                <div className='first flex flex-wrap py-12 justify-around bg-gray-50'>
                    <div className='flex flex-col gap-y-8 items-center sm:items-start'>
                        <div className='sm:text-5xl text-[27px]'>
                            <div className='text-[#4D4D4D] font-bold'>
                                Streamline Your Business
                            </div>
                            <div className='flex gap-x-2'>
                                <div className='text-[#4D4D4D] font-bold'>
                                    Communications
                                </div>
                                <div className='text-[#4CAF4F] font-bold'>
                                    with
                                </div>
                            </div>
                            <div className='text-[#4CAF4F] font-bold'>
                                WhatsApp Integration.
                            </div>
                        </div>
                        <div className='sm:w-11/12 sm:text-base px-3 sm:px-0 sm:text-start text-center opacity-60 text-xs'>
                            Manage chats, analyze interactions, and empower your team with our intuitive SaaS solution.
                        </div>
                        <div>
                            <button className='bg-[#4CAF4F] hover:bg-green-900 hover:cursor-pointer transition-all duration-500 text-white px-6 py-2 rounded-lg' onClick={() => { navigate('/register') }}>Get Started For Free!</button>
                        </div>
                    </div>
                    <div className='sm:mt-0 mt-10'>
                        <img src={home1}></img>
                    </div>
                </div>

                <div className="second w-full flex justify-center my-5">
                    <div className='flex flex-col items-center justify-center w-11/12 sm:w-3/4 py-4'>
                        <div className='sm:text-5xl text-3xl text-[#4D4D4D] mb-5 font-bold'>Our Clients</div>
                        <div className='flex flex-col items-center w-full'>
                            <div className='sm:text-base text-xs text-center opacity-60'>We have had the privilege of working with a diverse portfolio of clients, including those from Fortune 6781+ companies, demonstrating our extensive experience and commitment to delivering exceptional value and solutions.</div>
                        </div>
                    </div>
                </div>

                <div className="third w-full flex justify-center my-5">
                    <div className='flex flex-col items-center justify-center w-11/12 sm:w-3/4 py-4'>
                        <div id='SaaSifyFeatures' className="flex flex-col items-center w-full">
                            <div className='sm:text-5xl text-xl font-bold text-[#4D4D4D]'>Manage your entire community</div>
                            <div className='sm:text-5xl text-xl font-bold text-[#4D4D4D]'> in a single system</div>
                        </div>
                        <div className='flex flex-col items-center w-full mt-5'>
                            <div className='sm:text-base text-xs'>What is SaaSify suitable for?</div>
                        </div>
                    </div>
                </div>

                <div className="fourth sm:w-[98.5vw] w-full sm:px-20 pb-10">
                    <div className="cards flex flex-wrap sm:justify-between justify-center sm:gap-y-0 gap-y-4 items-center">
                        <div className="flex flex-col items-center justify-around card h-56 w-56 rounded-md shadow-sm shadow-slate-400">
                            <div><img src={icon1} className='w-10'></img></div>
                            <div className='text-xl w-11/12 text-[#4D4D4D] text-center font-bold'>Advanced WhatsApp Integration</div>
                            <div className='text-xs w-5/6 opacity-60 text-center'>Connect your WhatsApp account effortlessly and manage chats, interactions, and media seamlessly within our platform.</div>
                        </div>
                        <div className="flex flex-col items-center justify-around card h-56 w-56 rounded-md shadow-sm shadow-slate-400">
                            <div><img src={icon2} className='w-10'></img></div>
                            <div className='text-xl w-11/12 text-[#4D4D4D] text-center font-bold'>Real-Time Chat Management</div>
                            <div className='text-xs w-5/6 opacity-60 text-center'>Handle text, images, videos, audio, and documents in real-time. Initiate and manage conversations with ease.</div>
                        </div>
                        <div className="flex flex-col items-center justify-around card h-56 w-56 rounded-md shadow-sm shadow-slate-400">
                            <div><img src={icon3} className='w-10'></img></div>
                            <div className='text-xl w-11/12 text-center text-[#4D4D4D] font-bold'>Comprehensive Dashboard</div>
                            <div className='text-xs w-5/6 opacity-60 text-center'>Access a detailed overview of chat interactions, employee performance, and key metrics through our intuitive dashboard.</div>
                        </div>
                        <div className="flex flex-col items-center justify-around card h-56 w-56 rounded-md shadow-sm shadow-slate-400">
                            <div><img src={icon3} className='w-10'></img></div>
                            <div className='text-xl w-11/12 text-center text-[#4D4D4D] font-bold'>Unified Messaging Hub</div>
                            <div className='text-xs w-5/6 opacity-60 text-center'>Effortlessly manage your WhatsApp chats, media, and interactions in real-time with our dashboard for a comprehensive overview of key metrics.</div>
                        </div>
                    </div>
                </div>

                <div className="fifth flex items-center flex-wrap justify-around">
                    <div><img src={home2}></img></div>
                    <div className='flex flex-col items-center justify-center sm:w-2/5 gap-y-6 mb-5 sm:text-start text-center'>
                        <div className='w-11/12 text-xl sm:text-3xl font-semibold text-[#4D4D4D]'>Revolutionize Your Business Communications with Seamless WhatsApp Integration</div>
                        <div className='text-xs w-11/12 opacity-60 sm:text-justify'>Our SaaS platform is designed to transform how businesses manage their communications through WhatsApp. By integrating with WhatsApp Cloud API, our solution offers a powerful and intuitive interface that streamlines your messaging processes.</div>
                        <div className='w-11/12 flex justify-center sm:justify-start'>
                            <button className='bg-[#4CAF4F] hover:bg-green-900 hover:cursor-pointer transition-all duration-500 text-white px-6 py-2 rounded-lg' onClick={() => { navigate('/register') }}>Get Started For Free!</button>
                        </div>
                    </div>
                </div>

                <div className="sixth w-full flex flex-wrap sm:flex-nowrap items-center justify-around py-16 bg-[#F5F7FA]">
                    <div className='flex flex-col items-center gap-y-3'>
                        <div className='sm:w-3/4 sm:text-start text-center'>
                            <div className='text-3xl font-semibold text-[#4D4D4D]'>Unified Communication</div><p className='text-3xl font-semibold text-[#4CAF4F]'>Hub</p>
                        </div>
                        <div className='sm:w-3/4 w-11/12 text-center sm:text-start opacity-60 text-xs'>Centralize all your WhatsApp interactions in one place, making it easier to manage conversations with clients, partners, and team members.</div>
                    </div>
                    <div className='flex flex-col items-center w-11/12 sm:w-2/3 gap-y-16 sm:mt-0 mt-7'>
                        <div className='flex w-full justify-around'>
                            <div className='flex items-center gap-x-3'>
                                <div><img src={icon4} className='h-6'></img></div>
                                <div>
                                    <div className='font-bold text-[#4D4D4D]'>6,871</div>
                                    <div className='opacity-60 text-xs sm:text-base'>Current Cients</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-x-3'>
                                <div><img src={man} className='h-10'></img></div>
                                <div>
                                    <div className='font-bold text-[#4D4D4D]'>46,328</div>
                                    <div className='opacity-60 text-xs sm:text-base'>Employee Managed</div>
                                </div>
                            </div>
                        </div>
                        <div className='flex w-full justify-around'>
                            <div className='flex items-center gap-x-3'>
                                <div><img src={icon6} className='h-8'></img></div>
                                <div>
                                    <div className='font-bold text-[#4D4D4D]'>8,288</div>
                                    <div className='opacity-60 text-xs sm:text-base'>Total Clients</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-x-3'>
                                <div><img src={icon7} className='h-6'></img></div>
                                <div>
                                    <div className='font-bold text-[#4D4D4D]'>1,926,436</div>
                                    <div className='opacity-60 text-xs sm:text-base'>Messages Sent!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seventh flex items-center flex-wrap justify-around py-8 sm:gap-y-0 gap-y-6">
                    <div><img src={home3}></img></div>
                    <div className='flex flex-col items-center justify-center sm:w-2/5 gap-y-6 mb-5'>
                        <div className='w-11/12 text-xl sm:text-3xl font-semibold text-[#4D4D4D] sm:text-start text-center'>Efficient Employee Management: Streamline Your Team’s Workflow</div>
                        <div className='text-xs w-11/12 opacity-60 sm:text-justify text-center'>Our platform offers a comprehensive employee management system designed to simplify and enhance how you oversee your team’s operations. With an intuitive interface, you can easily onboard new employees, assign roles, and manage permissions. The centralized employee dashboard provides a clear overview of your team’s activities and performance metrics, allowing you to monitor productivity and address any issues promptly.</div>
                        <div className='text-xs w-11/12 opacity-60 sm:text-justify text-center'>Effective communication management is a core feature, giving you control over chat access and permissions to ensure secure and compliant interactions. You can also streamline task management by assigning tasks directly through the chat interface, with automated notifications keeping your team informed of important updates and deadlines. Enhanced collaboration tools foster teamwork by supporting shared resources and real-time updates, while built-in feedback mechanisms and support resources ensure any issues are resolved efficiently. Overall, our platform integrates these features to make employee management seamless and productive, helping your team operate at its best.</div>
                    </div>
                </div>

                <div className="eight flex flex-wrap justify-around items-center py-7 sm:gap-y-0 gap-y-5 bg-[#F5F7FA]">
                    <div><img src={home4} className='h-56 sm:h-80 rounded-xl'></img></div>
                    <div className='w-11/12 sm:w-2/5 flex flex-col items-center gap-y-3'>
                        <div className='w-11/12 text-xs opacity-60 sm:text-justify text-center'>We’ve been using this WhatsApp integration platform, and it’s been a game-changer for our business. The real-time chat management is smooth and intuitive, making it easy to handle multiple conversations and media. The employee management features streamline onboarding and task assignments, while the webhook automation has greatly reduced manual work. The comprehensive dashboard offers valuable insights, and customer support has been excellent. This platform has significantly improved our communication and efficiency. Highly recommend!</div>
                        <div className='w-11/12 text-xl font-semibold text-[#4CAF4F]'>Tim Smith</div>
                        <div className='w-11/12 opacity-40 text-xs'>British Dragon Boat Racing Association</div>
                        <div className='w-11/12'>
                            <div></div>
                            <div className='w-full flex sm:justify-start justify-center'>
                                <button className='bg-[#4CAF4F] hover:bg-green-900 hover:cursor-pointer transition-all duration-500 text-white px-6 py-2 rounded-lg' onClick={() => { navigate('/register') }}>Register Now!</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ninth flex flex-col items-center justify-around py-5">
                    <div className='text-[#4D4D4D] font-semibold text-xl sm:text-3xl w-2/3 sm:w-fit'>Webhooks: Automate and Streamline Your Workflow</div>
                    <div className='w-2/3 text-center text-xs opacity-60 mt-4'>Webhooks are a powerful automation tool that enable your system to communicate in real-time with external applications, triggering automated responses and actions based on specific events. Here’s how webhooks work and how they can enhance automation within your platform:</div>
                    <div className='flex flex-wrap justify-around items-center w-full'>
                        <div className='relative'>
                            <img src={webhook1} className=' h-72 w-72 object-contain'></img>
                            <div className="h-28 w-52 bg-[#F5F7FA] absolute bottom-0 left-10 rounded-lg shadow-lg shadow-slate-400">
                                <div className=' w-full flex flex-col items-center justify-around h-full'>
                                    <div className='text-[#717171] w-[#95%] text-center text-sm font-semibold'>Webhooks instantly alert your system of events via HTTP requests.</div>
                                    <div className='font-bold hover:cursor-pointer text-[#4CAF4F]' onClick={() => { navigate('/register') }}>Learn more !</div>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <img src={webhook2} className=' h-72 w-72 object-contain'></img>
                            <div className="h-28 w-52 bg-[#F5F7FA] absolute bottom-0 left-10 rounded-lg shadow-lg shadow-slate-400">
                                <div className=' w-full flex flex-col items-center justify-around h-full'>
                                    <div className='text-[#717171] w-[#95%] text-center text-sm font-semibold'>Webhooks automatically perform tasks like updating chats or notifying users.</div>
                                    <div className='font-bold hover:cursor-pointer text-[#4CAF4F]' onClick={() => { navigate('/register') }}>Learn more !</div>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <img src={webhook3} className=' h-72 w-72 object-contain'></img>
                            <div className="h-28 w-52 bg-[#F5F7FA] absolute bottom-0 left-10 rounded-lg shadow-lg shadow-slate-400">
                                <div className=' w-full flex flex-col items-center justify-around h-full'>
                                    <div className='text-[#717171] w-[#95%] text-center text-sm font-semibold'>Webhooks ensure consistent data across systems by syncing updates.</div>
                                    <div className='font-bold hover:cursor-pointer text-[#4CAF4F]' onClick={() => { navigate('/register') }}>Learn more !</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tenth flex flex-col items-center justify-around gap-y-7 py-7 bg-[#F5F7FA]">
                    <div className='text-[#4D4D4D] font-semibold text-xl sm:text-3xl w-2/3 sm:w-fit'>Seamless Automation and Synchronization</div>
                    <div>
                        <button className='bg-[#4CAF4F] hover:bg-green-900 hover:cursor-pointer transition-all duration-500 text-white px-6 py-2 rounded-lg' onClick={() => { navigate('/register') }}>Register Now!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
