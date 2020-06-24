import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import ExerciseLinks from './ExerciseLinks.js';
import { updateRoutines, fetchUserInfo } from '../../store/asynchHandler.js';
import { EXERCISES_SORTING_CRITERIA } from '../../store/CONSTANTS.js';

class RoutineScreen extends Component {
    state = {
        name: this.props.routine === undefined ? '' : this.props.routine.name,
        sortBy: ''
    }

    componentDidMount = () => {
        if(this.props.index !== -1) {
            // updating last_modified
            this.props.routines[this.props.index].last_modified = new Date();
            this.props.updateRoutines(this.props.auth.uid, this.props.routines);
            this.props.fetchUserInfo(this.props.auth.uid);
        }
    }

    handleNameChange = (e) => {
        console.log("Handle name change");
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }), () => {
            this.props.routines[this.props.index].name = this.state.name;
            this.props.updateRoutines(this.props.auth.uid, this.props.routines);
        });
    }

    addNewExercise = () => {
        const newExercise = {
            name: 'Unknown',
            muscle_group: 'Unknown',
            reps: 1
        };
        this.props.routines[this.props.index].exercises.push(newExercise);
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
        this.props.fetchUserInfo(this.props.auth.uid);      // put these 2 asynch calls in a promise later on
    }

    updateRoutine = exercises => {
        this.props.routines[this.props.index].exercises = exercises.slice();
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    sortByName = () => {
        console.log("Sort by exercise name");

        if(this.state.sortBy === EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING) {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING })
        }
        else {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING })
        }

        let sortedExercises = this.props.routines[this.props.index].exercises.sort(this.compare);
        this.props.routines[this.props.index].exercises = sortedExercises;
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
    }

    sortByGroup = () => {
        console.log("Sort by exercise group");

        if(this.state.sortBy === EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_INCREASING) {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_DECREASING })
        }
        else {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_INCREASING })
        }

        let sortedExercises = this.props.routines[this.props.index].exercises.sort(this.compare);
        this.props.routines[this.props.index].exercises = sortedExercises;
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
    }

    sortByReps = () => {
        console.log("Sort by exercise reps");

        if(this.state.sortBy === EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_INCREASING) {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_DECREASING })
        }
        else {
            this.setState({ sortBy: EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_INCREASING })
        }

        let sortedExercises = this.props.routines[this.props.index].exercises.sort(this.compare);
        this.props.routines[this.props.index].exercises = sortedExercises;
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
    }

    compare = (item1, item2) => {
        let criteria = this.state.sortBy;
        if((criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING) || (criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_DECREASING) || (criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        
        if((criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING) || (criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING)) {
            if(item1.name < item2.name)
                return -1;
            else if(item1.name > item2.name)
                return 1;
            else
                return 0;
        }
        
        else if((criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_INCREASING) || (criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_GROUP_DECREASING)) {
            if(item1.muscle_group < item2.muscle_group)
                return -1;
            else if(item1.muscle_group > item2.muscle_group)
                return 1;
            else
                return 0;
        }

        else if((criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_INCREASING) || (criteria === EXERCISES_SORTING_CRITERIA.SORT_BY_REPS_DECREASING)) {
            if(parseInt(item1.reps) < parseInt(item2.reps))
                return -1;
            else if(parseInt(item1.reps) > parseInt(item2.reps))
                return 1;
            else
                return 0;
        }
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        if(this.props.index === -1)
            return <Redirect to="/myroutines" />;

        return (
            <div className="container exercise-list">
                <div className="routine_name_container">
                    <label className="active">Name:</label>
                    <input type="text" name="name" id="name" defaultValue={this.state.name} onChange={this.handleNameChange} />
                </div>
                <div id="exercise-container">
                    <div className="exercise_header_card">
                        <div className="exercise_task_header" onClick={this.sortByName}>
                            Exercise
                        </div>
                        <div className="exercise_group_header" onClick={this.sortByGroup}>
                            Muscle Group
                        </div>
                        <div className="exercise_reps_header" onClick={this.sortByReps}>
                            Reps
                        </div>
                    </div>
                </div>
                <ExerciseLinks routine={this.props.routine} updateRoutine={this.updateRoutine} />
                <br />
                <div className="new_button_container"><button onClick={this.addNewExercise}>Add New Exercise</button></div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;       // get id from url (:id) from App
    var index = -1;
    if(state.firebase.profile.routines) {
        /* 
            after a refresh, routines becomes undefined, causing a refresh problem
            temporarily solved it by redirecting to /myroutines if refresh problem occurs
        */
        index = state.firebase.profile.routines.findIndex(item => item.id === id);
    }

    return {
        auth: state.firebase.auth,
        id,
        index,
        routines: state.manager.currentRoutines,
        routine: state.manager.currentRoutines[index]
    };
};

const mapDispatchToProps = dispatch => ({
    updateRoutines : (uid, newRoutines) => dispatch(updateRoutines(uid, newRoutines)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(RoutineScreen);