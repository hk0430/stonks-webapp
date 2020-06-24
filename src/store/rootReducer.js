import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import stateReducer from './stateReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  manager: stateReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;