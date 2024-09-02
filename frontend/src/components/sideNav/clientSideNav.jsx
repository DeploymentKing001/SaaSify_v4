import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../redux/sideBar/sidebarSlice.js';
import { logout } from '../../redux/sideBar/authenticationSlice.js';
import axios from 'axios';
import io from 'socket.io-client';

// import images
import properties from '../../assets/svgs/properties.svg'
import messages from '../../assets/svgs/messages.svg'
import settings from '../../assets/svgs/settings.svg'
import team from '../../assets/svgs/team.svg'
import dashboard from '../../assets/svgs/dashboard.svg'
import key from '../../assets/svgs/Light-Iconkey.svg'
import logoutImage from '../../assets/images/logout.png'
import fileImage from '../../assets/images/file.png'
import managementImage from '../../assets/images/project-management.png'
import antennaImage from '../../assets/images/antenna.png'


const socket = io('http://localhost:3000');

const clientSideNav = () => {
    const businessId = useSelector((state) => state.user.id);
    const isVisible = useSelector((state) => state.sidebar.isVisible);
    const loggedInStatus = useSelector((state) => state.user.isLoggedIn)
    const [activeItem, handleClick] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [unreadMessages, setUnreadMessages] = useState(0)
    const [rerender, setRerender] = useState(0)

    const handleClickDashboard = (event) => {
        handleClick(event);
        dispatch(toggleSidebar())
        navigate('/' + event)
    };

    useEffect(() => {
        const handleMessage = (data) => {
            setRerender(prevRerender => prevRerender + 1)
        };

        socket.on('message', handleMessage);
        return () => {
            socket.off('message', handleMessage);
        };
    }, [socket]);


    useEffect(() => {
        if (!businessId) {
            console.warn('Business ID is undefined');
            return;
        }
        
        const updateStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/messages/all/status-count/${businessId}`);
                setUnreadMessages(response.data.count);
            } catch (error) {
                console.log(error);
            }
        };
        updateStatus();
    }, [businessId, rerender]);



    const handleLogout = () => {
        // Clear the 'token' cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";

        // Dispatch the logout action
        dispatch(logout());

        // Optionally, navigate to the login or home page
        navigate('/');
    };

    return (
        <div className={`font-poppins flex flex-col z-10 items-center justify-between md:min-w-1/6 md:h-[93vh] h-[100.5vh] border-r border-slate-200 bg-white py-9 transition-all duration-500 md:px-0 px-4 fixed ${isVisible ? 'top-0 left-0 md:sticky md:left-0 md:w-1/6 md:py-9' : 'top-0 -left-60 md:sticky md:left-0 md:w-1/6 md:py-9'}`}>
            <div className='flex flex-col gap-y-3'>
                <div className='flex justify-start gap-x-4 items-center bg-[#000929] px-4 py-2 text-white rounded-md mb-3'>
                    <div><img src={properties}></img></div>
                    <div>Properties</div>
                </div>
                <div className={`flex justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'dashboard' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('dashboard') }}>
                    <div><img src={dashboard}></img></div>
                    <div>Dashboard</div>
                </div>
                <div className={`flex justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'team' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('team') }}>
                    <div><img src={team}></img></div>
                    <div>Team</div>
                </div>
                <div className={`flex justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'settings' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('settings') }}>
                    <div><img src={settings}></img></div>
                    <div>Settings</div>
                </div>
                <div className={`flex relative justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'messages' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('messages') }}>
                    <div><img src={messages}></img></div>
                    <div>Messages</div>
                    <div className='text-xs bg-red-500 text-white px-2 absolute left-9 top-0 rounded-full'>{unreadMessages}</div>
                </div>
                <div className={`flex relative justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'broadcast' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('broadcast') }}>
                    <div><img src={antennaImage} className='w-5'></img></div>
                    <div>BroadCast</div>
                </div>
                <div className={`flex relative justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'bulk-import' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('bulk-import') }}>
                    <div><img src={fileImage} className='w-5'></img></div>
                    <div>Bulk Import</div>
                </div>
                <div className={`flex relative justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'template-management' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('template-management') }}>
                    <div><img src={managementImage} className='w-5'></img></div>
                    <div>Templates</div>
                </div>
                <div className={`flex justify-start gap-x-4 ${loggedInStatus ? 'block' : 'hidden'} items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'logout' ? 'bg-blue-300 text-white' : ''}`} onClick={handleLogout}>
                    <div><img src={logoutImage} className='w-5'></img></div>
                    <div>Logout</div>
                </div>
            </div>
            <div className={`flex gap-x-2 px-4 py-2 outline outline-1 rounded-sm items-center hover:bg-blue-300 cursor-pointer transition-all duration-500 ${activeItem === 'support' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('support') }}>
                <div><img src={key}></img></div>
                <div className='px-5 py-1 bg-[#000929] rounded-sm text-white text-xs'>Support</div>
            </div>
        </div>
    )
}

export default clientSideNav