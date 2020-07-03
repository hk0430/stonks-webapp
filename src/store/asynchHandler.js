import * as actionCreators from './actionCreators.js';
// import actionCodeSettings from '../config/emailAuthConfig';

export const updateUoa = (uid, newUoa) => (dispatch, getState, { getFirestore }) => {
  console.log(newUoa);
  const fireStore = getFirestore();
  fireStore.collection('users').doc(uid).update({
    uoa: newUoa
  }).then(() => {
    console.log("Uoa updated");
  }).catch((err) => {
    console.log(err);
  });
};

export const fetchUserInfo = uid => (dispatch, getState, { getFirestore }) => {
  var username = '';
  var uoa = [];
  const fireStore = getFirestore();
  fireStore.collection('users').doc(uid).get().then((doc) => {
    if(doc.exists) {
      username = doc.data().username;
      uoa = doc.data().uoa;
      console.log("Fetching user info");
    } else {
      console.log("No such document!");
    }
  }).then(() => {
    console.log("User info fetched");
    dispatch({ type: actionCreators.CURRENT_USER_UPDATE, username: username, uoa: uoa });
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
};

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
  firebase.auth().signInWithEmailAndPassword(
    credentials.email,
    credentials.password,
  ).then(() => {
    console.log("LOGIN_SUCCESS");
    dispatch({ type: actionCreators.LOGIN_SUCCESS });
  }).catch((err) => {
    dispatch({ type: actionCreators.LOGIN_ERROR, err });
  });
};

export const logoutHandler = (firebase) => (dispatch, getState) => {
  firebase.auth().signOut().then(() => {
    dispatch(actionCreators.logoutSuccess);
  });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  firebase.auth().createUserWithEmailAndPassword(
    newUser.email,
    newUser.password
  ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
    email: newUser.email,
    uoa: newUser.uoa
  })).then(() => {
    /*
    NEED AN ACTUAL DOMAIN NAME IN actionCodeSettings -> cant be just '/'
    firebase.auth().sendSignInLinkToEmail(newUser.email, actionCodeSettings)
    .then(function() {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', newUser.email);
    })
    .catch((err) => {
      // Some error occurred, you can inspect the code: error.code
      console.log("Email auth error: " + err);
    });
    */
    dispatch(actionCreators.registerSuccess);
  }).catch((err) => {
    dispatch(actionCreators.registerError);
  });
};