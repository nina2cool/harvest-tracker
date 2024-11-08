import React from 'react';
import { calculateTotalBillableHours, numHoursToCrossOff } from '../utils/functions';

const BillableHours = ({ billableHours }) => {

    // Calculate total billable hours
    const totalBillableHours = parseFloat(calculateTotalBillableHours(billableHours).toFixed(2));

    return (
        <div>
            <h2>Billable Hours by Project</h2>
            <p>Total Billable Hours: {totalBillableHours} hours</p>
            {billableHours.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Project Code</th>
                            <th>Billable Hours</th>
                            <th>Percentage of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billableHours.map(({ projectCode, hours, percentage }) => {
                            const isCrossedOff = hours < numHoursToCrossOff; // Determine if the row should be crossed off
                            return (
                                <tr key={projectCode} style={{ textDecoration: isCrossedOff ? 'line-through' : 'none' }}>
                                    <td>{projectCode}</td>
                                    <td>{parseFloat(hours.toFixed(2))}</td>
                                    <td>{percentage > 0 ? `${parseFloat(percentage).toFixed(2)}%` : 'N/A'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No billable hours found.</p>
            )}
        </div>
    );
};

export default BillableHours;
