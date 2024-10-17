export const fetchUsers = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_USERS_REQUEST' });

        try {
            const response = await fetch(`https://harvest-tracker-api.onrender.com/api/users`);
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data.users });
            } else {
                dispatch({ type: 'FETCH_USERS_FAILURE', payload: data.error });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
        }
    };
};