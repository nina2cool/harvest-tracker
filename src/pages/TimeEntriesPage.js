import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntriesByDate, setBillableHours, setSelectedWeek, setTimeEntriesByUser } from '../store/actions/timeEntriesActions'; // Import the new action
import BillableHours from '../components/BillableHours'; // Import the new component
import Loader from '../components/Loader'; // Import the Loader component
import { calculateDates } from '../utils/functions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { calculateBillableHours, sortEntriesByProjectCode, organizeEntriesByUser } from '../utils/functions';

const TimeEntriesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const timeEntriesByDate = useSelector(state => state.timeEntries.timeEntriesByDate); // Get all time entries from Redux
    const billableHours = useSelector(state => state.timeEntries.billableHours); // Get billable hours from Redux
    const selectedWeek = useSelector(state => state.timeEntries.selectedWeek); // Get selected week from Redux
    const [isHoursCalculated, setIsHoursCalculated] = useState(false); // State for hours calculation
    const [loadingBillableHours, setLoadingBillableHours] = useState(false); // New state for loading billable hours
    const [showBillableHours, setShowBillableHours] = useState(false); // State to control visibility of BillableHours

    const handleCalculateHours = async () => {
        setLoadingBillableHours(true); // Set loading state to true
        setShowBillableHours(false); // Hide BillableHours component initially
        // Fetch time entries by date first
        const { startDate, endDate } = calculateDates(selectedWeek); // Get calculated dates
        await dispatch(fetchTimeEntriesByDate(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])); // Fetch time entries by date
        setIsHoursCalculated(true); // Set hours calculation state
    };

    const handleWeekChange = (e) => {
        const week = e.target.value;
        dispatch(setSelectedWeek(week)); // Dispatch action to set selected week
    };

    useEffect(() => {
        if (isHoursCalculated) {

            // Now calculate billable hours after fetching time entries
            const calculatedBillableHours = calculateBillableHours(timeEntriesByDate);

            // Sort the calculated billable hours by project code
            const sortedBillableHours = sortEntriesByProjectCode(calculatedBillableHours);
            // Dispatch the action to store billable hours in Redux
            dispatch(setBillableHours(sortedBillableHours));
            
            // Now organize that data by user and store it in redux as an object
            const organizedByUser = organizeEntriesByUser(timeEntriesByDate);
            dispatch(setTimeEntriesByUser(organizedByUser)); // Dispatch the organized entries
            
            setLoadingBillableHours(false); // Set loading state to false after calculation
            setShowBillableHours(true); // Show BillableHours component after data is ready
        }
    }, [timeEntriesByDate, isHoursCalculated, dispatch]); // Run this effect when timeEntriesByDate or isHoursCalculated changes

    return (
        <div>
            <h1>Time Entries</h1>

            <h2>Step 1: Fetch Time Entries by Date</h2>

            <label>
                Week:
                <select value={selectedWeek} onChange={handleWeekChange}>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                </select>
            </label>

            <button onClick={handleCalculateHours}>Calculate Hours</button> {/* Button to calculate billable hours */}

            {loadingBillableHours ? <Loader /> : showBillableHours && <BillableHours billableHours={billableHours} />} {/* Display the billable hours only when not loading and data is ready */}

            {showBillableHours && ( // Only show the button if BillableHours is visible
                <button onClick={() => navigate('/time-entries-step-2')}>Go to Step 2</button> // Button to navigate to Step 2
            )}
        </div>
    );
};

export default TimeEntriesPage;
