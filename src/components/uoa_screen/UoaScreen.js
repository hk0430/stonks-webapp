import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import uuid from 'uuid';

import UoaLinks from './UoaLinks.js';
import { updateUoa, fetchUserInfo } from '../../store/asynchHandler.js';
import { UOA_SORTING_CRITERIA } from '../../store/constants.js';

class UoaScreen extends Component {
    state = {
        sortBy: '',
        modalState: false,
        date: '',
        ticker: '',
        type: '',
        strike: '',
        expiry: '',
        spot: '',
        order: '',
        deets: '',
        premium: '',
        date_filter: '',
        ticker_filter: ''
    }

    componentDidMount = () => {
        /*
        var promise = new Promise((resolve, reject) => {
            var res = this.props.fetchUserInfo(this.props.auth.uid);
            console.log(res);
            if (res === true) {
              resolve("Proceed to set state");
            }
            else {
              reject(Error("Do not proceed"));
            }
        });
        promise.then(() => {
            console.log(this.props.uoa);
            this.setState({ filtered: this.props.uoa }, () => {
                console.log(this.state);
            });
        }, (err) => {
            console.log("Failed to set state");
        })
        */
        this.props.fetchUserInfo(this.props.auth.uid);
    }

    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          [target.name]: target.value,
        }));
    }

    getStyle = () => {
        return {
            display: this.state.modalState ? 'block' : 'none'
        }
    }

    showModal = () => {
        this.setState({modalState: true});
    }

    hideAndClear = () => {
        this.setState({
            modalState: false
        });
        document.getElementById("date_field").value = "";
        document.getElementById("ticker_field").value = "";
        document.getElementById("strike_field").value = "";
        document.getElementById("expiry_field").value = "";
        document.getElementById("spot_field").value = "";
        document.getElementById("deets_field").value = "";
        document.getElementById("premium_field").value = "";
        document.getElementById("select_type").selectedIndex = 0;
        document.getElementById("select_order").selectedIndex = 0;
    }

    addNewOption = () => {
        var newOption = {
            date: this.state.date,
            ticker: this.state.ticker.toUpperCase(),
            type: this.state.type,
            strike: this.state.strike,
            expiry: this.state.expiry,
            spot: this.state.spot,
            order: this.state.order,
            deets: this.state.deets,
            premium: this.state.premium,
            uid: uuid.v4(),
            hidden: false
        };
        this.props.uoa.push(newOption);
        this.hideAndClear();
        this.update();
    }

    update = () => {
        this.props.updateUoa(this.props.auth.uid, this.props.uoa);
        this.props.fetchUserInfo(this.props.auth.uid);      // put these 2 asynch calls in a promise later on
    }

    compare = (item1, item2) => {
        let criteria = this.state.sortBy;
        if((criteria === UOA_SORTING_CRITERIA.SORT_BY_DATE_DECREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_TICKER_DECREASING) || 
                (criteria === UOA_SORTING_CRITERIA.SORT_BY_TYPE_DECREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_STRIKE_DECREASING) || 
                (criteria === UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_DECREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_SPOT_DECREASING) || 
                (criteria === UOA_SORTING_CRITERIA.SORT_BY_ORDER_DECREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        
        if((criteria === UOA_SORTING_CRITERIA.SORT_BY_DATE_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_DATE_DECREASING)) {
            if(item1.date < item2.date)
                return -1;
            else if(item1.date > item2.date)
                return 1;
            else
                return 0;
        }
        
        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_TICKER_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_TICKER_DECREASING)) {
            if(item1.ticker < item2.ticker)
                return -1;
            else if(item1.ticker > item2.ticker)
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_TYPE_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_TYPE_DECREASING)) {
            if(parseInt(item1.type) < parseInt(item2.type))
                return -1;
            else if(parseInt(item1.type) > parseInt(item2.type))
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_STRIKE_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_STRIKE_DECREASING)) {
            if(parseInt(item1.strike) < parseInt(item2.strike))
                return -1;
            else if(parseInt(item1.strike) > parseInt(item2.strike))
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_DECREASING)) {
            if(parseInt(item1.expiry) < parseInt(item2.expiry))
                return -1;
            else if(parseInt(item1.expiry) > parseInt(item2.expiry))
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_SPOT_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_SPOT_DECREASING)) {
            if(parseInt(item1.spot) < parseInt(item2.spot))
                return -1;
            else if(parseInt(item1.spot) > parseInt(item2.spot))
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_ORDER_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_ORDER_DECREASING)) {
            if(parseInt(item1.order) < parseInt(item2.order))
                return -1;
            else if(parseInt(item1.order) > parseInt(item2.order))
                return 1;
            else
                return 0;
        }

        else if((criteria === UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_INCREASING) || (criteria === UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_DECREASING)) {
            if(parseInt(item1.premium) < parseInt(item2.premium))
                return -1;
            else if(parseInt(item1.premium) > parseInt(item2.premium))
                return 1;
            else
                return 0;
        }
    }

    sortByDate = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_DATE_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_DATE_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_DATE_INCREASING })
        }
        this.sortIt();
    }

    sortByTicker = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_TICKER_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_TICKER_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_TICKER_INCREASING })
        }
        this.sortIt();
    }

    sortByType = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_TYPE_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_TYPE_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_TYPE_INCREASING })
        }
        this.sortIt();
    }

    sortByStrike = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_STRIKE_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_STRIKE_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_STRIKE_INCREASING })
        }
        this.sortIt();
    }

    sortByExpiry = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_INCREASING })
        }
        this.sortIt();
    }

    sortBySpot = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_SPOT_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_SPOT_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_SPOT_INCREASING })
        }
        this.sortIt();
    }

    sortByOrder = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_ORDER_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_ORDER_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_ORDER_INCREASING })
        }
        this.sortIt();
    }

    sortByPremium = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_PREMIUM_INCREASING })
        }
        this.sortIt();
    }

    sortIt = () => {
        this.props.uoa.sort(this.compare);
        this.props.updateUoa(this.props.auth.uid, this.props.uoa);
    }

    handleFilter = () => {
        /*
            filter idea:
            make a new field called hidden or something, mark true if filtered out and then in UoaCard, dont render anything if it's hidden
        */
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container">
                <div className="filter_container">
                    <h5>Filter by</h5>
                    <div className="filter_field_containers">
                        <label htmlFor="date_filter">Date</label>
                        <input type="date" name="date_filter" className="filter_fields" onChange={this.handleChange}/>
                    </div>
                    <div className="filter_field_containers">
                        <label htmlFor="ticker_filter">Ticker</label>
                        <input type="text" name="ticker_filter" className="filter_fields" onChange={this.handleChange}/>
                    </div>
                    <div className="filter_button_container">
                        <button className="filter_button" onClick={this.handleFilter}>Search</button>
                    </div>
                </div>

                <div className="uoa_container">
                    <div className="uoa_header_card">
                        <div className="date_header" onClick={this.sortByDate}>
                            Date
                        </div>
                        <div className="ticker_header" onClick={this.sortByTicker}>
                            Ticker
                        </div>
                        <div className="type_header" onClick={this.sortByType}>
                            Type
                        </div>
                        <div className="strike_header" onClick={this.sortByStrike}>
                            Strike
                        </div>
                        <div className="expiry_header" onClick={this.sortByExpiry}>
                            Expiry
                        </div>
                        <div className="spot_header" onClick={this.sortBySpot}>
                            Spot
                        </div>
                        <div className="order_header" onClick={this.sortByOrder}>
                            Order
                        </div>
                        <div className="deets_header">
                            Deets
                        </div>
                        <div className="premium_header" onClick={this.sortByPremium}>
                            Premium
                        </div>
                    </div>
                </div>
                <UoaLinks uoa={this.props.uoa} deleteAndUpdate={this.update} />
                <br />
                <div className="new_button_container"><button onClick={this.showModal}>Add a New Option</button></div>
                
                <div className="modal" style={this.getStyle()}>
                    <span className="close" onClick={this.hideAndClear}>&times;</span>
                    <div className="form-container">
                        <div className="modal-field">
                            <label htmlFor="date" className="date_labels">Date</label>
                            <input type="date" name="date" id="date_field" onChange={this.handleChange} />
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="ticker">Ticker</label>
                            <input type="text" name="ticker" id="ticker_field" onChange={this.handleChange} />
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="strike">Strike</label>
                            <input type="number" name="strike" id="strike_field" min="0" onChange={this.handleChange} />
                        </div>
                        <div className="modal-field">
                            <label htmlFor="expiry" className="date_labels">Expiry</label>
                            <input type="date" name="expiry" id="expiry_field" onChange={this.handleChange} />
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="spot">Spot</label>
                            <input type="number" name="spot" id="spot_field" min="0" onChange={this.handleChange} />
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="deets">Details</label>
                            <input type="text" name="deets" id="deets_field" onChange={this.handleChange} />
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="premium">Premium</label>
                            <input type="number" name="premium" id="premium_field" min="0" onChange={this.handleChange} />
                        </div>
                        <div className="modal-field">
                            <select className="dropdown" name="type" id="select_type" defaultValue={'DEFAULT'} onChange={this.handleChange}>
                                <option value="" value="DEFAULT" disabled>Select option type</option>
                                <option value="calls">Calls</option>
                                <option value="puts">Puts</option>
                            </select>
                        </div>
                        <div className="modal-field">
                            <select className="dropdown" name="order" id="select_order" defaultValue={'DEFAULT'} onChange={this.handleChange}>
                                <option value="" value="DEFAULT" disabled>Select order type</option>
                                <option value="sweep">Sweep</option>
                                <option value="block">Block</option>
                                <option value="split">Split</option>
                            </select>
                        </div>
                        <div className="new_button_container"><button onClick={this.addNewOption}>Submit</button></div>
                    </div>
                </div>
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
    updateUoa : (uid, newUoa) => dispatch(updateUoa(uid, newUoa)),
    fetchUserInfo: uid => dispatch(fetchUserInfo(uid))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(UoaScreen);