import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyAmluFtteiMTzPkXtPPrQ_76oRam4GzsK0",
    authDomain: "summer2020-28d1a.firebaseapp.com",
    databaseURL: "https://summer2020-28d1a.firebaseio.com",
    projectId: "summer2020-28d1a",
    storageBucket: "summer2020-28d1a.appspot.com",
    messagingSenderId: "976877445214",
    appId: "1:976877445214:web:631e5592687e08477a54cf",
    measurementId: "G-9J3W660KCK"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;