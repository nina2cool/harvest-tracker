import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { roundToNearestFiveMinutes, sortEntriesByTaskName } from '../utils/functions';
import { Button, Form } from 'react-bootstrap';
import { testData } from '../utils/testData';
import { setHarvestEntries } from '../store/actions/timeEntriesActions';
import BillableHours from '../components/BillableHours';
import HarvestEntryTable from '../components/HarvestEntryTable';

const TimeEntriesPage6 = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputValues, setInputValues] = useState({});
    const [savedEntries, setSavedEntries] = useState({});
    const [calculatedMinutes, setCalculatedMinutes] = useState({});

    const entryType = useSelector(state => state.timeEntries.entryType);
    // const harvestEntries = useSelector(state => state.timeEntries.harvestEntries);

    // const entryType = "bill to client";
    const harvestEntries = useSelector(state => state.timeEntries.harvestEntries);
    const splitTimeEntries = useSelector(state => state.timeEntries.splitTimeEntries);
    const timeEntriesByUser = useSelector(state => state.timeEntries.timeEntriesByUser);
    const allProjectsArray = useSelector(state => state.projects.allProjects);
    const filteredTasksArray = useSelector(state => state.tasks.filteredTasks);
    // const splitTimeEntries = testData.timeEntries.splitTimeEntries;
    // const timeEntriesByUser = testData.timeEntries.timeEntriesByUser;
    // const allProjectsArray = testData.projects.allProjects;
    // const filteredTasksArray = sortEntriesByTaskName(testData.tasks.filteredTasks);
    const successMessage = "New entry/entries saved successfully!";

    console.log("splitTimeEntries", splitTimeEntries);
    console.log("timeEntriesByUser", timeEntriesByUser);
    console.log("allProjectsArray", allProjectsArray);
    console.log("filteredTasksArray", filteredTasksArray);

    const [showHarvestEntries, setShowHarvestEntries] = useState(false);
    const [tasksSelected, setTasksSelected] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState({});

    const billableHours = useSelector(state => state.timeEntries.billableHours);
    console.log("billableHours", billableHours);
    console.log("calculatedMinutes", calculatedMinutes);


    const calculateTotalSuggestedMinutes = () => {
        const suggestedMinutes = splitTimeEntries.reduce((acc, entry) => {
            return acc + (parseInt(entry.originalEntry.hours * 60) || 0);
        }, 0);

        const totalSuggestedMinutes = roundToNearestFiveMinutes(suggestedMinutes);
        return totalSuggestedMinutes;
}

    const calculateTotalCalculatedMinutes = () => {
        const totalCalculatedMinutes = Object.values(calculatedMinutes).reduce((acc, entry) => {
            return acc + (entry.allocatedMinutes || 0); // Access the allocatedMinutes property
        }, 0);
        return totalCalculatedMinutes;
    };

    const handleApplyCalculations = (event) => {
        console.log("handleApplyCalculations");
        event.preventDefault();

        // Go through splitTimeEntries and total the suggested minutes for each and get the total
        const suggestedMinutes = splitTimeEntries.reduce((acc, entry) => { 
            return acc + (parseInt(entry.originalEntry.hours * 60) || 0);
        }, 0);

        const totalSuggestedMinutes = roundToNearestFiveMinutes(suggestedMinutes);
        console.log("totalSuggestedMinutes", totalSuggestedMinutes);

        // Create an object to store the calculated minutes for each project
        const calculatedMinutes = {};

        // Loop through billableHours and calculate the allocated minutes
        billableHours.forEach(billableHour => {
            const projectCode = billableHour.projectCode; // Assuming each billableHour has a projectCode
            const percentage = billableHour.percentage; // Assuming each billableHour has a percentage

            // Calculate the allocated minutes for this project
            const allocatedMinutes = (totalSuggestedMinutes * (percentage / 100));

            // Store the result in the calculatedMinutes object under "allocated minutes"
            calculatedMinutes[projectCode] = {
                allocatedMinutes: roundToNearestFiveMinutes(allocatedMinutes),
                distributedMinutes: 0,
                confirmedMinutes: 0
            };
            
            console.log(`Allocated minutes for project ${projectCode}: ${allocatedMinutes}`);
        });

        // Sort calculatedMinutes by allocated minutes in descending order
        const sortedCalculatedMinutes = Object.entries(calculatedMinutes)
            .sort(([, a], [, b]) => b.allocatedMinutes - a.allocatedMinutes) // Sort by the allocated minutes in descending order
            .reduce((acc, [key, value]) => {
                acc[key] = value; // Convert back to object
                return acc;
            }, {});

        console.log("Sorted Calculated Minutes Object:", sortedCalculatedMinutes);
        setCalculatedMinutes(sortedCalculatedMinutes);
    };

    const handleSave = (event, entryId) => {
        event.preventDefault();

        // Calculate total minutes from splitTimeEntries
        const totalMinutes = splitTimeEntries.reduce((acc, entry) => {
            return acc + Math.round(entry.originalEntry.hours * 60); // Convert hours to minutes
        }, 0);

        // Calculate total confirmed minutes
        const totalConfirmedMinutesForEntry = Object.values(inputValues[entryId] || {}).reduce((acc, projectData) => {
            return acc + (parseInt(projectData.confirmedMinutes) || 0);
        }, 0);

        // Check if all required values are present in inputValues for the entryId
        const entryValues = inputValues[entryId] || {};
        const allValuesPresent = Object.values(entryValues).every(projectData => {
            return (
                projectData.confirmedMinutes &&
                projectData.taskId &&
                projectData.projectId &&
                projectData.projectNotes &&
                projectData.userId &&
                projectData.spentDate
            );
        });

        if (!allValuesPresent) {
            console.warn("Cannot save entry: Not all required values are present.");
            return; // Exit the function if conditions are not met
        }

        // Proceed with saving the entry if all conditions are met
        let newHarvestEntries = [];

        Object.entries(inputValues[entryId] || {}).forEach(([projectCode, projectData]) => {
            const entryData = {
                project_id: projectData.projectId,
                task_id: projectData.taskId,
                spent_date: projectData.spentDate,
                hours: projectData.confirmedMinutes / 60,
                user_id: projectData.userId,
                notes: projectData.projectNotes
            };
            projectData.confirmedMinutes !== 0 && newHarvestEntries.push(entryData);
        });

        console.log("newHarvestEntries", newHarvestEntries);

        dispatch(setHarvestEntries(newHarvestEntries));

        setSavedEntries(prev => ({
            ...prev,
            [entryId]: true
        }));

        setIsButtonDisabled(prev => ({
            ...prev,
            [entryId]: true
        }));
    };

    const handleCreateHarvestEntries = (event) => {
        event.preventDefault();
        console.log("handleCreateHarvestEntries");

        let totalDistributedMinutes = 0;
        let totalAllocatedMinutes = calculateTotalCalculatedMinutes();
        let harvestEntries = [];

        // Loop through each project in calculatedMinutes
        Object.keys(calculatedMinutes).forEach(projectCode => {
            const allocatedMinutes = calculatedMinutes[projectCode].allocatedMinutes;
            const distributedMinutes = calculatedMinutes[projectCode].distributedMinutes;
            let remainingMinutes = allocatedMinutes - distributedMinutes;

            // Check if there are remaining minutes for the current project
            if (remainingMinutes > 0) {
                // Loop through each time entry in splitTimeEntries to allocate minutes
                splitTimeEntries.forEach(entry => {
                    const entryId = entry.originalEntry.id; // Extract entry ID
                    const notes = entry.originalEntry.notes; // Extract notes
                    const hours = entry.originalEntry.hours; // Extract hours
                    const entryMinutes = Math.round(hours * 60); // Convert hours to minutes
                    const userId = entry.originalEntry.user.id; // Extract user ID
                    const spentDate = entry.originalEntry.spent_date; // Extract spent date

                    // Check if this entry has already been fully allocated
                    if (entry.allocatedMinutes && entry.allocatedMinutes >= entryMinutes) {
                        console.log(`Entry ${entryId} has already been fully allocated.`);
                        return; // Skip this entry if it has already been fully allocated
                    }

                    //need to get taskId
                    const taskId = 22321976; // Ensure taskId is defined

                    // Check if there are remaining minutes to distribute
                    if (remainingMinutes > 0 && totalDistributedMinutes < totalAllocatedMinutes) {
                        let minutesToDistribute = Math.min(entryMinutes, remainingMinutes);

                        const project = allProjectsArray.find(p => p.code === projectCode); // Find the project by code
                        const projectId = project ? project.id : null; // Get the project ID or null if not found


                        // Update the total distributed minutes
                        totalDistributedMinutes += minutesToDistribute;
                        calculatedMinutes[projectCode].distributedMinutes += minutesToDistribute;

                        // Update the allocated minutes for the entry
                        entry.allocatedMinutes = (entry.allocatedMinutes || 0) + minutesToDistribute;

                        // Prepare the data for the harvest entry
                        const harvestEntryData = {
                            // projectCode: projectCode,
                            project_id: project.id, // Use the looked-up project ID
                            task_id: taskId,
                            spent_date: spentDate,
                            hours: minutesToDistribute / 60, // Convert minutes back to hours
                            user_id: userId,
                            notes: notes,
                        };

                        harvestEntries.push(harvestEntryData);
                        console.log(`Distributed ${minutesToDistribute} minutes to project ${projectCode}`);

                        // Update remaining minutes after distribution
                        remainingMinutes -= minutesToDistribute;

                        // Check if all minutes for the current project have been allocated
                        if (remainingMinutes <= 0) {
                            console.log(`All minutes allocated for project ${projectCode}`);
                            return; // Exit the inner loop to move to the next project
                        }
                    }
                });
            }
        });

        console.log("totalDistributedMinutes", totalDistributedMinutes);
        console.log("totalAllocatedMinutes", totalAllocatedMinutes);

        // Log the total number of entries
        console.log("Harvest Entries Data:", harvestEntries);

        dispatch(setHarvestEntries(harvestEntries));
        // Optionally, you can dispatch an action to save the harvest entries
        // dispatch(setHarvestEntries(newHarvestEntries)); // Uncomment this line if you have an action to save the entry
    };

    console.log("harvestEntries", harvestEntries);

    // Check if all entries have been saved
    const allEntriesSaved = Object.keys(savedEntries).length === splitTimeEntries.length;

    return (
        <div className="time-entries-page">
            <h1>Time Entries Page 6 - Bill to Client</h1>

            {splitTimeEntries.length > 0 ? (
                <div className="split-time-entries-container">
                    <table className="split-time-entries-table">
                        <thead>
                            <tr>
                                <th>Project Code</th>
                                <th>Notes</th>
                                <th>Hours</th>
                                <th>Minutes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {splitTimeEntries.map((entry, index) => {
                                const minutes = Math.round(entry.originalEntry.hours * 60);
                                const entryId = entry.originalEntry.id; // Assuming each entry has a unique ID

                                return (
                                    <tr key={index} className="split-time-entry">
                                        <td className="entry-item">{entry.originalEntry.project.code}</td>
                                        <td className="entry-item">{entry.originalEntry.notes}</td>
                                        <td className="entry-item">{entry.originalEntry.hours}</td>
                                        <td className="entry-item">{minutes}</td>
                                    </tr>
                                );
                            })}
                            <p>Total minutes to allocate: {calculateTotalSuggestedMinutes()}</p>
                        </tbody>
                    </table>

                    <BillableHours billableHours={billableHours} calculatedMinutes={calculatedMinutes} />
                    {calculatedMinutes && <p>Total calculated minutes: {calculateTotalCalculatedMinutes()}</p>}   
                        <div>
                            <Button variant="primary" onClick={(event) => handleApplyCalculations(event)}>
                                Apply calculations
                            </Button>

                        <Button variant="secondary" onClick={(event) => handleCreateHarvestEntries(event)}>
                            Create the harvest entries
                        </Button>
                        </div>
                    
                    <h3>Show the new Entries</h3>
                    {harvestEntries.length > 0 && <HarvestEntryTable harvestEntries={harvestEntries} />}
                        <Button variant="success" onClick={() => navigate('/time-entries-step-5')}>
                        Preview the new Harvest Entries
                    </Button>
                </div>
            ) : (
                <p>No split time entries found.</p>
            )}
        </div>
    );
};

export default TimeEntriesPage6;
