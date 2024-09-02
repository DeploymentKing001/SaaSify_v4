import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchBusinessAccount } from '../../redux/sideBar/accountInfoSlice';

const Support = () => {
  const dispatch = useDispatch();
  const businessId = useSelector((state) => state.user.id);
  const { data, loading, errorNew } = useSelector((state) => state.businessAccount);

  const [form, setForm] = useState({
    subject: '',
    description: '',
    email: data.email
  });

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinessAccount(businessId));
    }
  }, [businessId, dispatch]);

  useEffect(() => {
    if (data) {
      // Update the form with the fetched email
      setForm((prevForm) => ({
        ...prevForm,
        email: data.email
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/support', {
        ...form,
        businessId
      });
      alert('Support request submitted successfully');
      setForm({
        subject: '',
        description: '',
        email: data.email || '' // Reset with fetched email
      });
    } catch (error) {
      alert('Error submitting support request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (errorNew) return <div>Error: {errorNew}</div>;

  return (
    <div className='w-full max-w-screen-md md:max-w-[80vw] mx-auto flex flex-col px-4 mt-16 md:mt-0 gap-y-3 py-5'>
      <div className='text-xl sm:text-3xl font-semibold'>Support Page</div>
      <div className='text-xs sm:text-sm opacity-60'>Got a problem? We are here for you!</div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-3'>
        <div className='mt-2 flex flex-col gap-y-1 text-sm'>
          <div className="label">Subject</div>
          <input
            type='text'
            name='subject'
            value={form.subject}
            onChange={handleChange}
            placeholder='Give a short intro for your problem'
            className='px-3 w-full py-2 rounded-lg bg-[#F0F5F2]'
            required
          />
        </div>
        <div className='mt-2 flex flex-col gap-y-1 text-sm'>
          <div className="label">Description</div>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder='Give a short intro for your problem'
            className='px-3 w-full py-2 h-48 rounded-lg bg-[#F0F5F2]'
            required
          />
        </div>
        <div className='mt-2 flex flex-col gap-y-1 text-sm'>
          <div className="label">Email</div>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Your email address'
            className='px-3 w-full py-2 rounded-lg bg-[#F0F5F2]'
            required
          />
        </div>
        <div className='flex w-full justify-end'>
          <button
            type='submit'
            className='bg-[#000929] px-3 py-1 rounded-md text-white hover:bg-blue-400 duration-500 transition-all'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Support;
