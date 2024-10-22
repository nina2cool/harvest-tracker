export const fetchTimeEntries = (userId, startDate, endDate) => {
    console.log("fetchTimeEntries", userId, startDate, endDate);

    const useStartDate = startDate ? startDate : "2024-01-01";

    console.log("useStartDate", useStartDate);

    return async (dispatch) => {
        dispatch({ type: 'FETCH_TIME_ENTRIES_REQUEST' });

        try {
            // const response = await fetch(`https://harvest-tracker-api.onrender.com/api/time-entries?from=${startDate}&to=${endDate}`);
            const response = await fetch(`http://localhost:3002/api/time-entries?from=${useStartDate}`);
            const data = await response.json();
            console.log('API Response:', response.data);
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
