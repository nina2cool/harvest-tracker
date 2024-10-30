import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setSelectedEntries, setEntryType } from '../store/actions/timeEntriesActions'; // Import the actions

const TimeEntriesList = ({ userTimeEntries }) => {

    console.log("userTimeEntries", userTimeEntries);

    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const dispatch = useDispatch(); // Initialize dispatch
    const [selectedEntries, setSelectedEntriesState] = useState({});

    const handleCheckboxChange = (entryId) => {
        setSelectedEntriesState(prevState => ({
            ...prevState,
            [entryId]: !prevState[entryId] // Toggle the selected state
        }));
    };

    const handleSelectAll1x1 = () => {
        const entriesToSelect = userTimeEntries.filter(entry => entry.notes.includes("1x1")); // Filter entries with "1x1" in the description
        const newSelectedEntries = {};

        entriesToSelect.forEach(entry => {
            newSelectedEntries[entry.id] = true; // Mark the entry as selected
        });

        setSelectedEntriesState(newSelectedEntries); // Update the selected entries state
        dispatch(setEntryType('1x1')); // Dispatch action to set entry type to '1x1'
    };

    const handleSelectAllBillToClient = () => {
        const entriesToSelect = userTimeEntries.filter(entry => entry.task && entry.task.name && entry.task.name.includes("bill to client")); // Filter entries with "bill to client" in task.name
        const newSelectedEntries = {};

        entriesToSelect.forEach(entry => {
            newSelectedEntries[entry.id] = true; // Mark the entry as selected
        });

        setSelectedEntriesState(newSelectedEntries); // Update the selected entries state
        dispatch(setEntryType('bill to client')); // Dispatch action to set entry type to 'bill to client'
    };

    const handleSubmit = () => {
        // Create an array of selected entries
        const entriesToDisplay = Object.keys(selectedEntries)
            .filter(entryId => selectedEntries[entryId]) // Filter selected entries
            .map(entryId => userTimeEntries.find(entry => entry.id.toString() === entryId)); // Ensure comparison is consistent

        console.log("entriesToDisplay", entriesToDisplay);
        
        // Dispatch the action to store selected entries in Redux
        dispatch(setSelectedEntries(entriesToDisplay));

        // Navigate to the SelectedEntries component
        navigate('/time-entries-step-3', { state: { selectedEntries: entriesToDisplay } }); // Use navigate instead of history.push
    };

    // Group time entries by date and calculate total hours
    const groupedEntries = userTimeEntries.reduce((acc, entry) => {
        const date = entry.spent_date; // Assuming spent_date is in YYYY-MM-DD format
        const hours = entry.hours; // Assuming hours is a number

        if (!acc[date]) {
            acc[date] = { entries: [], totalHours: 0 }; // Initialize with an array for entries and a totalHours counter
        }
        
        acc[date].entries.push(entry); // Add the entry to the date's entries
        acc[date].totalHours += hours; // Sum the hours for the date

        return acc;
    }, {});

    // Calculate the total hours for all entries and round to two decimal places
    const totalHours = Object.values(groupedEntries).reduce((sum, group) => sum + group.totalHours, 0).toFixed(2);

    return (
        <div>
            <h2>Time Entries</h2>
            <h3>Total Hours for All Entries: {totalHours} hours</h3> {/* Display total hours for all entries */}
            <button onClick={handleSelectAll1x1}>Select All 1x1 Entries</button> {/* Button to select all entries with "1x1" in the description */}
            <button onClick={handleSelectAllBillToClient}>Select All "Bill to Client" Entries</button> {/* Button to select all entries with "bill to client" in task.name */}
            {Object.keys(groupedEntries).length > 0 ? (
                Object.keys(groupedEntries).map(date => {
                    const dailyTotalHours = groupedEntries[date].totalHours.toFixed(2); // Round daily total hours to two decimal places
                    return (
                        <div key={date}>
                            <h3>{date} - Total Hours for This Day: {dailyTotalHours} hours</h3> {/* Display total hours for the day */}
                            <table className="time-entries-table">
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Project Code</th>
                                        <th>Notes</th>
                                        <th>Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedEntries[date].entries.map(entry => (
                                        <tr key={entry.id} className={selectedEntries[entry.id] ? 'selected-row' : ''}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedEntries[entry.id]} // Check if the entry is selected
                                                    onChange={() => handleCheckboxChange(entry.id)} // Handle checkbox change
                                                />
                                            </td>
                                            <td>{entry.project.code}</td>
                                            <td>{entry.notes}</td>
                                            <td>{entry.hours}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            ) : (
                <p>No time entries found.</p>
            )}
            <button onClick={handleSubmit}>Go to Step 3</button> {/* Button to navigate to selected entries */}
        </div>
    );
};

export default TimeEntriesList;
