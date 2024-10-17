import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/actions/userActions';

const UsersPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Function to convert seconds to hours
    const secondsToHours = (seconds) => {
        return (seconds / 3600).toFixed(2); // Convert seconds to hours and format to 2 decimal places
    };

    return (
        <div className='container mx-auto p-4'>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.first_name} {user.last_name}: Weekly capacity {secondsToHours(user.weekly_capacity)} hours</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;