import React from 'react';

const TimeEntriesList = ({ timeEntries, startDate, endDate, selectedUser }) => {
    console.log("timeEntries", timeEntries, startDate, endDate, selectedUser);

    const filteredEntries = timeEntries.filter(entry => {
        // const entryDate = new Date(entry.spent_date);
        const entryDate = entry.spent_date;
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);
        // console.log("entryDate", entryDate);
        console.log(entry.user, entry.spent_date);
        // console.log("entryUserId", entry.user.id); // Log the user ID for debugging

        // Check if entry.user.id is defined and matches the selectedUser
        const userMatches = entry.user && entry.user.id == selectedUser; // Ensure entry.user exists
        // console.log("userMatches", userMatches);
        // const dateInRange = entryDate >= formattedStartDate && entryDate <= formattedEndDate; // Check date range
        // console.log("dateInRange", dateInRange);
        // return userMatches && dateInRange; // Return true if both conditions are met
        return userMatches;
    });

    console.log("filteredEntries", filteredEntries);

    return (
        <div>
            <h2>Time Entries</h2>
            <ul>
                {filteredEntries.length > 0 ? (
                    filteredEntries.map(entry => (
                        <li key={entry.id}>
                            {entry.description} - {entry.hours} hours on {entry.spent_date} {/* Use spent_date for display */}
                        </li>
                    ))
                ) : (
                    <li>No time entries found.</li>
                )}
            </ul>
        </div>
    );
};

export default TimeEntriesList;
