import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../redux/sideBar/sidebarSlice.js';

// import images
import logo from '../../assets/images/logo.png';
import profile from '../../assets/images/profile.png';
import notification from '../../assets/images/notification-bell.png';
import hamburgerIcon from '../../assets/images/hamburger.png'; // Add your hamburger icon

const ClientNav = () => {
    const dispatch = useDispatch();

    return (
        <div className='w-[99.3vw] fixed md:static flex bg-white z-10 justify-between items-center font-poppins border-b border-slate-200 py-2 px-10'>
            <div className='logo flex justify-center items-center'>
                <img src={logo} className='w-10 mr-4' alt='Logo' />
                <div className='text-xl font-semibold cursor-pointer'>SaaSify</div>
            </div>
            <div className='flex justify-around items-center md:w-1/12 gap-x-3'>
                <div><img src={notification} className='w-7 hover:cursor-pointer'></img></div>
                <div><img src={profile} className='w-9 hover:cursor-pointer'></img></div>
                <div className='md:hidden flex items-center cursor-pointer' onClick={() => dispatch(toggleSidebar())}>
                    <img src={hamburgerIcon} className='w-8' alt='Menu' />
                </div>
            </div>
        </div>
    );
}

export default ClientNav;
