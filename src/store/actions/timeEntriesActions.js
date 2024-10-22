export const fetchTimeEntries = (userId, startDate, endDate) => {
    console.log("fetchTimeEntries", userId, startDate, endDate);

    const useStartDate = startDate ? startDate : '2024-10-01';

    return async (dispatch) => {
        dispatch({ type: 'FETCH_TIME_ENTRIES_REQUEST' });

        try {
            const response = process.env.ENV === "dev" ? await fetch(`http://localhost:3002/api/harvest-ime-entries?from=${useStartDate}`) : await fetch(`https://harvest-tracker-api.onrender.com/api/harvest-time-entries?from=${useStartDate}`);

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

