import React, { useState } from 'react';
import HarvestEntryTable from '../components/HarvestEntryTable';
import { Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { harvestEntriesSaved } from '../utils/testData';
import Loader from '../components/Loader';

const TimeEntriesPage5 = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const harvestEntries = useSelector(state => state.timeEntries.harvestEntries);

    console.log("harvestEntries", harvestEntries);
    // const harvestEntries = harvestEntriesSaved;
    // Function to post newHarvestEntries to the API
    const postNewHarvestEntries = async () => {
        console.log(JSON.stringify(harvestEntries));
        setLoading(true);

        try {
            for (const entry of harvestEntries) {
                console.log("submitting post request for entry", entry);
                const response = await fetch('https://harvest-tracker-api.onrender.com/api/create-harvest-time-entries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(entry), // Send the current entry
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok for entry: ${JSON.stringify(entry)}`);
                }
                console.log("response", response);
                const data = await response.json();
                console.log('Success:', data);
            }
            // Set success message after all entries have been posted
            setSuccessMessage('All entries have been submitted successfully!');
        } catch (error) {
            console.error('Error posting new harvest entries:', error);
            setErrorMessage('Error submitting entries. Please try again. - ' + error);
            // Optionally, handle error (e.g., show an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="time-entries-page">
            <h1>Time Entries Page 5</h1>
            <div>
                {harvestEntries && harvestEntries.length > 0 && (
                    <>
                    <HarvestEntryTable harvestEntries={harvestEntries} />
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {loading && <Loader />}
                    {!loading && !successMessage && (
                        <Button variant="primary" onClick={postNewHarvestEntries}>
                            Submit New Entries
                        </Button>
                    )}
                </>
                )}
            </div>
        </div>
    );
};

export default TimeEntriesPage5;
