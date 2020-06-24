import * as actionCreators from './actionCreators.js';

const initState = {
    currentScreen: '',
    currentUsername: '',
    currentUoa: []
};

const stateReducer = (state = initState, action) => {
    switch (action.type) {
        case actionCreators.CURRENT_USER_UPDATE:
            return {
                ...state,
                currentUsername: action.username,
                currentUoa: action.uoa
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