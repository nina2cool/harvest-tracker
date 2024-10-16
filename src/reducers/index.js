import { combineReducers } from 'redux';
import timeEntriesReducer from './timeEntriesReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    timeEntries: timeEntriesReducer,
    users: userReducer
    // Add other reducers here if needed
});

export default rootReducer;