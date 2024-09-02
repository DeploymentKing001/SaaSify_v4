import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchUsers } from '../../redux/sideBar/userSlice.js'; // Adjust import to usersSlice

// import images
import search from '../../assets/images/icons8-search-48.png';

const Team = () => {
    const businessId = useSelector((state) => state.user.id);
    const [showForm, setShowForm] = useState(false);
    const [employeeCounts, setEmployeeCounts] = useState({});
    const [formData, setFormData] = useState({
        businessName: '',
        designation: 'business owner',
        ownerName: '',
        email: '',
        password: '',
        platformRole: 'business owner', // Default role
    });
    const [updateForm, setUpdateForm] = useState(false); // State for update form visibility
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const [searchTerm, setSearchTerm] = useState(''); // State to track search input
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.userUltimate);

    useEffect(() => {
        dispatch(fetchUsers(businessId));
    }, [dispatch, businessId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', {
                ...formData,
                businessAccountId: businessId,
            });
            alert('User registered successfully');
            dispatch(fetchUsers(businessId));
            setShowForm(false);
            setFormData({
                businessName: '',
                designation: 'business owner',
                ownerName: '',
                email: '',
                password: '',
                platformRole: 'business owner',
            });
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to register user');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/clients/${formData.id}`, {
                ...formData,
                businessAccountId: businessId,
            });
            alert('User updated successfully');
            dispatch(fetchUsers(businessId));
            setUpdateForm(false);
            setSelectedUser(null);
            setFormData({
                businessName: '',
                designation: 'business owner',
                ownerName: '',
                email: '',
                password: '',
                platformRole: 'business owner',
            });
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleModifyClick = (user) => {
        setSelectedUser(user._id);

        setFormData({
            id: user._id,
            businessName: user.businessName,
            ownerName: user.ownerName,
            email: user.email,
            password: '', // Reset password field
            platformRole: 'business owner',
        });
        setUpdateForm(true);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInviteMembers = () => {
        setShowForm(true);
        setFormData({
            businessName: '',
            designation: 'business owner',
            ownerName: '',
            email: '',
            password: '',
            platformRole: 'business owner',
        });
    };

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/user/${id}`);
                alert('User deleted successfully');
                dispatch(fetchUsers(businessId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const getEmployeeCount = async (businessId) => {
        try {
            const response = await axios.get('http://localhost:3000/api/employees/count', {
                params: { businessId }
            });
            return response.data.count;
        } catch (error) {
            console.error('Error fetching employee count:', error);
            throw error;
        } finally {

        }
    };

    useEffect(() => {
        const fetchEmployeeCounts = async () => {
            try {
                const counts = await Promise.all(
                    users.map(async (user) => {
                        const count = await getEmployeeCount(user._id);
                        return { id: user._id, count };
                    })
                );

                // Convert array to an object where key is user ID and value is the employee count
                const countsObj = counts.reduce((acc, item) => {
                    acc[item.id] = item.count;
                    return acc;
                }, {});

                setEmployeeCounts(countsObj);
            } catch (error) {
                console.error('Error fetching employee counts:', error);
            }
        };

        if (users.length > 0) {
            fetchEmployeeCounts();
        }
    }, [users]);


    return (
        <div className='w-full max-w-screen-md md:max-w-[80vw] mx-auto flex flex-col px-4 mt-9 md:mt-0 gap-y-3 py-5'>
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center'>
                <div className='text-2xl md:text-3xl font-semibold mb-2 md:mb-0'>Users</div>
                <div
                    className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all font-medium'
                    onClick={handleInviteMembers}
                >
                    Add Users
                </div>
            </div>
            <div className='text-xs opacity-60 mb-2'>Manage your users</div>
            <div className='flex flex-col md:flex-row md:justify-between items-start md:items-center gap-y-2 gap-x-3'>
                <div className='w-full bg-[#E8F2E8] rounded-md px-3 py-1 flex items-center gap-x-2 md:gap-x-4 hover:bg-[#CED6CE] duration-500 transition-all'>
                    <div><img src={search} className='w-6 md:w-8' alt='search' /></div>
                    <input
                        type="text"
                        placeholder='Search by business name or email'
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
                            <label className='block text-sm font-medium'>Business Name</label>
                            <input
                                type='text'
                                name='businessName'
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className='w-full border rounded px-3 py-2'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='block text-sm font-medium'>Owner Name</label>
                            <input
                                type='text'
                                name='ownerName'
                                value={formData.ownerName}
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
                            <label className='block text-sm font-medium'>Platform Role</label>
                            <input
                                type='text'
                                name='platformRole'
                                value={formData.platformRole}
                                onChange={handleInputChange}
                                className='w-full border rounded px-3 py-2'
                                required
                            />
                        </div>
                        <button type='submit' className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all'>
                            Register User
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
                            <label className='block text-sm font-medium'>Business Name</label>
                            <input
                                type='text'
                                name='businessName'
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className='w-full border rounded px-3 py-2'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='block text-sm font-medium'>Owner Name</label>
                            <input
                                type='text'
                                name='ownerName'
                                value={formData.ownerName}
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
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='block text-sm font-medium'>Platform Role</label>
                            <input
                                type='text'
                                name='platformRole'
                                value={formData.platformRole}
                                onChange={handleInputChange}
                                className='w-full border rounded px-3 py-2'
                                required
                            />
                        </div>
                        <button type='submit' className='bg-[#E8F2E8] px-3 py-2 rounded-md text-xs cursor-pointer hover:bg-[#CED6CE] duration-500 transition-all'>
                            Update User
                        </button>
                        <button onClick={() => { setUpdateForm(false) }} className='bg-red-500 px-3 py-2 ml-3 rounded-md text-xs cursor-pointer hover:bg-red-600 duration-500 transition-all'>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {status === 'loading' && <div>Loading...</div>}
            {status === 'failed' && <div>Error: {error}</div>}

            <div className='overflow-x-auto mt-4'>
                <table className='min-w-full bg-white'>
                    <thead className=''>
                        <tr className='bg-[#E8F2E8]'>
                            <th className='py-3 px-5 text-left rounded-s-md text-sm font-semibold text-gray-700'>Business Name</th>
                            <th className='py-3 px-5 text-left text-sm font-semibold text-gray-700'>Owner Name</th>
                            <th className='py-3 px-5 text-left text-sm font-semibold text-gray-700'>Email</th>
                            <th className='py-3 px-5 text-left text-sm font-semibold text-gray-700'>Employees</th>
                            <th className='py-3 px-5 text-left text-sm font-semibold text-gray-700'>Actions</th>
                            <th className='py-3 px-5 text-left rounded-e-md text-sm font-semibold text-gray-700'>Delete</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className='hover:bg-gray-100 transition-all duration-300'>
                                <td className='py-3 px-5 text-sm text-gray-800'>{user.businessName}</td>
                                <td className='py-3 px-5 text-sm text-gray-800'>{user.ownerName}</td>
                                <td className='py-3 px-5 text-sm text-gray-800'>{user.email}</td>
                                <td className='py-3 px-5 text-sm text-gray-800'>{employeeCounts[user._id]}</td>
                                <td className='py-3 px-5'>
                                    <button
                                        className='bg-blue-500 px-4 py-1 rounded-full text-white mr-2 text-xs font-medium cursor-pointer hover:bg-blue-600 transition-all duration-300 shadow-sm'
                                        onClick={() => handleModifyClick(user)}
                                    >
                                        Modify
                                    </button>
                                </td>
                                <td className='py-3 px-5'>
                                    <button
                                        className='bg-red-500 px-4 py-1 rounded-full text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-all duration-300 shadow-sm'
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Team;
