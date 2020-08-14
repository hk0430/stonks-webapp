import * as actionCreators from './actionCreators.js';
/*
  how localstorage comes into play:
  right after we login the user, we call the retrieveCompanies and fetchUserInfo function to get the user's username, option flow and "public" data on the companies
  this information will be fetched, dispatched, and saved to localstorage
  this information will not need to be fetched again from the server since it is stored in localstorage
  so a refresh on the page will not need an asych call to the database, instead, it will load this information from localstorage
  we will only make a call to the database when we update the database (updateUoa)
  when we fetch updated info from the database, we update the localstorage as well
  this method lessen the strain on the server
*/

/*
  retrieve an array of objects where each object represents a company and its information as follows
    ticker
    company name
    market cap
    ipo year
    sector
    industry
*/
export const retrieveCompanies = () => (dispatch, getState, { getFirestore }) => {
  let companies = [];
  let sectors = [];
  const fireStore = getFirestore();
  fireStore.collection('data').doc('market').get().then((doc) => {
    if(doc.exists) {
      companies = doc.data().companies;
      sectors = doc.data().sectors;
    }
  }).then(() => {
    console.log("market->companies fetched");
    dispatch({ type: actionCreators.RETRIEVE_COMPANIES, companies: companies, sectors: sectors });
  }).catch((error) => {
    console.log("Error getting market->companies:", error);
  });
}

/*
  update collection data, document market with an array of objects, where each object represents a company with the following information:
    ticker
    company name
    market cap
    ipo year
    sector
    industry
*/
export const updateDataCollection = (companies, sectors) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('data').doc('market').set({
    companies: companies,
    sectors: sectors
  }).then(() => {
    console.log("market->companies updated");
  }).catch((err) => {
    console.log(err);
  });
}

/*
  update the array of option flows for a specific user
*/
export const updateUoa = (uid, newUoa) => (dispatch, getState, { getFirestore }) => {
  console.log(newUoa);
  const fireStore = getFirestore();
  fireStore.collection('users').doc(uid).update({
    uoa: newUoa
  }).then(() => {
    console.log("Uoa updated");
    fetchUserInfo(uid)(dispatch, getState, { getFirestore });
  }).catch((err) => {
    console.log(err);
  });
};

/*
  retrieve the following user information:
    username
    option flow data
*/
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

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState, { getFirestore }) => {
  firebase.auth().signInWithEmailAndPassword(
    credentials.email,
    credentials.password,
  ).then(() => {
    console.log("LOGIN_SUCCESS");
    dispatch({ type: actionCreators.LOGIN_SUCCESS });
    retrieveCompanies()(dispatch, getState, { getFirestore });
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        fetchUserInfo(user.uid)(dispatch, getState, { getFirestore });
      }
    });
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
    dispatch(actionCreators.registerSuccess);
    retrieveCompanies()(dispatch, getState, { getFirestore });
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        fetchUserInfo(user.uid)(dispatch, getState, { getFirestore });
      }
    });
  }).catch((err) => {
    dispatch(actionCreators.registerError);
  });
};