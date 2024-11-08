import React from 'react';
import { Table } from 'react-bootstrap';

const HarvestEntryTable = ({ newHarvestEntries }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Project ID</th>
                    <th>Task ID</th>
                    <th>Spent Date</th>
                    <th>Hours</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {newHarvestEntries.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.user_id}</td>
                        <td>{entry.project_id}</td>
                        <td>{entry.task_id}</td>
                        <td>{entry.spent_date}</td>
                        <td>{entry.hours}</td>
                        <td>{entry.notes}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default HarvestEntryTable;