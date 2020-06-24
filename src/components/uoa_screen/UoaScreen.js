import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import UoaLinks from './UoaLinks.js';
import { updateUoa, fetchUserInfo } from '../../store/asynchHandler.js';
import {  } from '../../store/constants.js';

class UoaScreen extends Component {
    state = {
        sortBy: '',
        modalState: false,
        ticker: '',
        type: '',
        strike: '',
        expiry: '',
        spot: '',
        deets: '',
        premium: ''
    }

    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          [target.id]: target.value,
        }), () => {
            console.log("new ticker: " + this.state.ticker);
        });
    }

    getStyle = () => {
        return {
            display: this.state.modalState ? 'block' : 'none'
        }
    }

    showModal = () => {
        this.setState({modalState: true});
    }

    hideModal = () => {
        this.setState({
            modalState: false,
            ticker: '',
            type: '',
            strike: '',
            expiry: '',
            spot: '',
            deets: '',
            premium: ''
        }, () => {
            console.log(
                this.state.ticker
            )
        });
    }

    addNewOption = () => {
        const newOption = {
            ticker: '',         // string
            type: 'Calls',      // string: drop down menu Calls/Puts
            strike: 0,          // double
            expiry: '',         // date, chosen from calendar interface
            spot: 0,            // double,
            deets: '',          // string
            premium: 0          // double
        };
        this.props.uoa.push(newOption);
        this.props.updateUoa(this.props.auth.uid, this.props.uoa);
        this.props.fetchUserInfo(this.props.auth.uid);      // put these 2 asynch calls in a promise later on
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        console.log("ticker: " + this.state.ticker);
        console.log("strike: " + this.state.strike);
        console.log("expiry: " + this.state.expiry);
        console.log("spot: " + this.state.spot);
        console.log("deets: " + this.state.deets);
        console.log("premium: " + this.state.premium);
        console.log("type: " + this.state.type);

        return (
            <div className="container">
                <div>
                    <div className="uoa_header_card">
                        <div className="ticker_header">
                            Ticker
                        </div>
                        <div className="type_header">
                            Type
                        </div>
                        <div className="strike_header">
                            Strike
                        </div>
                        <div className="expiry_header">
                            Expiry
                        </div>
                        <div className="spot_header">
                            Spot
                        </div>
                        <div className="deets_header">
                            Deets
                        </div>
                        <div className="premium_header">
                            Premium
                        </div>
                    </div>
                </div>
                <UoaLinks uoa={this.props.uoa} updateUoa={this.updateUoa} />
                <br />
                <div className="new_button_container"><button onClick={this.showModal}>Add a New Option</button></div>
                
                <div className="modal" style={this.getStyle()}>
                    <span className="close" onClick={this.hideModal}>&times;</span>
                    <div className="form-container">
                        <h5 className="grey-text text-darken-3">New Option Flow</h5>
                        <div className="input-field modal-field">
                            <label htmlFor="ticker">Ticker</label>
                            <input type="text" name="ticker" defaultValue={this.state.ticker} required onChange={this.handleChange} />
                        </div><br/>
                        <div className="input-field modal-field">
                            <label htmlFor="strike">Strike</label>
                            <input type="number" name="strike" min="0" defaultValue={this.state.strike} required onChange={this.handleChange} />
                        </div><br/>
                        <div className="input-field modal-field">
                            <label htmlFor="expiry">Expiry</label>
                            <input type="date" name="expiry" required defaultValue={this.state.expiry} onChange={this.handleChange} />
                        </div><br/>
                        <div className="input-field modal-field">
                            <label htmlFor="spot">Spot</label>
                            <input type="number" name="spot" min="0" required defaultValue={this.state.spot} onChange={this.handleChange} />
                        </div><br/>
                        <div className="input-field modal-field">
                            <label htmlFor="deets">Details</label>
                            <input type="text" name="deets" required defaultValue={this.state.deets} onChange={this.handleChange} />
                        </div><br/>
                        <div className="input-field modal-field">
                            <label htmlFor="premium">Premium</label>
                            <input type="number" name="premium" min="0" required defaultValue={this.state.premium} onChange={this.handleChange} />
                        </div><br/>
                        <div className="modal-field">
                            <select className="dropdown" name="type" onChange={this.handleChange}>
                                <option value="calls">Calls</option>
                                <option value="puts">Puts</option>
                            </select>
                        </div><br/>
                        <div className="new_button_container"><button onClick={this.showModal}>Submit</button></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;       // get id from url (:id) from App
    var index = -1;
    if(state.firebase.profile.routines) {
        /* 
            after a refresh, routines becomes undefined, causing a refresh problem
            temporarily solved it by redirecting to /myroutines if refresh problem occurs
        */
        index = state.firebase.profile.routines.findIndex(item => item.id === id);
    }

    return {
        auth: state.firebase.auth,
        id,
        index,
        uoa: state.manager.currentUoa //routines: state.manager.currentRoutines
    };
};

const mapDispatchToProps = dispatch => ({
    updateUoa : (uid, newUoa) => dispatch(updateUoa(uid, newUoa)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(UoaScreen);