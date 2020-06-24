import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/CONSTANTS';
import { updateScreen } from '../../store/actionCreators';
import { fetchUserInfo, fetchNewsfeed } from '../../store/asynchHandler';

class HomeScreen extends Component {
    state = {
        haveNews: true
    }

    componentDidMount = () => {
        this.props.fetchUserInfo(this.props.auth.uid);
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);
        this.props.fetchNewsfeed(this.props.auth.uid, this.props.username);
        if(this.props.newsfeed.length === 0) {
            this.setState({ haveNews: false });
        }
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            /*
            <div className="dashboard container">
                <h4>Welcome, { this.props.username }. See what others are doing:</h4>
                <NewsfeedLinks newsfeed={this.props.newsfeed} haveNews={this.state.haveNews} />
            </div>
            */
           <Redirect to="/myroutines" />
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        username: state.manager.currentUsername,
        newsfeed: state.manager.currentNewsfeed
    };
};

const mapDispatchToProps = dispatch => ({
    updateScreen: newScreen => dispatch(updateScreen(newScreen)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid)),
    fetchNewsfeed: (uid, username) => dispatch(fetchNewsfeed(uid, username))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(HomeScreen);