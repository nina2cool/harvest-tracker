import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { roundToNearestFiveMinutes } from '../utils/functions';
import { Button, Form, Table } from 'react-bootstrap';
import { testData } from '../utils/testData';

const TimeEntriesPage4 = () => {
    const [inputValues, setInputValues] = useState({});
    const [newHarvestEntries, setNewHarvestEntries] = useState({});
    const [savedEntries, setSavedEntries] = useState({});
    const [showHarvestEntries, setShowHarvestEntries] = useState(false);

    const splitTimeEntries = testData.timeEntries.splitTimeEntries;
    const timeEntriesByUser = testData.timeEntries.timeEntriesByUser;
    const allProjectsArray = testData.projects.allProjects;

    console.log("splitTimeEntries", splitTimeEntries);

    useEffect(() => {
        const newHarvestEntries = {};
        splitTimeEntries.forEach(entry => {
            const entryId = entry.originalEntry.id;
            newHarvestEntries[entryId] = {};
        });

        console.log("newHarvestEntries", newHarvestEntries);
        setNewHarvestEntries(newHarvestEntries); // Update the state with the new object
    }, [splitTimeEntries]); // Dependencies to recalculate when these change

    const handleInputChange = (entryId, projectCode, value) => {
        setInputValues(prev => ({
            ...prev,
            [entryId]: {
                ...prev[entryId],
                [projectCode]: value
            }
        }));
    };

    const handleSave = (event, entryId) => {
        event.preventDefault();
        const projectsData = {};
        const originalEntry = splitTimeEntries.find(entry => entry.originalEntry.id === entryId);
        const userId = originalEntry?.originalEntry.user.id;
        const projectId = originalEntry?.originalEntry.project.id;
        const taskId = originalEntry?.originalEntry.task.id;
        const notes = `TEST - ${originalEntry?.originalEntry.notes}`;
        const spentDate = originalEntry?.originalEntry.spent_date;

        Object.entries(inputValues[entryId] || {}).forEach(([projectCode, confirmedMinutes]) => {
            projectsData[projectCode] = {
                confirmedMinutes: parseInt(confirmedMinutes) || 0,
                userId: userId,
                projectId: projectId,
                taskId: taskId,
                spentDate: spentDate,
                hours: confirmedMinutes / 60,
                notes: notes,
            };
        });

        setNewHarvestEntries(prev => ({
            ...prev,
            [entryId]: projectsData
        }));

        setSavedEntries(prev => ({
            ...prev,
            [entryId]: true
        }));
    };

    console.log("newHarvestEntries", newHarvestEntries);
    console.log("inputValues", inputValues);

    // Check if all entries have been saved
    const allEntriesSaved = Object.keys(savedEntries).length === splitTimeEntries.length;

    // Function to toggle the display of newHarvestEntries
    const handleShowEntries = () => {
        setShowHarvestEntries(prev => !prev);
    };

    // Function to post newHarvestEntries to the API
    const postNewHarvestEntries = async () => {

        const testNewEntry = {
            userId: '3145393',
            projectId: '39573743',
            taskId: '23236095',
            spentDate: '2024-11-08',
            hours: 0.5,
            notes: 'TEST - if you see this, the API call worked',
        };

        try {
            const response = await fetch('https://harvest-tracker-api.onrender.com/api/create-harvest-time-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testNewEntry),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            // Optionally, handle success (e.g., show a success message, reset state, etc.)
        } catch (error) {
            console.error('Error posting new harvest entries:', error);
            // Optionally, handle error (e.g., show an error message)
        }
    };

    return (
        <div className="time-entries-page">
            <h1>Time Entries Page 4</h1>
            {splitTimeEntries.length > 0 ? (
                <div>
                    {splitTimeEntries.map((entry, index) => {
                        const minutes = Math.round(entry.originalEntry.hours * 60);
                        const splitType = entry.splitType === "" ? "custom" : entry.splitType;
                        let inputFields = "";
                        let totalSuggestedMinutesForEntry = 0;

                        if (splitType !== "custom") {
                            const userProjects = timeEntriesByUser.find(user => user.id === parseInt(entry.correspondingUserId, 10));
                            if (userProjects) {
                                const filteredProjects = userProjects.projects.filter(project => project.percentage > 0);
                                if (filteredProjects.length > 0) {
                                    inputFields = filteredProjects.map(filteredProject => {
                                        const matchingProject = allProjectsArray.find(thisProject => thisProject.code === filteredProject.projectCode);
                                        if (matchingProject) {
                                            const projectId = matchingProject.id;
                                            const projectNotes = entry.originalEntry.notes;
                                            const suggestedMinutes = roundToNearestFiveMinutes(minutes * (filteredProject.percentage / 100));
                                            totalSuggestedMinutesForEntry += suggestedMinutes;

                                            return (
                                                <div key={filteredProject.projectCode} className="entry-form-inputs">
                                                    <span>{filteredProject.projectCode} </span>
                                                    <input type="hidden" className="projectId" name="projectId" value={projectId} />
                                                    <input type="hidden" className="projectNotes" name="projectNotes" value={projectNotes} />
                                                    <input type="hidden" className="correspondingUserId" name="correspondingUserId" value={entry.correspondingUserId} />
                                                    <label>Suggested Minutes</label>
                                                    <input
                                                        type="number"
                                                        value={suggestedMinutes || 0}
                                                        className="suggested-minutes"
                                                        readOnly
                                                    />
                                                    <label>Confirmed Minutes</label>
                                                    <input
                                                        type="number"
                                                        placeholder={suggestedMinutes || 0}
                                                        required
                                                        className="confirmed-minutes"
                                                        value={inputValues[entry.originalEntry.id]?.[filteredProject.projectCode] || ''}
                                                        onChange={(e) => handleInputChange(entry.originalEntry.id, filteredProject.projectCode, e.target.value)}
                                                    />
                                                </div>
                                            );
                                        } else {
                                            console.warn(`No matching project found for project code: ${filteredProject.projectCode}`);
                                            return null;
                                        }
                                    });
                                } else {
                                    console.log(`No projects found for user ID: ${entry.correspondingUserId}`);
                                }
                            }
                        } else {
                            return <p>Need to add code for custom split type</p>
                        }

                        const totalConfirmedMinutesForEntry = Object.values(inputValues[entry.originalEntry.id] || {}).reduce((acc, value) => {
                            return acc + (parseInt(value) || 0);
                        }, 0);

                        return (
                            <div className="split-time-entry-container" key={index} id={entry.originalEntry.id}>
                                <table className="split-time-entries-table">
                                    <thead>
                                        <tr>
                                            <th>Project Code</th>
                                            <th>Notes</th>
                                            <th>Hours</th>
                                            <th>Minutes</th>
                                            <th>Corresponding User ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="split-time-entry">
                                            <td className="entry-item">{entry.originalEntry.project.code}</td>
                                            <td className="entry-item">{entry.originalEntry.notes}</td>
                                            <td className="entry-item">{entry.originalEntry.hours}</td>
                                            <td className="entry-item">{minutes}</td>
                                            <td className="entry-item">{entry.correspondingUserId !== false ? entry.correspondingUserId : 'Not Assigned'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Form className="entry-form" id={entry.originalEntry.id} onSubmit={(e) => handleSave(e, entry.originalEntry.id)}>
                                    <h3>Suggested Minutes by Project for this entry</h3>
                                    {inputFields}
                                    {totalConfirmedMinutesForEntry === totalSuggestedMinutesForEntry ? (
                                        <Button type="submit">Save Entries</Button>
                                    ) : (
                                        <Button type="submit" disabled>Save Entries (Confirmed minutes do not match suggested minutes)</Button>
                                    )}
                                </Form>
                            </div>
                        );
                    })}
                    {allEntriesSaved && (
                        <div>
                            <Button variant="success" onClick={handleShowEntries}>
                                {showHarvestEntries ? "Hide New Entries" : "Create New Entries in Harvest"}
                            </Button>
                            {showHarvestEntries && (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Project Code</th>
                                            <th>Confirmed Minutes</th>
                                            <th>User ID</th>
                                            <th>Project ID</th>
                                            <th>Task ID</th>
                                            <th>Spent Date</th>
                                            <th>Hours</th>
                                            <th>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(newHarvestEntries).map(([entryId, projects]) => (
                                            Object.entries(projects).map(([projectCode, data]) => (
                                                <tr key={`${entryId}-${projectCode}`}>
                                                    <td>{projectCode}</td>
                                                    <td>{data.confirmedMinutes}</td>
                                                    <td>{data.userId}</td>
                                                    <td>{data.projectId}</td>
                                                    <td>{data.taskId}</td>
                                                    <td>{data.spentDate}</td>
                                                    <td>{data.hours}</td>
                                                    <td>{data.notes}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <Button variant="primary" onClick={postNewHarvestEntries}>
                                Submit New Entries
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <p>No split time entries found.</p>
            )}
        </div>
    );
};

export default TimeEntriesPage4;
