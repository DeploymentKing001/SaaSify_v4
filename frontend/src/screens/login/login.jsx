import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../../redux/sideBar/authenticationSlice.js';
import { fetchBusinessAccount } from '../../redux/sideBar/accountInfoSlice.js'

// import images
import Login1 from '../../assets/images/Login 1.png';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data, loading, errorNew } = useSelector((state) => state.businessAccount);

    // State variables for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Include cookies with the request
            });

            if (response.ok) {
                const result = await response.json();
                navigate('/dashboard');

                try {
                    const response = await axios.get('http://localhost:3000/api/me', {
                        withCredentials: true, // Include cookies in the request
                    });
                    const data = response.data.user;

                    dispatch(logout())
                    dispatch(setUser({ id: data.id, designation: data.platformRole, isAdmin: false, name: data.ownerName }));
                    dispatch(fetchBusinessAccount(data.id));
                } catch (error) {
                    if (error.response) {
                        console.error('Error response:', error.response.data.error);
                    } else {
                        console.error('Error:', error.message);
                    }
                }
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (errorNew) return <div>Error: {errorNew}</div>;

    return (
        <div>
            <div className='page font-poppins'>
                <div className="first flex flex-col sm:flex-row justify-around items-center w-full overflow-hidden py-4">
                    <div className='w-full md:w-auto flex justify-center'>
                        <img src={Login1} className='max-w-full md:max-w-xl max-h-[85vh]'></img>
                    </div>
                    <div className='w-full md:w-1/3 flex flex-col gap-y-3 p-4 md:p-0'>
                        <div className='text-lg md:text-xl text-center font-bold'>
                            Sign In
                        </div>
                        {error && (
                            <div className="text-red-500 text-center mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                                <div className="label">Email</div>
                                <input
                                    type='text'
                                    placeholder='you@example.com'
                                    className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                                <div className="label">Password</div>
                                <input
                                    type='password'
                                    placeholder='************'
                                    className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className='opacity-60 text-xs hover:underline my-2 md:ml-0 ml-6 hover:cursor-pointer'>Forgot your password?</div>
                            <div>
                                <button
                                    type='submit'
                                    className='bg-[#AFF911] sm:w-11/12 w-[86%] py-2 rounded-lg font-semibold sm:ml-0 ml-6 hover:bg-[#89CA00] transition-all duration-500'
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <div className='opacity-60 text-xs md:ml-0 ml-6'>Don't have an account?</div>
                        <div>
                            <button
                                className='bg-[#F0F5F2] sm:w-11/12 w-[86%] py-2 rounded-lg font-semibold sm:ml-0 ml-6 hover:bg-[#B8B8B8] transition-all duration-500'
                                onClick={() => { navigate('/register') }}
                            >
                                Create an account
                            </button>
                        </div>
                        <div className='opacity-60 text-xs md:ml-0 ml-6'>Have an Employee account? Sign in below!</div>
                        <div>
                            <button
                                className='bg-[#81D9F5] sm:w-11/12 w-[86%] py-2 rounded-lg font-semibold sm:ml-0 ml-6 hover:bg-[#35A5C8] transition-all duration-500'
                                onClick={() => { navigate('/login-employee') }}
                            >
                                Employee Sign in
                            </button>
                        </div>
                        <div className='opacity-60 text-xs md:ml-0 ml-6'>Have an Admin account? Sign in below!</div>
                        <div>
                            <button
                                className='bg-[#8ba80b] sm:w-11/12 w-[86%] py-2 rounded-lg font-semibold sm:ml-0 ml-6 hover:bg-[#48450a] transition-all duration-500'
                                onClick={() => { navigate('/login-admin') }}
                            >
                                Admin Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
