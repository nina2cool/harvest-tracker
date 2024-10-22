export const fetchTimeEntries = (userId, startDate, endDate) => {
    console.log("fetchTimeEntries", userId, startDate, endDate);

    // Example usage
    const lastMonday = getPreviousMonday();
    console.log(lastMonday.toDateString());  // Outputs the previous Monday's date

    const useStartDate = startDate ? startDate : lastMonday;

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

function getPreviousMonday() {
    const today = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Calculate the number of days to subtract to get to the previous Monday
    // If today is Monday, we want to go back 7 days to the previous Monday
    const daysToPreviousMonday = currentDay === 0 ? 6 : currentDay + 6;

    // Set the date to the Monday of the previous week
    const previousMonday = new Date(today.setDate(today.getDate() - daysToPreviousMonday));

    return previousMonday;
}
