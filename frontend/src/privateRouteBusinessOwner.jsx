import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from "./redux/sideBar/authenticationSlice";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
    const userRed = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/me', { withCredentials: true });
                const data = response.data.user;
                dispatch(setUser({ id: data.id, designation: data.platformRole, name: data.ownerName }));
            } catch (error) {
                if (error.response) console.error('Error response:', error.response.data.error);
                else console.error('Error:', error.message);
            } finally {
                setIsLoading(false);  // Set loading to false once done
            }
        };
        authenticate();
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;  // Show a loading indicator while fetching user data
    }

    return (
        userRed.designation === 'business owner' ? <Outlet /> : <Navigate to='/login' />
    );
}

export default PrivateRoute;
