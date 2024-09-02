import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser, logout } from '../../redux/sideBar/authenticationSlice';
import { useDispatch } from 'react-redux';

// import images
import Login1 from '../../assets/images/Login 1.png';

const LoginEmployee = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies with the request
      });

      if (response.status === 200) {
        try {
          const response = await axios.get('http://localhost:3000/api/me', {
            withCredentials: true, // Include cookies in the request
          });

          const data = response.data.user;

          // Example action dispatch (you'll need to integrate with your actual setup)
          dispatch(logout());
          dispatch(setUser({ id: data.businessId, designation: data.platformRole, isAdmin: false, name: data.name}));

          navigate('/messages-employee'); // Redirect to a protected route
        } catch (error) {
          if (error.response) {
            console.error('Error response:', error.response.data.error);
          } else {
            console.error('Error:', error.message);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <div className='page font-poppins'>
        <div className="first flex flex-col sm:flex-row justify-around items-center w-full overflow-hidden py-4">
          <div className='w-full md:w-auto flex justify-center'>
            <img src={Login1} className='max-w-full md:max-w-xl max-h-[85vh]' alt="Login" />
          </div>
          <div className='w-full md:w-1/3 flex flex-col gap-y-3 p-4 md:p-0'>
            <div className='text-lg md:text-xl text-center font-bold'>
              Employee Sign in
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-y-2 sm:ml-0 ml-6'>
              <div className="flex flex-col gap-y-2">
                <div className="label">Email</div>
                <input
                  type='text'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="label">Password</div>
                <input
                  type='password'
                  placeholder='************'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='px-3 w-11/12 py-2 rounded-lg outline-1 outline-slate-300 outline'
                />
              </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button
                type='submit'
                className='bg-[#AFF911] sm:w-11/12 w-[92%] py-2 rounded-lg font-semibold hover:bg-[#89CA00] transition-all duration-500'
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginEmployee;
