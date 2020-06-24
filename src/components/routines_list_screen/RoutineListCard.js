import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { updateRoutines, fetchUserInfo } from '../../store/asynchHandler.js';

class RoutineListCard extends Component {
    deleteRoutine = (e) => {
        e.preventDefault();

        const { routine, routines } = this.props;
        const index = routines.findIndex(item => item.id === routine.id);
        routines.splice(index, 1);    // remove routine
        this.props.updateRoutines(this.props.auth.uid, routines);
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    render() {
        const { routine } = this.props;

        var created = routine.created.toDate().toString();
        const end = created.indexOf('GMT');
        created = created.slice(4, end - 10);

        var timestamp = routine.last_modified.toDate().toString();
        const index = timestamp.indexOf(' GMT');
        timestamp = timestamp.slice(0, index);

        return (
            <div className="card z-depth-0 routine_list_card">
                <div className="card-content grey-text text-darken-3">
                    <div className="routine_list_name">{routine.name}</div>
                    <div className="routine_list_created">{created}</div>
                    <div className="routine_list_timestamp">{timestamp}</div>
                    <div className="routine_list_delete" onClick={this.deleteRoutine}>&#128465;</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = dispatch => ({
    updateRoutines : (uid, newRoutines) => dispatch(updateRoutines(uid, newRoutines)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(RoutineListCard);