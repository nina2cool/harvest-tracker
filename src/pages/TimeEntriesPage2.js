import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUserId } from '../store/actions/timeEntriesActions'; // Import the new action
import { fetchUsers } from '../store/actions/userActions';
import TimeEntriesList from '../components/TimeEntriesList';
import Loader from '../components/Loader'; // Import the Loader component

const TimeEntriesPage2 = () => {
    
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.users);
    const timeEntriesByUser = useSelector(state => state.timeEntries.timeEntriesByUser); // Get all time entries from Redux
    const selectedWeek = useSelector(state => state.timeEntries.selectedWeek); // Get selected week from Redux
    const [selectedUser, setSelectedUser] = useState(''); // State for selected user
    const [loading, setLoading] = useState(true);
    const [isUserSubmitted, setIsUserSubmitted] = useState(false); // State for user fetch submission
    const [loadingTimeEntries, setLoadingTimeEntries] = useState(false); // State for loading time entries
    const [filteredTimeEntries, setFilteredTimeEntries] = useState([]); // State for filtered time entries

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingTimeEntries(true); // Set loading state to true while fetching time entries

        // Filter time entries by the selected user ID
        const entriesForUser = timeEntriesByUser.find(entry => entry.id === selectedUser); // Find the entry for the selected user ID
        const filteredTimeEntries = entriesForUser ? entriesForUser.timeEntries : []; // If entries exist, use them; otherwise, use an empty array
        console.log("Filtered Time Entries:", filteredTimeEntries);
        console.log("entriesForUser:", entriesForUser);
        setFilteredTimeEntries(filteredTimeEntries); // Set filtered time entries
        setIsUserSubmitted(true); // Set user submission state
        setLoadingTimeEntries(false); // Set loading state to false after fetching
        dispatch(setSelectedUserId(selectedUser)); // Save selected user ID to the store

    };

    useEffect(() => {
        // Fetch users when the component mounts
        dispatch(fetchUsers());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        // Set default user to "Christina" after users are fetched
        if (users.length > 0) {
            const christina = users.find(user => user.first_name === "Christina");
            if (christina) {
                setSelectedUser(christina.id); // Set the selected user to Christina's ID
            }
        }
    }, [users]);

    if (loading) {
        return <Loader />; // Show loader while loading users
    }

    return (
        <div>
            <h1>Time Entries</h1>
            <h2>Step 2: Fetch Time Entries by User</h2>
            <form onSubmit={handleSubmit}>
                <p>Time period: {selectedWeek}</p>
                <label>
                    User:
                    <select name="user" required value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.first_name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Fetch Time Entries</button>
            </form>

            {loadingTimeEntries ? (
                <Loader /> // Show loader while fetching time entries
            ) : (
                isUserSubmitted && <TimeEntriesList userTimeEntries={filteredTimeEntries} /> // Pass filtered entries to TimeEntriesList
            )}
        </div>
    );
};

export default TimeEntriesPage2;
