import React from 'react'
import { connect } from 'react-redux';
import exerciseJson from './exercises.json';
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {
    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('users').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("clearing " + doc.id + "'s routines");
                fireStore.collection('users').doc(doc.id).update({
                    routines: []
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
            })
        });
    }

    resetExercises = () => {
        const fireStore = getFirestore();
        exerciseJson.exercises.forEach(exerciseJson => {
            fireStore.collection('exercises').add({
                    chest: exerciseJson.chest,
                    triceps: exerciseJson.triceps,
                    back: exerciseJson.back,
                    biceps: exerciseJson.biceps,
                    shoulders: exerciseJson.shoulders,
                    legs: exerciseJson.legs,
                    abs: exerciseJson.abs
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.resetExercises}>Reset Exercises</button>
            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);