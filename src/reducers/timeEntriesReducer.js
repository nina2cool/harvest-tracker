const initialState = {
    timeEntries: [],
    loading: false,
    error: null,
};

const timeEntriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TIME_ENTRIES_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_TIME_ENTRIES_SUCCESS':
            return { ...state, loading: false, timeEntries: action.payload };
        case 'FETCH_TIME_ENTRIES_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default timeEntriesReducer;