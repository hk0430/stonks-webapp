import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

class NewsfeedRoutine extends Component {
    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container exercise-list">
                <div className="routine_name_container">
                    <h6>Name: { /* gotta somehow retrieve the list name */ }</h6>
                    <h6>Owner: {this.props.username}</h6>
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
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { username, id } = ownProps.match.params;

    return {
        auth: state.firebase.auth,
        username,
        id
    };
};

export default compose(
    connect(mapStateToProps)
)(NewsfeedRoutine);