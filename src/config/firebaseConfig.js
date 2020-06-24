import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyAqFqM0-V7pRMZ2RLAdAq2Sqr6TD08NYgU",
    authDomain: "summer2020-fd7f4.firebaseapp.com",
    databaseURL: "https://summer2020-fd7f4.firebaseio.com",
    projectId: "summer2020-fd7f4",
    storageBucket: "summer2020-fd7f4.appspot.com",
    messagingSenderId: "845965454145",
    appId: "1:845965454145:web:12225e63d7ad99a0aa0fc0",
    measurementId: "G-GXFZLJYJHK"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;