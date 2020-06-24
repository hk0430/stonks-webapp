import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import uuid from 'uuid';

import RoutineListLinks from './RoutineListLinks.js';
import { updateRoutines, fetchUserInfo } from '../../store/asynchHandler';
import { ROUTINES_SORTING_CRITERIA } from '../../store/CONSTANTS.js';

class RoutineList extends Component {
    state = {
        sortBy: ''
    }

    componentDidMount = () => {
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    createNewRoutine = () => {
        const routine = {
            name: 'New Routine',
            muscle_group: '',
            exercises: [],
            created: new Date(),
            last_modified: new Date(),
            id: uuid.v4()
        }
        this.props.routines.push(routine);
        this.props.updateRoutines(this.props.auth.uid, this.props.routines);
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    sortByName = () => {
        console.log("Sort by routine name");

        if(this.state.sortBy === ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING) {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING })
        }
        else {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING })
        }

        let sortedRoutines = this.props.routines.sort(this.compare);
        this.props.updateRoutines(this.props.auth.uid, sortedRoutines);
    }

    sortByCreated = () => {
        console.log("Sort by created");

        if(this.state.sortBy === ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_INCREASING) {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_DECREASING })
        }
        else {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_INCREASING })
        }

        let sortedRoutines = this.props.routines.sort(this.compare);
        this.props.updateRoutines(this.props.auth.uid, sortedRoutines);
    }

    sortByDate = () => {
        console.log("Sort by last modified");

        if(this.state.sortBy === ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_INCREASING) {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_DECREASING })
        }
        else {
            this.setState({ sortBy: ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_INCREASING })
        }

        let sortedRoutines = this.props.routines.sort(this.compare);
        this.props.updateRoutines(this.props.auth.uid, sortedRoutines);
    }

    compare = (item1, item2) => {
        let criteria = this.state.sortBy;
        if((criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING) || (criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_DECREASING) || (criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        
        if((criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_INCREASING) || (criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_NAME_DECREASING)) {
            if(item1.name < item2.name)
                return -1;
            else if(item1.name > item2.name)
                return 1;
            else
                return 0;
        }

        else if((criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_INCREASING) || (criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_CREATED_DECREASING)) {
            let timestamp1 = item1.created.toDate().toString();
            let index1 = timestamp1.indexOf(' GMT');
            timestamp1 = timestamp1.slice(4, index1 - 10);
            let timestamp2 = item2.created.toDate().toString();
            let index2 = timestamp2.indexOf(' GMT');
            timestamp2 = timestamp2.slice(4, index2 - 10);
            let date1 = new Date(timestamp1);
            let date2 = new Date(timestamp2);
            if (date1 < date2)
                return -1;
            else if(date1 > date2)
                return 1;
            else
                return 0;
        }
        
        else if((criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_INCREASING) || (criteria === ROUTINES_SORTING_CRITERIA.SORT_BY_TIMESTAMP_DECREASING)) {
            let timestamp1 = item1.last_modified.toDate().toString();
            let index1 = timestamp1.indexOf(' GMT');
            timestamp1 = timestamp1.slice(0, index1);
            let timestamp2 = item2.last_modified.toDate().toString();
            let index2 = timestamp2.indexOf(' GMT');
            timestamp2 = timestamp2.slice(0, index2);
            let date1 = new Date(timestamp1);
            let date2 = new Date(timestamp2);
            if (date1 < date2)
                return -1;
            else if(date1 > date2)
                return 1;
            else
                return 0;
        }
    }

    render() {
        if(!this.props.auth.uid)
            return <Redirect to="/login" />;

        return (
            <div className="container">
                <h4>Welcome, { this.props.username }. These are your routines:</h4>
                <div className="routine_header_card">
                    <div className="routine_name_header" onClick={this.sortByName}>
                        Routine Name
                    </div>
                    <div className="routine_created_header" onClick={this.sortByCreated}>
                        Created
                    </div>
                    <div className="routine_last_mod_header" onClick={this.sortByDate}>
                        Last Modified
                    </div>
                </div>
                <RoutineListLinks routines={this.props.routines} />
                <div className="new_button_container"><button onClick={this.createNewRoutine}>Create a new routine</button></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        username: state.manager.currentUsername,
        routines: state.manager.currentRoutines
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
)(RoutineList);