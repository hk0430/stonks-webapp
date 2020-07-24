import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyDr2IZCMKqRHkGZ5vmaF7So0M0QhczGAsk",
    authDomain: "summer2020-a2ae0.firebaseapp.com",
    databaseURL: "https://summer2020-a2ae0.firebaseio.com",
    projectId: "summer2020-a2ae0",
    storageBucket: "summer2020-a2ae0.appspot.com",
    messagingSenderId: "711657761055",
    appId: "1:711657761055:web:9f3f6550f05c18fa05682a",
    measurementId: "G-XBCZ9L2MV6"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;