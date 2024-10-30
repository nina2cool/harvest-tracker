import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SelectedEntries = () => {
    const selectedEntries = useSelector(state => state.timeEntries.selectedEntries); // Get selected entries from Redux store
    const entryType = useSelector(state => state.timeEntries.entryType); // Get entry type from Redux store
    const users = useSelector(state => state.users.users); // Get user list from Redux store
    const [selectedUsers, setSelectedUsers] = useState({}); // State to manage selected users for each entry

    const handleUserSelection = (entryId, userId) => {
        setSelectedUsers(prevState => ({
            ...prevState,
            [entryId]: userId // Set the selected user for the entry
        }));
    };

    // Calculate total hours and total minutes of selected entries
    const totalHours = selectedEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalMinutes = totalHours * 60; // Convert total selected hours to minutes

    return (
        <div>
            <h2>Selected Time Entries</h2>
            {entryType && <h3>Entry Type: {entryType}</h3>}
            {selectedEntries.length > 0 ? (
                <table className="selected-entries-table">
                    <thead>
                        <tr>
                            <th>Project Code</th>
                            <th>Notes</th>
                            <th>Hours</th>
                            <th>Minutes</th> {/* New column for minutes */}
                            {entryType === '1x1' && <th>Select User</th>} {/* Add column for user selection if entry type is 1x1 */}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedEntries.map(entry => (
                            <tr key={entry.id}>
                                <td>{entry.project.code}</td>
                                <td>{entry.notes}</td>
                                <td>{entry.hours}</td>
                                <td>{entry.hours * 60} minutes</td> {/* Display total minutes */}
                                {entryType === '1x1' && (
                                    <td>
                                        <select
                                            value={selectedUsers[entry.id] || ''} // Get the selected user for the entry
                                            onChange={(e) => handleUserSelection(entry.id, e.target.value)} // Handle user selection
                                        >
                                            <option value="">Select a user</option>
                                            {users.map(user => ( // Populate dropdown with users from Redux store
                                                <option key={user.id} value={user.id}>
                                                    {user.first_name} {/* Display user name */}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td></td>
                            <td><strong>{totalHours} hours</strong></td> {/* Total hours */}
                            <td><strong>{totalMinutes} minutes</strong></td> {/* Total minutes */}
                            {entryType === '1x1' && <td></td>} {/* Empty cell for user selection column */}
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <p>No selected entries found.</p>
            )}
        </div>
    );
};

export default SelectedEntries;
