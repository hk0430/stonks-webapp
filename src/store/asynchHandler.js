import * as actionCreators from './actionCreators.js';
// import actionCodeSettings from '../config/emailAuthConfig';

export const fetchNewsfeed = (uid, username) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  const ref = fireStore.collection('users');

  var newsfeed = [];
  ref.doc(uid).get().then((doc) => {
    if(doc.exists) {
      newsfeed = doc.data().newsfeed;
      console.log("Fetching user newsfeed");
    } else {
      console.log("No such document!");
    }
  }).then(() => {
    console.log("Newsfeed fetched");
    dispatch({ type: actionCreators.NEWSFEED_FETCHED, payload: newsfeed });
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

  /*
    putting a newsfeed array in each individual user instead of making one array and have users share them.
    even though for now each newsfeed array in each user have the same information,
    eventually i'm gonna make the newsfeed personalized, so it's easier to transition once i get that done
  */
  var newsfeedUpdate = [];
  const now = new Date();
  ref.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if(doc.data().username !== username){
        ref.doc(doc.id).get().then((doc) => {
          if(doc.exists) {
            let fellow = doc.data().username;
            doc.data().routines.forEach(routine => {
              const range = now.getTime() - routine.last_modified.toDate().getTime();
              if(range <= 604800000) {
                // 604800000ms === 1 week
                let data = {
                  username: fellow,
                  routine: routine
                }
                newsfeedUpdate.push(data);
              }
            });
            ref.doc(uid).update({
              newsfeed: newsfeedUpdate
            }).then(() => {
              console.log("User newsfeed updated");
            }).catch((err) => {
              console.log(err);
            });
          } else {
            console.log("No such document! @updating newsfeed");
          }
        }).catch((err) => {
          console.log(err);
        });
      };
    })
  });
}

export const updateRoutines = (uid, newRoutines) => (dispatch, getState, { getFirestore }) => {
  const fireStore = getFirestore();
  fireStore.collection('users').doc(uid).update({
    routines: newRoutines
  }).then(() => {
    console.log("Routines updated");
    /*
      dispatch({ type: actionCreators.ROUTINES_UPDATE, routines: newRoutines });
      the line above would mess up the rendering of the last modified component of each routine
      this is because i made the last modified to be read from the database
      if i put this line, i directly send over the newRoutines without going through firebase's processing
      thus messing up the timestamps
      because the timestamps are " formatted differently" after being processed by firebase
    */
  }).catch((err) => {
    console.log(err);
  });
};

export const fetchUserInfo = uid => (dispatch, getState, { getFirestore }) => {
  var username = '';
  var routines = [];
  const fireStore = getFirestore();
  fireStore.collection('users').doc(uid).get().then((doc) => {
    if(doc.exists) {
      username = doc.data().username;
      routines = doc.data().routines;
      console.log("Fetching user info");
    } else {
      console.log("No such document!");
    }
  }).then(() => {
    console.log("User info fetched");
    dispatch({ type: actionCreators.CURRENT_USER_UPDATE, username: username, routines: routines });
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
    supremeRuler: newUser.supremeRuler,
    routines: newUser.routines,
    newsfeed: newUser.newsfeed
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