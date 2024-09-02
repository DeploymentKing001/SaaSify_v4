import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // You need to install axios if you haven't already
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../../redux/sideBar/authenticationSlice.js';

// Import images
import Login1 from '../../assets/images/Login 1.png';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Include cookies with the request
            });

            if (response.status === 200) {
                navigate('/dashboard-admin'); // Redirect to a protected route

                try {
                    const response = await axios.get('http://localhost:3000/api/me', {
                        withCredentials: true, // Include cookies in the request
                    });

                    const data = response.data.user;

                    dispatch(logout())
                    dispatch(setUser({ id: data.id, designation: data.platformRole }));
                } catch (error) {
                    if (error.response) {
                        console.error('Error response:', error.response.data.error);
                    } else {
                        console.error('Error:', error.message);
                    }
                }
            }
        } catch (err) {
            // Set the error message from the response
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div>
            <div className='page font-poppins'>
                <div className="first flex flex-col sm:flex-row justify-around items-center w-full overflow-hidden py-4">
                    <div className='w-full md:w-auto flex justify-center'>
                        <img src={Login1} className='max-w-full md:max-w-xl max-h-[85vh]'></img>
                    </div>
                    <div className='w-full md:w-1/3 flex flex-col gap-y-3 p-4 md:p-0'>
                        <div className='text-lg md:text-xl text-center font-bold'>
                            Admin Sign in 
                        </div>
                        {error && <div className='text-red-500 text-center mb-2'>{error}</div>}
                        <form onSubmit={handleSubmit} className='flex flex-col gap-y-2 sm:ml-0 ml-6'>
                            <div className='flex flex-col gap-y-2'>
                                <div className="label">Email</div>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='you@example.com'
                                    className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                    required
                                />
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                <div className="label">Password</div>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='************'
                                    className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='bg-[#AFF911] sm:w-11/12 w-[92%] py-2 rounded-lg font-semibold sm:ml-0   hover:bg-[#89CA00] transition-all duration-500'
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
