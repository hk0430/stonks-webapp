import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { fetchUserInfo } from '../../store/asynchHandler.js';

class AnalysisScreen extends Component {
    componentDidMount = () => {
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container">
                <h3>
                    {this.props.uoa.length}
                </h3>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        uoa: state.manager.currentUoa
    };
};

const mapDispatchToProps = dispatch => ({
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(AnalysisScreen);