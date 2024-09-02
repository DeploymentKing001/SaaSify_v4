import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/sideBar/authenticationSlice';
import Cookies from 'js-cookie';

// Importing Images
import logo from '../../assets/images/logo.png';
import hamburger from '../../assets/images/hamburger.png';

const UserNav = () => {
    const [navStatus, setNavStatus] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const userRed = useSelector(state => state.user)
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setNavStatus(!navStatus);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setNavStatus(false);  // Close the sidebar after navigation
    };

    const handleNavigationUser = () => {
        if (userRed.designation == 'business owner') {
            navigate('/dashboard')
        } else if (userRed.designation == 'employee') {
            navigate('/messages-employee')
        } else if (userRed.designation == 'admin') {
            navigate('/dashboard-admin')
        }
    }

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setNavStatus(false);  // Close the sidebar
        }
    };

    useEffect(() => {
        if (navStatus) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navStatus]);

    useEffect(() => {
        setNavStatus(false);  // Close the sidebar whenever the path changes
    }, [location.pathname]);

    // Determine the active path
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        // Clear the 'token' cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
        
        // Dispatch the logout action
        dispatch(logout());
        
        // Optionally, navigate to the login or home page
        navigate('/');
    };

    return (
        <div>
            {/* Desktop View */}
            <div className='font-poppins sm:flex hidden sm:h-16 sm:w-[98.5vw] sm:px-16 sm:py-3 justify-between items-center border-b border-slate-200'>
                <div className='logo flex justify-center items-center'>
                    <img src={logo} className='w-10 mr-4' alt='Logo' />
                    <div className='text-xl font-semibold cursor-pointer' onClick={() => { handleNavigation('/') }}>SaaSify</div>
                </div>
                <div className=''>
                    <ul className='flex w-full justify-between font-medium gap-2'>
                        <li className={`px-5 py-1 ${userRed.isLoggedIn ? 'block' : 'hidden'} rounded-2xl transition-all duration-500 ${isActive('/dashboard') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={() => handleNavigationUser()}>Dashboard</li>
                        <li className={`px-5 py-1 rounded-2xl transition-all duration-500 ${isActive('/') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={() => { handleNavigation('/') }}>Home</li>
                        <li className={`px-5 py-1 rounded-2xl transition-all duration-500 ${isActive('/guide') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={() => handleNavigation('/guide')}>Guides</li>
                        <li className={`px-5 py-1 rounded-2xl transition-all ${userRed.isLoggedIn ? 'hidden' : 'block'} duration-500 ${isActive('/login') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={() => handleNavigation('/login')}>Login</li>
                        <li className={`px-5 py-1 rounded-2xl transition-all ${userRed.isLoggedIn ? 'hidden' : 'block'} duration-500 ${isActive('/register') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={() => handleNavigation('/register')}>Register</li>
                        <li className={`px-5 py-1 rounded-2xl transition-all ${userRed.isLoggedIn ? 'block' : 'hidden'} duration-500 ${isActive('/logout') ? 'bg-custom-button-green-color font-semibold' : 'hover:bg-custom-button-green-color hover:cursor-pointer'}`} onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            </div>

            {/* Mobile View */}
            <div className='flex fixed sm:hidden z-10 w-full h-14 justify-between px-8 items-center bg-white'>
                <img
                    src={hamburger}
                    className='h-8 cursor-pointer'
                    onClick={toggleSidebar}
                    alt='Menu'
                />
                {!navStatus ? <div className='logo flex justify-center items-center'>
                    <img src={logo} className='w-10 mr-4' alt='Logo' />
                    <div className='text-xl font-semibold cursor-pointer' onClick={() => { handleNavigation('/') }}>SaaSify</div>
                </div> : <></>}
                <div
                    ref={sidebarRef}
                    className={`sidebar h-screen w-3/5 fixed z-10 bg-white left-0 top-0 outline outline-1 outline-slate-300 transition-transform duration-300 ${navStatus ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
                >
                    <div className='flex flex-col h-full'>
                        {/* Logo Section */}
                        <div className='flex justify-center items-center py-6 border-b border-gray-200'>
                            <img src={logo} className='w-12 mr-3' alt='Logo' />
                            <div className='text-2xl font-semibold text-gray-800 cursor-pointer' onClick={() => handleNavigation('/')}>SaaSify</div>
                        </div>

                        {/* Navigation Links */}
                        <div className='flex-grow mx-5 mt-4'>
                            <ul className='flex flex-col space-y-4 font-semibold'>
                                <li className={`bg-blue-100 px-6 py-3 ${userRed.isLoggedIn ? 'block' : 'hidden'} rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={() => { handleNavigationUser() }}>
                                    Dashboard
                                </li>
                                <li className={`bg-blue-100 px-6 py-3 rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={() => { handleNavigation('/') }}>
                                    Home
                                </li>
                                <li className={`bg-blue-100 px-6 py-3 rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/guide') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={() => handleNavigation('/guide')}>
                                    Guides
                                </li>
                                <li className={`bg-blue-100 px-6 py-3 ${userRed.isLoggedIn ? 'hidden' : 'block'} rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/login') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={() => handleNavigation('/login')}>
                                    Login
                                </li>
                                <li className={`bg-blue-100 px-6 py-3 ${userRed.isLoggedIn ? 'hidden' : 'block'} rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/register') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={() => handleNavigation('/register')}>
                                    Register
                                </li>
                                <li className={`bg-blue-100 px-6 py-3 ${userRed.isLoggedIn ? 'block' : 'hidden'} rounded-lg w-3/4 text-center text-gray-700 transition-colors duration-300 ${isActive('/logout') ? 'bg-blue-200' : 'hover:bg-blue-200'}`} onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>

                        {/* Call to Action Button */}
                        <div className='flex justify-center mb-6'>
                            <button className='h-12 w-48 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg hover:bg-blue-600 transition-colors duration-300' onClick={() => handleNavigation('/register')} >
                                Join Now!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserNav;
