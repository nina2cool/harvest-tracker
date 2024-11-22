// src/store/reducers/taskReducer.js
import {
    FETCH_JIRA_TICKETS_REQUEST,
    FETCH_JIRA_TICKETS_SUCCESS,
    FETCH_JIRA_TICKETS_FAILURE,
    FETCH_JIRA_USERS_SUCCESS,
    SET_ACTIVE_JIRA_USERS,
} from '../actions/jiraActions';

const initialState = {
    loading: true,
    allJiraTickets: [],
    error: '',
    jiraUsers: [],
    activeJiraUsers: [],
};

const jiraReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_JIRA_TICKETS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_JIRA_TICKETS_SUCCESS:
            return {
                loading: false,
                allJiraTickets: action.payload,
                error: '',
            };
        case FETCH_JIRA_TICKETS_FAILURE:
            return {
                loading: false,
                allJiraTickets: [],
                error: action.payload,
            };
        case FETCH_JIRA_USERS_SUCCESS:
            return {
                ...state,
                jiraUsers: action.payload,
            };
        case SET_ACTIVE_JIRA_USERS:
            return {
                ...state,
                activeJiraUsers: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default jiraReducer;
