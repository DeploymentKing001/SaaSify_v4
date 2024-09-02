import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../../redux/sideBar/authenticationSlice.js';

// import images
import Register1 from '../../assets/images/Register 1.png';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/register', formData, { withCredentials: true });
            if (response.status == 201) {
                navigate('/dashboard');
                try {
                    const response = await axios.get('http://localhost:3000/api/me', {
                        withCredentials: true, // Include cookies in the request
                    });

                    const data = response.data.user;

                    dispatch(logout())
                    dispatch(setUser({ id: data.id, designation: data.platformRole, name: data.ownerName }));
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
            console.log(err);
        }
    };

    return (
        <div className='page font-poppins'>
            <div className="first flex flex-col sm:flex-row justify-around items-center w-full overflow-hidden py-4">
                <div className='w-full md:w-auto flex justify-center'>
                    <img src={Register1} className='max-w-full md:max-w-xl max-h-[85vh]'></img>
                </div>
                <div className='w-full md:w-1/3 flex flex-col mt-2 p-4 md:p-0'>
                    <div className='text-lg md:text-xl text-center font-bold'>
                        Registration
                    </div>
                    <form onSubmit={handleSubmit}>
                        {error && <div className='text-red-500'>{error}</div>}
                        <div mt-2me='flex flex-col gap-y-2 sm:ml-0 ml-6'>
                            <div className="label">Business Name</div>
                            <input
                                type='text'
                                name='businessName'
                                placeholder='Enter your business name'
                                value={formData.businessName}
                                onChange={handleChange}
                                className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                required
                            />
                        </div>
                        <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                            <div className="label">Owner’s Name</div>
                            <input
                                type='text'
                                name='ownerName'
                                placeholder='Enter your full name'
                                value={formData.ownerName}
                                onChange={handleChange}
                                className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                required
                            />
                        </div>
                        <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                            <div className="label">Email</div>
                            <input
                                type='email'
                                name='email'
                                placeholder='you@example.com'
                                value={formData.email}
                                onChange={handleChange}
                                className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                required
                            />
                        </div>
                        <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                            <div className="label">Password</div>
                            <input
                                type='password'
                                name='password'
                                placeholder='************'
                                value={formData.password}
                                onChange={handleChange}
                                className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                required
                            />
                        </div>
                        <div className='flex flex-col mt-2 sm:ml-0 ml-6'>
                            <div className="label">Confirm Password</div>
                            <input
                                type='password'
                                name='confirmPassword'
                                placeholder='************'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                                required
                            />
                        </div>
                        <div className='opacity-60 md:ml-0 ml-6 text-xs my-2 hover:underline hover:cursor-pointer' onClick={() => { navigate('/login'); }}>
                            Have an account?
                        </div>
                        <div>
                            <button type='submit' className='bg-[#AFF911] sm:w-11/12 w-[86%] py-2 rounded-lg font-semibold sm:ml-0 ml-6 hover:bg-[#89CA00] transition-all duration-500'>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
