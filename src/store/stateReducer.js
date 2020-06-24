import * as actionCreators from './actionCreators.js';

const initState = {
    currentScreen: '',
    currentUsername: '',
    currentRoutines: [],
    currentNewsfeed: []
};

const stateReducer = (state = initState, action) => {
    switch (action.type) {
        case actionCreators.NEWSFEED_FETCHED:
            return {
                ...state,
                currentNewsfeed: action.payload
            }
        case actionCreators.CURRENT_USER_UPDATE:
            return {
                ...state,
                currentUsername: action.username,
                currentRoutines: action.routines
            }
        case actionCreators.SCREEN_CHANGE:
            return {
                ...state,
                currentScreen: action.payload   // change the currentScreen state in the store
            }
        default:
            return state;
    }
};

export default stateReducer;