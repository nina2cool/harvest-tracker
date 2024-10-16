export const fetchTimeEntries = (startDate, endDate) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_TIME_ENTRIES_REQUEST' });

        try {
            const response = await fetch(`https://harvest-tracker.onrender.com/api/time-entries?from=${startDate}&to=${endDate}`);
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'FETCH_TIME_ENTRIES_SUCCESS', payload: data.time_entries });
            } else {
                dispatch({ type: 'FETCH_TIME_ENTRIES_FAILURE', payload: data.error });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_TIME_ENTRIES_FAILURE', payload: error.message });
        }
    };
};