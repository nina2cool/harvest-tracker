import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/actions/userActions';
import { setSplitTimeEntries } from '../store/actions/timeEntriesActions';
import Loader from './Loader';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SelectedEntriesTable = ({ selectedHarvestEntries }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const entryType = useSelector(state => state.timeEntries.entryType); // Get entry type from Redux store
    const splitTimeEntries = useSelector(state => state.timeEntries.splitTimeEntries); // Get split time entries from Redux store
    const users = useSelector(state => state.users.users);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users when the component mounts
        dispatch(fetchUsers());
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return <Loader />; // Show loader while loading users
    }

    const handleSplitTimeChange = (entryId) => {
        const entry = selectedHarvestEntries.find(e => e.id === entryId);
        const isChecked = !splitTimeEntries.some(e => e.originalEntry.id === entryId); // Check if the entry is already in the array

        let newSplitTimeEntries;
        if (isChecked) {
            // Add the entry to the array with correspondingUserId set to false and splitType set to 'proportional'
            newSplitTimeEntries = [
                ...splitTimeEntries,
                {
                    originalEntry: entry, // Add the entire entry object
                    correspondingUserId: false, // Set to false initially
                    splitType: 'proportional' // Default split type
                }
            ];
        } else {
            // Remove the entry from the array
            newSplitTimeEntries = splitTimeEntries.filter(e => e.originalEntry.id !== entryId);
        }
        
        dispatch(setSplitTimeEntries(newSplitTimeEntries)); // Dispatch action to update split time entries
    };

    const handleUserChange = (entryId, userId) => {
        const updatedEntries = splitTimeEntries.map(entry => {
            if (entry.originalEntry.id === entryId) {
                return {
                    ...entry,
                    correspondingUserId: userId || false // Set to userId or false if no user is selected
                };
            }
            return entry;
        });

        dispatch(setSplitTimeEntries(updatedEntries)); // Dispatch action to update the corresponding user ID
    };

    const handleSplitTypeChange = (entryId, splitType) => {
        const updatedEntries = splitTimeEntries.map(entry => {
            if (entry.originalEntry.id === entryId) {
                return {
                    ...entry,
                    splitType: splitType // Update the splitType
                };
            }
            return entry;
        });

        dispatch(setSplitTimeEntries(updatedEntries)); // Dispatch action to update the split type
    };

    // Check if all required users are selected
    const allUsersSelected = selectedHarvestEntries.every(entry => {
        return !splitTimeEntries.some(e => e.originalEntry.id === entry.id) || 
               (splitTimeEntries.some(e => e.originalEntry.id === entry.id) && splitTimeEntries.find(e => e.originalEntry.id === entry.id).correspondingUserId);
    });

    const handleReadyToSplit = () => {
        // Navigate to time-entries-page-4
        navigate('/time-entries-step-4');
    };

    return (
        <div>
            <h2>Selected Entries</h2>
            {selectedHarvestEntries.length > 0 ? (
                <table className="selected-entries-table">
                    <thead>
                        <tr>
                            <th>Project Code</th>
                            <th>Notes</th>
                            <th>Hours</th>
                            {entryType === '1x1' && <th>Split This Time</th>} {/* New column for split time */}
                            {entryType === '1x1' && <th>Split Type</th>} {/* New column for split type */}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedHarvestEntries.map(entry => (
                            <tr key={entry.id}>
                                <td>{entry.project.code}</td>
                                <td>{entry.notes}</td>
                                <td>{entry.hours}</td>
                                {entryType === '1x1' && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={splitTimeEntries.some(e => e.originalEntry.id === entry.id)} // Check if the split time checkbox is selected
                                            onChange={() => handleSplitTimeChange(entry.id)} // Handle split time checkbox change
                                        />
                                        {splitTimeEntries.some(e => e.originalEntry.id === entry.id) && ( // Show dropdown if split time is checked
                                            <select
                                                value={splitTimeEntries.find(e => e.originalEntry.id === entry.id)?.correspondingUserId || ''} // Set the value of the dropdown
                                                onChange={(e) => handleUserChange(entry.id, e.target.value)} // Handle user selection
                                            >
                                                <option value="">Select User</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.first_name} {/* Assuming user has an id and first_name */}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                )}
                                {entryType === '1x1' && (
                                    <td>
                                        {splitTimeEntries.some(e => e.originalEntry.id === entry.id) && ( // Show split type dropdown if split time is checked
                                            <select
                                                value={splitTimeEntries.find(e => e.originalEntry.id === entry.id)?.splitType || 'proportional'} // Set the value of the dropdown
                                                onChange={(e) => handleSplitTypeChange(entry.id, e.target.value)} // Handle split type selection
                                            >
                                                <option value="proportional">Proportional</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No selected entries found.</p>
            )}
            {entryType === '1x1' && allUsersSelected && ( // Show button if all required users are selected
                <Button variant="success" onClick={handleReadyToSplit}>Ready to Split</Button> // Add onClick handler
            )}
        </div>
    );
};

export default SelectedEntriesTable;
