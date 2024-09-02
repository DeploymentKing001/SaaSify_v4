import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../redux/sideBar/sidebarSlice';
import { logout } from '../../redux/sideBar/authenticationSlice';

// import images
import properties from '../../assets/svgs/properties.svg'
import settings from '../../assets/svgs/settings.svg'
import team from '../../assets/svgs/team.svg'
import dashboard from '../../assets/svgs/dashboard.svg'
import key from '../../assets/svgs/Light-Iconkey.svg'
import logoutImage from '../../assets/images/logout.png'
import BellImage from '../../assets/images/bell.png'

const clientSideNav = () => {
    const isVisible = useSelector((state) => state.sidebar.isVisible);
    const loggedInStatus = useSelector((state) => state.user.isLoggedIn)
    const [activeItem, handleClick] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClickDashboard = (event) => {
        handleClick(event);
        dispatch(toggleSidebar())
        navigate('/' + event + '-admin')
    };

    const handleLogout = () => {
        // Clear the 'token' cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";

        // Dispatch the logout action
        dispatch(logout());

        // Optionally, navigate to the login or home page
        navigate('/');
    };

    return (
        <div className={`font-poppins flex flex-col z-10 items-center justify-between md:min-w-1/6 md:h-[93vh] h-[100.5vh] border-r border-slate-200 bg-white py-9 transition-all duration-500 md:px-0 px-4 fixed ${isVisible ? 'top-0 left-0 md:sticky md:left-0 md:w-1/6 md:py-9' : 'top-0 -left-80 md:sticky md:left-0 md:w-1/6 md:py-9'}`}>
            <div className='flex flex-col gap-y-3 text-sm'>
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
                    <div>Manage Clients</div>
                </div>
                <div className={`flex justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'notifications' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('notifications') }}>
                    <div><img src={BellImage} className='w-6'></img></div>
                    <div>Notifications</div>
                </div>
                <div className={`flex justify-start gap-x-4 items-center px-4 py-2 text-slate-500 cursor-pointer hover:bg-blue-300 rounded-md hover:text-white transition-all duration-500 ${activeItem === 'support' ? 'bg-blue-300 text-white' : ''}`} onClick={() => { handleClickDashboard('support') }}>
                    <div><img src={settings}></img></div>
                    <div>Support Messages</div>
                </div>
            </div>
            <div className={`flex gap-x-2 px-4 py-2 outline outline-1 rounded-sm items-center hover:bg-blue-300 cursor-pointer transition-all duration-500`} onClick={handleLogout}>
                <div><img src={key}></img></div>
                <div className='px-5 py-1 bg-[#000929] rounded-sm text-white text-xs'>Logout</div>
            </div>
        </div>
    )
}

export default clientSideNav