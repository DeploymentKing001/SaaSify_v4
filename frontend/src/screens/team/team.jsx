import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchEmployees } from '../../redux/sideBar/employeesSlice.js';

// import images
import search from '../../assets/images/icons8-search-48.png';

const Team = () => {
  const businessId = useSelector((state) => state.user.id);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: 'employee',
    email: '',
    password: '',
    role: '',
  });
  const [updateForm, setUpdateForm] = useState(false); // State for update form visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee
  const [searchTerm, setSearchTerm] = useState(''); // State to track search input
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees(businessId));
  }, [dispatch, businessId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/employee/register', {
        ...formData,
        businessId,
      });
      alert('Employee registered successfully');
      dispatch(fetchEmployees(businessId));
      setShowForm(false);
      setFormData({
        name: '',
        designation: 'employee',
        email: '',
        password: '',
        role: '',
      });
    } catch (error) {
      console.error('Error registering employee:', error);
      alert('Failed to register employee');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/employee/${formData.id}`, {
        ...formData,
        businessId,
      });
      alert('Employee updated successfully');
      dispatch(fetchEmployees(businessId));
      setUpdateForm(false);
      setSelectedEmployee(null);
      setFormData({
        name: '',
        designation: 'employee',
        email: '',
        password: '',
        role: '',
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleModifyClick = (employee) => {
    setSelectedEmployee(employee._id);

    setFormData({
      id: employee._id,
      name: employee.name,
      designation: employee.designation,
      email: employee.email,
      password: '', // Reset password field
      role: employee.role,
    });
    setUpdateForm(true);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteMembers = () => {
    setShowForm(true)
    setFormData({
      name: '',
      designation: 'employee',
      email: '',
      password: '',
      role: '',
    });
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/employee/${id}`);
        alert('Employee deleted successfully');
        dispatch(fetchEmployees(businessId));
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  return (
    <div className='w-full max-w-screen-md md:max-w-[80vw] mx-auto flex flex-col px-4 mt-16 md:mt-0 gap-y-3 py-5'>
      <div className='w-full flex flex-row md:flex-row justify-between items-start md:items-center'>
        <div className='text-2xl md:text-3xl font-semibold mb-2 md:mb-0'>Members</div>
        <div
          className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all font-medium'
          onClick={handleInviteMembers}
        >
          Invite members
        </div>
      </div>
      <div className='text-xs opacity-60 mb-2'>Manage your team</div>
      <div className='flex flex-row md:justify-between items-start md:items-center gap-y-2 gap-x-3'>
        <div className='w-full bg-[#E8F2E8] rounded-md px-3 py-1 flex items-center gap-x-2 md:gap-x-4 hover:bg-[#CED6CE] duration-500 transition-all'>
          <div><img src={search} className='w-6 md:w-8' alt='search' /></div>
          <input
            type="text"
            placeholder='Search by name or email'
            className='bg-transparent outline-none py-1 w-full'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {showForm && (
        <div className='bg-white border rounded-md p-4 mt-4'>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Role</label>
              <input
                type='text'
                name='role'
                value={formData.role}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <button type='submit' className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all'>
              Register Employee
            </button>
            <button onClick={() => { setShowForm(false) }} className='bg-red-500 px-3 py-2 ml-3 rounded-md text-xs cursor-pointer hover:bg-red-600 duration-500 transition-all'>
              Cancel
            </button>
          </form>
        </div>
      )}

      {updateForm && (
        <div className='bg-white border rounded-md p-4 mt-4'>
          <form onSubmit={handleUpdateSubmit}>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                placeholder='Leave empty to keep current password'
              />
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-medium'>Role</label>
              <input
                type='text'
                name='role'
                value={formData.role}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
                required
              />
            </div>
            <button type='submit' className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all'>
              Confirm Modify
            </button>
            <button type='button' className='bg-red-500 px-3 py-2 rounded-md text-xs text-white cursor-pointer hover:bg-red-600 duration-500 transition-all ml-2' onClick={() => setUpdateForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className='mt-4'>
        <div className='rounded-md overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-[#E8F2E8]'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-s-md'>Name</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>Email</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>Password</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>Role</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>Actions</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-e-md'>Delete</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {status === 'loading' && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-sm text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              )}
              {status === 'failed' && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-sm text-red-500">
                    Failed to load employees: {error}
                  </td>
                </tr>
              )}
              {status === 'succeeded' && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-sm text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
              {status === 'succeeded' && filteredEmployees.map((employee) => (
                <tr key={employee._id} className='hover:bg-gray-100 transition-all duration-300'>
                  <td className='px-4 py-3 text-sm text-gray-800'>{employee.name}</td>
                  <td className='px-4 py-3 text-sm text-gray-800'>{employee.email}</td>
                  <td className='px-4 py-3 text-sm text-gray-800'>******</td>
                  <td className='px-4 py-3 text-sm text-gray-800'>{employee.role}</td>
                  <td className='px-4 py-3'>
                    <button className='bg-blue-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-blue-600 transition-all duration-300' onClick={() => {handleModifyClick(employee)}}>
                      Modify
                    </button>
                  </td>
                  <td className='px-4 py-3'>
                    <button className='bg-red-500 px-4 py-2 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-all duration-300' onClick={() => {handleDeleteEmployee(employee._id)}}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
