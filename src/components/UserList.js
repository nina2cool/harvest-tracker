import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/actions/userActions';
import Loader from './Loader';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users); // Include loading and error states

    useEffect(() => {
        // Fetch users when the component mounts
        dispatch(fetchUsers());
    }, [dispatch]);

    // Function to convert seconds to hours
    const secondsToHours = (seconds) => {
        return seconds ? (seconds / 3600).toFixed(2) : '0.00'; // Convert seconds to hours and format to 2 decimal places
    };

    // Sort users by first name only if users are available
    const sortedUsers = users.length > 0 ? [...users].sort((a, b) => {
        return a.first_name.localeCompare(b.first_name); // Sort by first name
    }) : [];

    if (loading) {
        return <Loader />; // Show loader while loading users
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message if there's an error
    }

    return (
        <div>
            {sortedUsers.length === 0 ? ( // Check if there are no users
                <p>No users available.</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Weekly Capacity (Hours)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{secondsToHours(user.weekly_capacity)} hours</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;
