import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import SelectedEntries from '../components/SelectedEntries';
import BillableHours from '../components/BillableHours'; // Import the BillableHours component
import { setAdjustedMinutesByUser } from '../store/actions/timeEntriesActions'; // Import the new action

const TimeEntriesPage3 = () => {
    const dispatch = useDispatch(); // Initialize dispatch
    const selectedEntries = useSelector(state => state.timeEntries.selectedEntries); // Get selected entries from Redux store
    const billableHours = useSelector(state => state.timeEntries.billableHours); // Get billable hours from Redux store
    const [showBillableHours, setShowBillableHours] = useState(false); // State to manage visibility of BillableHours
    const selectedUserId = useSelector(state => state.timeEntries.selectedUserId); // Get selected user ID from Redux store

    const handleCalculateTimeSplit = () => {
        setShowBillableHours(true); // Show the BillableHours component when the button is pressed
    };

    // Calculate total hours from selected entries
    const totalSelectedHours = selectedEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalSelectedMinutes = totalSelectedHours * 60; // Convert total selected hours to minutes

    // Function to round to the nearest 5 minutes
    const roundToNearestFiveMinutes = (minutes) => {
        return Math.round(minutes / 5) * 5;
    };

    // Calculate adjusted hours and minutes for each billable project based on the total selected hours and project percentages
    const adjustedBillableHours = billableHours.map(project => {
        const adjustedHours = (totalSelectedHours * (project.percentage / 100)); // Calculate adjusted hours in hours
        const adjustedMinutes = roundToNearestFiveMinutes(adjustedHours * 60); // Convert to minutes and round to nearest 5 minutes
        return {
            ...project,
            adjustedHours: adjustedHours, // Keep adjusted hours in hours
            adjustedMinutes: adjustedMinutes, // Add adjusted minutes in minutes to the project object
            differenceRemoved: 0 // Initialize difference removed
        };
    });

    // Calculate total adjusted minutes
    const totalAdjustedMinutes = adjustedBillableHours.reduce((sum, project) => sum + project.adjustedMinutes, 0);

    // Check if total adjusted minutes exceed total selected minutes
    if (totalAdjustedMinutes > totalSelectedMinutes) {
        const difference = totalAdjustedMinutes - totalSelectedMinutes;

        // Find the project with the greatest number of adjusted hours
        const projectWithMaxHours = adjustedBillableHours.reduce((maxProject, project) => {
            return (maxProject.adjustedHours > project.adjustedHours) ? maxProject : project;
        });

        // Adjust the hours for the project with the greatest number of hours
        projectWithMaxHours.differenceRemoved = difference; // Store the difference removed
        projectWithMaxHours.adjustedMinutes = Math.max(0, projectWithMaxHours.adjustedMinutes - difference); // Ensure it doesn't go below 0
    }

    // Filter out projects with adjusted minutes of zero
    const filteredAdjustedBillableHours = adjustedBillableHours.filter(project => project.adjustedMinutes > 0);

    // Calculate total adjusted minutes after filtering
    const totalFinalAdjustedMinutes = filteredAdjustedBillableHours.reduce((sum, project) => sum + project.adjustedMinutes, 0);

    // Function to save adjusted minutes per project for the selected user
    const handleSaveAdjustedMinutes = () => {
        const adjustedMinutesPerProject = filteredAdjustedBillableHours.map(project => ({
            projectCode: project.projectCode,
            adjustedMinutes: project.adjustedMinutes,
            finalMinutes: project.adjustedMinutes - project.differenceRemoved, // Calculate final minutes
        }));
        dispatch(setAdjustedMinutesByUser(selectedUserId, adjustedMinutesPerProject)); // Dispatch action to save adjusted minutes
    };

    return (
        <div>
            {selectedEntries && selectedEntries.length > 0 ? (
                <>
                    <SelectedEntries selectedEntries={selectedEntries} /> {/* Pass selected entries to the component */}
                    <button onClick={handleCalculateTimeSplit}>Calculate time split</button> {/* Button to calculate time split */}
                    <button onClick={handleSaveAdjustedMinutes}>Save Adjusted Minutes</button> {/* Button to save adjusted minutes */}
                    {showBillableHours && (
                        <>
                            <h4>Adjusted Billable Minutes:</h4> {/* Updated title */}
                            <table className="adjusted-billable-hours-table">
                                <thead>
                                    <tr>
                                        <th>Project Code</th> {/* New column for project code */}
                                        <th>Adjusted Hours</th> {/* Adjusted hours first */}
                                        <th>Adjusted Minutes</th>
                                        <th>Final Minutes</th> {/* New column for final minutes */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAdjustedBillableHours.map(project => {
                                        const finalMinutes = project.adjustedMinutes - project.differenceRemoved; // Calculate final minutes
                                        return (
                                            <tr key={project.projectCode}>
                                                <td>{project.projectCode}</td> {/* Display project code */}
                                                <td>{project.adjustedHours.toFixed(2)} hours</td> {/* Adjusted hours */}
                                                <td>{project.adjustedMinutes} minutes</td> {/* Adjusted minutes */}
                                                <td>{finalMinutes} minutes</td> {/* Final minutes */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td><strong>Total</strong></td>
                                        <td><strong>{totalAdjustedMinutes} minutes</strong></td> {/* Total adjusted minutes */}
                                        <td><strong>{totalFinalAdjustedMinutes} minutes</strong></td> {/* Total final minutes */}
                                    </tr>
                                </tfoot>
                            </table>
                        </>
                    )}
                </>
            ) : (
                <p>No selected entries found.</p> // Message if no entries are selected
            )}
        </div>
    );
};

export default TimeEntriesPage3;
