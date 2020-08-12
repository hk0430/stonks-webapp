import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/constants';
import { updateScreen } from '../../store/actionCreators';
import { fetchUserInfo, retrieveCompanies } from '../../store/asynchHandler';

/*
    comments on localstorage
    user info need to be retrieved at least once when the browser's local storage is fresh (first time logging into the site with this browser or after a clear browser setting)
    for now, keep the componentdidmount functions for the "first time" retrieval and have it stored in local storage
    might be able to fix this by checking if localstorage returns undefined and then if it is, we call them
*/

class HomeScreen extends Component {
    /*
        data structures needed:
            -> an object (A) that maps a sector name to another object (B), which contains all the companies in that sector and the total premium in that sector
                -> each object (B) shall contain 
    */
    state = {
        tickersPremiumMap: [],
        sectors: [],
        map: []     // associative array: maps ticker to ticker info
    }

    componentDidMount = () => {
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);
        this.props.retrieveCompanies();
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    binarySearchString = (data, target) => {
        let l = 0;
        let r = data.length - 1; 
        while (l <= r) { 
            let m = Math.ceil(l + (r - l) / 2); 
            let res = target.localeCompare(data[m]); 
  
            if (res === 0) return m; 
            if (res > 0) l = m + 1;
            else r = m - 1; 
        } 
  
        return -1; 
    }

    test = () => {
        let subject = [];       // object "associative array"
        for(let i = 0; i < this.props.tickers.length; i++) {
            if(subject[this.props.tickers[i].sector] !== undefined)
                subject[this.props.tickers[i].sector] += 1;
            else
                subject[this.props.tickers[i].sector] = 1;
        }
        console.log(subject);
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        console.log(this.props.uoa[0].expiry);
        return (
            <div className="dashboard container">
                <h4>Welcome, { this.props.username }.</h4>
                <br/>
                <h3>PLACEHOLDER - {this.props.uoa.length}</h3>
                <h5>
                    Current issues at hand:<br/>
                </h5>
                <button onClick={this.test}>Test</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        username: state.manager.currentUsername,
        uoa: state.manager.currentUoa,
        tickers: state.manager.tickers
    };
};

const mapDispatchToProps = dispatch => ({
    updateScreen: newScreen => dispatch(updateScreen(newScreen)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid)),
    retrieveCompanies: () => dispatch(retrieveCompanies())
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(HomeScreen);