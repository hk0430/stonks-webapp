// THIS FILE KNOWS HOW TO MAKE ALL THE ACTION
// OBJECDTS THAT WE WILL USE. ACTIONS ARE SIMPLE
// LITTLE PACKAGES THAT REPRESENT SOME EVENT
// THAT WILL BE DISPATCHED TO THE STORE, WHICH
// WILL TRIGGER THE EXECUTION OF A CORRESPONDING
// REDUCER, WHICH ADVANCES STATE

// THESE ARE ALL THE TYPE OF ACTIONS WE'LL BE CREATING
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SCREEN_CHANGE = 'SCREEN_CHANGE';
export const CURRENT_USER_UPDATE = 'CURRENT_USER_UPDATE';
export const RETRIEVE_COMPANIES = 'RETRIEVE_COMPANIES';
export const UPDATE_TICKER_ANALYSIS = 'UPDATE_TICKER_ANALYSIS';

export const registerSuccess = () => {
    return { type: REGISTER_SUCCESS }
};
export const registerError = error => { 
    return { type: REGISTER_ERROR, error }
};
export const loginSuccess = () => {
    return { type: LOGIN_SUCCESS }
};
export const loginError = error => {
    return { type: LOGIN_ERROR, error }
};
export const logoutSuccess = () => {
    return { type: LOGOUT_SUCCESS }
};

export const updateScreen = newScreen => {
    return (dispatch) => {
        dispatch({ type: SCREEN_CHANGE, payload: newScreen });
    }
};

export const showAnalysis = (ticker, analysis) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_TICKER_ANALYSIS, ticker: ticker, analysis: analysis })
    }
}