import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import UoaLinks from './UoaLinks.js';
import { updateUoa, fetchUserInfo } from '../../store/asynchHandler.js';
import {  } from '../../store/constants.js';

class UoaScreen extends Component {
    state = {
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

    addNewExercise = () => {
        const newExercise = {
            ticker: '',         // string
            type: 'Calls',      // string: drop down menu Calls/Puts
            strike: 0,          // double
            expiry: '',         // date, chosen from calendar interface
            spot: 0,            // double,
            deets: '',          // string
            premium: 0          // double
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

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        if(this.props.index === -1)
            return <Redirect to="/myroutines" />;

        return (
            <div className="container exercise-list">
                <div id="exercise-container">
                    <div className="exercise_header_card">
                        <div className="exercise_task_header">
                            Ticker
                        </div>
                        <div className="exercise_group_header">
                            Type
                        </div>
                        <div className="exercise_reps_header">
                            Strike
                        </div>
                        <div className="expiry_header">
                            Expiry
                        </div>
                        <div className="spot_header">
                            Spot
                        </div>
                        <div className="deets_header">
                            Deets
                        </div>
                        <div className="premium_header">
                            Premium
                        </div>
                    </div>
                </div>
                <UoaLinks routine={this.props.routine} updateRoutine={this.updateRoutine} />
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
        uoa: state.manager.currentUoa //routines: state.manager.currentRoutines
        //routine: state.manager.currentRoutines[index]
    };
};

const mapDispatchToProps = dispatch => ({
    updateUoa : (uid, newUoa) => dispatch(updateUoa(uid, newUoa)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(UoaScreen);