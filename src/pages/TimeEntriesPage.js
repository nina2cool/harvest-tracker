import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../store/actions/timeEntriesActions';
import { fetchUsers } from '../store/actions/userActions';
import TimeEntriesList from '../components/TimeEntriesList';

const TimeEntriesPage = () => {
    const dispatch = useDispatch();
    const timeEntries = useSelector(state => state.timeEntries.timeEntries);
    const users = useSelector(state => state.users.users);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedUser, setSelectedUser] = useState(''); // Keep this for initial state
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false); // New state variable

    const handleSubmit = (e) => {
        e.preventDefault();
        const userSelect = e.target.elements.user; // Get the select element
        const userId = userSelect.value; // Get the selected user ID
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        console.log("selectedUser", userId); // Log the selected user ID
        dispatch(fetchTimeEntries(startDate, endDate, userId)); // Pass parameters to the action
        setIsSubmitted(true); // Set isSubmitted to true
        setSelectedUser(userId);
    };

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchUsers());
            await dispatch(fetchTimeEntries());
            setLoading(false);
        };
        fetchData();
    }, [dispatch]);

    console.log(timeEntries);
    console.log(users);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Time Entries</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Start Date:
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    End Date:
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    User:
                    <select name="user" required> {/* Add name attribute for easy access */}
                        <option value="">Select a user</option> {/* Optional: Add a default option */}
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.first_name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Fetch Time Entries</button>
            </form>
            {isSubmitted && ( // Conditionally render TimeEntriesList
                <TimeEntriesList timeEntries={timeEntries} startDate={startDate} endDate={endDate} selectedUser={selectedUser} />
            )}
        </div>
    );
};

export default TimeEntriesPage;
