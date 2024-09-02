import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/sideBar/authenticationSlice.js';
import axios from 'axios';
import UserNav from './components/navbars/usernav.jsx';
import Footer from './components/footer/footer.jsx';
import ClientNav from './components/navbars/clientNav.jsx';
import ClientSideNav from './components/sideNav/clientSideNav.jsx';
import AdminSideNav from './components/sideNav/adminSideNav.jsx';
import EmployeeSideNav from './components/sideNav/employeeSideNav.jsx';
import Home from './screens/home.jsx';
import Guide from './screens/guide/guide.jsx';
import Register from './screens/register/register.jsx';
import Login from './screens/login/login.jsx';
import LoginEmployee from './screens/login/loginEmployee.jsx';
import LoginAdmin from './screens/login/loginAdmin.jsx';
import Settings from './screens/settings/settings.jsx';
import Team from './screens/team/team.jsx';
import Dashboard from './screens/dashboard/dashboard.jsx';
import Messages from './screens/messages/messages.jsx';
import Support from './screens/support/support.jsx';
import AdminDashboard from './screens/dashboard/dashboardAdmin.jsx';
import AdminTeam from './screens/team/teamAdmin.jsx';
import AdminSupport from './screens/support/supportAdmin.jsx';
import BulkImport from './screens/bulkImport/bulkImport.jsx';
import BulkImportEmployee from './screens/bulkImport/bulkImportEmployee.jsx';
import TemplateManagement from './screens/templateManagement/templateManagement.jsx'
import TemplateManagementEmployee from './screens/templateManagement/templateManagementEmployee.jsx'
import BroadCast from './screens/broadCast/broadCast.jsx';
import Notification from './screens/notification/notification.jsx';

import Test1 from './screens/tests/test1.jsx';
import NotFound from './screens/notFound.jsx'

import PrivateRouteBusinessOwner from './privateRouteBusinessOwner.jsx'
import PrivateRouteEmployee from './privateRouteEmployee.jsx'
import PrivateRouteAdmin from './privateRouteAdmin.jsx'
import { useEffect } from 'react';

const routes = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const authenticate = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/me', { withCredentials: true });
                const data = response.data.user;

                if (data.platformRole == 'business owner') {
                    dispatch(setUser({ id: data.id, designation: data.platformRole, name: data.ownerName }));
                } else if (data.platformRole == 'employee') {
                    dispatch(setUser({ id: data.businessId, designation: data.platformRole, name: data.name }));
                }
            } catch (error) {
                if (error.response) console.error('Error response:', error.response.data.error);
                else console.error('Error:', error.message);
            }
        };
        authenticate();
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Test Route */}
                <Route path='/test-1' element={<><Test1 /></>} />

                {/* Not Logged In */}
                <Route path='/' element={<><UserNav /><Home /><Footer /></>} />
                <Route path='/hom' element={<><UserNav /><Home /><Footer /></>} />
                <Route path='/guide' element={<><UserNav /><Guide /><Footer /></>} />
                <Route path='/register' element={<><UserNav /><Register /><Footer /></>} />
                <Route path='/login' element={<><UserNav /><Login /><Footer /></>} />
                <Route path='/login-employee' element={<><UserNav /><LoginEmployee /><Footer /></>} />
                <Route path='/login-admin' element={<><UserNav /><LoginAdmin /><Footer /></>} />

                {/* Business Owner Routes */}
                <Route element={<PrivateRouteBusinessOwner />}>
                    <Route path='/settings' element={<><ClientNav /><div className='flex'><ClientSideNav /><Settings /></div><Footer /></>} />
                    <Route path='/dashboard' element={<><ClientNav /><div className='flex'><ClientSideNav /><Dashboard /></div><Footer /></>} />
                    <Route path='/messages' element={<><ClientNav /><div className='flex'><ClientSideNav /><Messages /></div><Footer /></>} />
                    <Route path='/team' element={<><ClientNav /><div className='flex'><ClientSideNav /><Team /></div><Footer /></>} />
                    <Route path='/bulk-import' element={<><ClientNav /><div className='flex'><ClientSideNav /><BulkImport /></div><Footer /></>} />
                    <Route path='/template-management' element={<><ClientNav /><div className='flex'><ClientSideNav /><TemplateManagement /></div><Footer /></>} />
                    <Route path='/support' element={<><ClientNav /><div className='flex'><ClientSideNav /><Support /></div><Footer /></>} />
                    <Route path='/broadcast' element={<><ClientNav /><div className='flex'><ClientSideNav /><BroadCast /></div><Footer /></>} />
                </Route>

                {/* Employee Only Route */}
                <Route element={<PrivateRouteEmployee />}>
                    <Route path='/messages-employee' element={<><ClientNav /><div className='flex'><EmployeeSideNav /><Messages /></div><Footer /></>} />
                    <Route path='/bulk-import-employee' element={<><ClientNav /><div className='flex'><EmployeeSideNav /><BulkImportEmployee /></div><Footer /></>} />
                    <Route path='/template-management-employee' element={<><ClientNav /><div className='flex'><EmployeeSideNav /><TemplateManagementEmployee /></div><Footer /></>} />
                    <Route path='/broadcast-employee' element={<><ClientNav /><div className='flex'><EmployeeSideNav /><BroadCast /></div><Footer /></>} />
                </Route>

                {/* Admin Routes */}
                <Route element={<PrivateRouteAdmin />}>
                    <Route path='/dashboard-admin' element={<><ClientNav /><div className='flex'><AdminSideNav /><AdminDashboard /></div><Footer /></>} />
                    <Route path='/team-admin' element={<><ClientNav /><div className='flex'><AdminSideNav /><AdminTeam /></div><Footer /></>} />
                    <Route path='/notifications-admin' element={<><ClientNav /><div className='flex'><AdminSideNav /><Notification /></div><Footer /></>} />
                    <Route path='/support-admin' element={<><ClientNav /><div className='flex'><AdminSideNav /><AdminSupport /></div><Footer /></>} />
                </Route>

                {/* 404 Not Found Route */}
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default routes;
