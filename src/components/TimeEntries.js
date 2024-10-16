import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../store/actions/timeEntriesActions';

const TimeEntries = () => {
    const dispatch = useDispatch();
    const { timeEntries, loading, error } = useSelector((state) => state.timeEntries);

    useEffect(() => {
        // Fetch time entries when the component mounts
        dispatch(fetchTimeEntries('2024-10-01', '2024-10-31')); // Example dates
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Time Entries</h2>
            <ul>
                {timeEntries.map((entry) => (
                    <li key={entry.id}>
                        {entry.spent_date}: {entry.hours} hours on {entry.project_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TimeEntries;