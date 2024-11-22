export const fetchJiraTickets = (user_id) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_JIRA_TICKETS_REQUEST' }); // Dispatch request action
        try {
            // Construct the API URL with the user_id parameter
            const apiUrl = `http://localhost:3002/api/jira-person-issues?userId=${user_id}`;
            console.log("Fetch Jira Tickets API URL:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Fetch Jira Tickets Response:", response);
            const data = await response.json();
            dispatch({ type: 'FETCH_JIRA_TICKETS_SUCCESS', payload: data.issues }); // Dispatch success action
        } catch (error) {
            dispatch({ type: 'FETCH_JIRA_TICKETS_FAILURE', payload: error.message }); // Dispatch failure action
        }
    };
};
export const FETCH_JIRA_TICKETS_REQUEST = 'FETCH_JIRA_TICKETS_REQUEST';
export const FETCH_JIRA_TICKETS_SUCCESS = 'FETCH_JIRA_TICKETS_SUCCESS';
export const FETCH_JIRA_TICKETS_FAILURE = 'FETCH_JIRA_TICKETS_FAILURE';

export const fetchJiraUsers = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_JIRA_USERS_REQUEST' }); // Dispatch request action
        try {
            const apiUrl = process.env.ENV === "dev"
                ? `http://localhost:3002/api/jira-users`
                : `https://harvest-tracker-api.onrender.com/api/jira-users`;

            // const apiUrl = `http://localhost:3002/api/jira-users`;
            console.log("Fetch Jira Users API URL:", apiUrl);
            const response = await fetch(apiUrl);
            console.log("Fetch Jira Users Response:", response);
            const data = await response.json();
            dispatch({ type: 'FETCH_JIRA_USERS_SUCCESS', payload: data }); // Dispatch success action
        } catch (error) {
            dispatch({ type: 'FETCH_JIRA_USERS_FAILURE', payload: error.message }); // Dispatch failure action
        }
    };
};

export const FETCH_JIRA_USERS_REQUEST = 'FETCH_JIRA_USERS_REQUEST';
export const FETCH_JIRA_USERS_SUCCESS = 'FETCH_JIRA_USERS_SUCCESS';
export const FETCH_JIRA_USERS_FAILURE = 'FETCH_JIRA_USERS_FAILURE';

export const SET_ACTIVE_JIRA_USERS = 'SET_ACTIVE_JIRA_USERS';

export const setActiveJiraUsers = (activeJiraUsers) => ({
    type: SET_ACTIVE_JIRA_USERS,
    payload: activeJiraUsers,
});