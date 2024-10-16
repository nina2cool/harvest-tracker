export const fetchUsers = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_USERS_REQUEST' });

        try {
            const response = await fetch(`http://localhost:3001/api/users`);
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