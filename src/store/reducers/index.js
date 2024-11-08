import { combineReducers } from 'redux';
import timeEntriesReducer from './timeEntriesReducer';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import taskReducer from './taskReducer';
const rootReducer = combineReducers({
    timeEntries: timeEntriesReducer,
    users: userReducer,
    projects: projectReducer,
    tasks: taskReducer,
    // Add other reducers here if needed
});

export default rootReducer;