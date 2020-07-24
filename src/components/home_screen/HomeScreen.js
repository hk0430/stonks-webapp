import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/constants';
import { updateScreen } from '../../store/actionCreators';
import { fetchUserInfo } from '../../store/asynchHandler';

class HomeScreen extends Component {
    componentDidMount = () => {
        this.props.fetchUserInfo(this.props.auth.uid);
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <h4>Welcome, { this.props.username }. Hope you have a great trading day!</h4>
                <br/>
                <h3>PLACEHOLDER - HERE YOU WILL SEE MARKET NEWS ON TICKERS THAT IS IN YOUR UOA</h3>
                <h5>
                    Current issues at hand:<br/>
                    1. fix refresh issue using local storage<br/>
                    2. implement binary search on tickers to quickly find a particular ticker (for sector breakdown analysis)<br/>
                </h5>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        username: state.manager.currentUsername
    };
};

const mapDispatchToProps = dispatch => ({
    updateScreen: newScreen => dispatch(updateScreen(newScreen)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(HomeScreen);