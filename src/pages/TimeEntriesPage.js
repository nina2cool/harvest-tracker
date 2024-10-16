import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../store/actions/timeEntriesActions';

const TimeEntriesPage = () => {
    const dispatch = useDispatch();
    const timeEntries = useSelector(state => state.timeEntries);

    useEffect(() => {
        dispatch(fetchTimeEntries());
    }, [dispatch]);

    return (
        <div>
            <h1>Time Entries</h1>
            <ul>
                {timeEntries.map(entry => (
                    <li key={entry.id}>{entry.description} - {entry.hours} hours</li>
                ))}
            </ul>
        </div>
    );
};

export default TimeEntriesPage;