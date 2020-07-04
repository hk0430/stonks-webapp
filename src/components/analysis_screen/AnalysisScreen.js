import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { fetchUserInfo } from '../../store/asynchHandler.js';

class AnalysisScreen extends Component {
    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container">
                <h3>PLACEHOLDER - HERE YOU WILL SEE INFO LIKE:<br/>
                    NUMBERS AND STATS ON ANY TICKER FROM THE FLOW<br/>
                    DATE BREAKDOWN OF TICKER - WHAT WEEK DOES WHAT TICKER HAVE CALLS/PUTS EXPIRE<br/>
                    WHAT SECTORS OF SPY DOES EACH TICKER FALL INTO - SECTOR BREAKDOWN<br/>
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