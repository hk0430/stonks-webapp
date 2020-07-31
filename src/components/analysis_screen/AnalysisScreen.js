import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { fetchUserInfo } from '../../store/asynchHandler.js';

class AnalysisScreen extends Component {
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