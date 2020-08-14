import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/constants';
import { updateScreen } from '../../store/actionCreators';

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

        what to display:
            1. a pie chart showing how much money is in each sector
                a. round up every option flow, identify its sector, and add the premium to the sector total
    */
    state = {
        tickersPremiumMap: [],
        sectors: new Map(),
        map: []     // associative array: maps ticker to ticker info
    }

    componentDidMount = () => {
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);

        // initialize the sectors map with value (premium) at 0
        this.props.sectors.forEach(sector => {
            this.state.sectors.set(sector, 0);
        });

        // loop through each flow
        let na_count = 0;
        this.props.uoa.forEach(flow => {
            let index = this.binarySearchString(flow.ticker);
            if(index > -1) {
                let company = this.props.tickers[index];
                this.state.sectors.set(company.sector, parseInt(this.state.sectors.get(company.sector)) + parseInt(flow.premium));
            } else {
                na_count += 1;
            }
        });
        console.log(na_count);
    }

    binarySearchString = (target) => {
        let data = this.props.tickers;
        let l = 0;
        let r = data.length - 1; 
        while (l <= r) { 
            let m = Math.ceil(l + (r - l) / 2); 
            let res = target.localeCompare(data[m].ticker); 
  
            if (res === 0) return m; 
            if (res > 0) l = m + 1;
            else r = m - 1; 
        } 
  
        return -1; 
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <h4>Welcome, { this.props.username }.</h4>
                <br/>
                <h3>PLACEHOLDER - {this.props.uoa.length}</h3>
                <h5>
                    Current issues at hand:<br/>
                </h5>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        username: state.manager.currentUsername,
        uoa: state.manager.currentUoa,
        tickers: state.manager.tickers,
        sectors: state.manager.sectors
    };
};

const mapDispatchToProps = dispatch => ({
    updateScreen: newScreen => dispatch(updateScreen(newScreen))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(HomeScreen);