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
        ticker_filter: '',
        filtered_elements: [],
        filtering: false
    }

    resetState = () => {
        this.setState({
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
            ticker_filter: '',
            filtered_elements: [],
            filtering: false,
            wrongFile: false
        });
    }

    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          [target.name]: target.value,
        }));
    }

    getStyle = (code) => {
        if(code === 0) {
            return {
                display: this.state.modalState ? 'block' : 'none'
            }
        } else {
            return {
                display: this.state.wrongFile ? 'block' : 'none'
            }
        }
    }

    showModal = () => {
        this.setState({modalState: true});
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if(dd < 10)
            dd = "0" + dd;
        if(mm < 10)
            mm = "0" + mm;
        document.getElementById("date_field").value = mm + "/" + dd + "/" + yyyy;
        this.setState({date: yyyy + "-" + mm + "-" + dd});
    }

    /*
        hides the modal and clear the fields of the inputs
    */
    hideAndClear = () => {
        this.setState({
            modalState: false
        });
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
        let newOption = {
            date: this.state.date,
            ticker: this.state.ticker.toUpperCase(),
            type: this.state.type,
            strike: this.state.strike,
            expiry: this.state.expiry,
            spot: this.state.spot,
            order: this.state.order,
            deets: this.state.deets,
            premium: this.state.premium,
            uid: uuid.v4()
        };
        this.props.uoa.push(newOption);
        this.handleFilter();
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

    sortByExpiry = () => {
        if(this.state.sortBy === UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_INCREASING) {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_DECREASING })
        }
        else {
            this.setState({ sortBy: UOA_SORTING_CRITERIA.SORT_BY_EXPIRY_INCREASING })
        }
        this.sortIt();
    }

    sortIt = () => {
        if(!this.state.filtering) {
            this.props.uoa.sort(this.compare);
            this.props.updateUoa(this.props.auth.uid, this.props.uoa);
        } else {
            this.state.filtered_elements.sort(this.compare);
        }
    }

    handleFilter = () => {
        if(this.state.date_filter === "" && this.state.ticker_filter === "") {
            this.setState({filtering: false, filtered_elements: []});
            return;
        }

        this.setState({filtered_elements: []}, () => {
            let date_req = this.state.date_filter;
            let ticker_req = this.state.ticker_filter.toUpperCase();
            for(let i = this.props.uoa.length - 1; i >= 0; i--) {
                let current = this.props.uoa[i];
                if(this.state.date_filter === "")
                    date_req = current.date;
                if(this.state.ticker_filter === "")
                    ticker_req = current.ticker;
                if(date_req === current.date && ticker_req === current.ticker)
                    this.state.filtered_elements.push(current);
                date_req = this.state.date_filter;
                ticker_req = this.state.ticker_filter.toUpperCase();
            }
            this.setState({filtering: true}, () => {
                console.log(this.state.filtered_elements);
            });
        });
    }

    handleReset = () => {
        document.getElementById("date_filter").value = "";
        document.getElementById("ticker_filter").value = "";
        this.setState({filtering: false, date_filter: "", ticker_filter: "", filtered_elements: []});
    }

    deleteFromMain = key => {
        for(let i = 0; i < this.props.uoa.length; i++) {
            if(key === this.props.uoa[i].uid)
                this.props.uoa.splice(i, 1);
        }
        this.update();
    }

    importExcel = () => {
        let fileUpload = document.getElementById("csvfile");
        let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
        if(regex.test(fileUpload.value.toLowerCase())) {
            if(typeof(FileReader) != "undefined") {
                this.props.uoa.splice(0, this.props.uoa.length);
                let reader = new FileReader();
                reader.onload = (e) => {
                    let rows = e.target.result.split("\n");
                    for (let i = 1; i < rows.length - 1; i++) {
                        let optionStr = rows[i].split(",");
                        let option = {
                            date: optionStr[0],
                            ticker: optionStr[1],
                            type: optionStr[2],
                            strike: optionStr[3],
                            expiry: optionStr[4],
                            spot: optionStr[5],
                            order: optionStr[6],
                            deets: optionStr[7],
                            premium: optionStr[8],
                            uid: uuid.v4()
                        }
                        this.props.uoa.push(option);
                    }
                    this.update();
                    this.resetState();
                }
                reader.readAsText(fileUpload.files[0]);
            }
        } else {
            this.setState({wrongFile: true});
        }
    }

    hideWrongFile = () => {
        this.setState({wrongFile: false});
    }

    exportExcel = () => {
        let data = [];
        data.push(["date", "ticker", "type", "strike", "expiry", "spot", "order", "details", "premium"]);
        for(let i = 0; i < this.props.uoa.length; i++) {
            let x = this.props.uoa[i];
            data.push([x.date, x.ticker, x.type, x.strike, x.expiry, x.spot, x.order, x.deets, x.premium]);
        }
        let csv = "";
        data.forEach((rowItem, rowIndex) => {
            rowItem.forEach((colItem, colIndex) => {
              csv += colItem + ',';
            });
            csv += "\r\n";
        });
        csv = "data:application/csv," + encodeURIComponent(csv);
        let file = document.createElement("A");
        file.setAttribute("href", csv);
        file.setAttribute("download", "flow.csv");
        document.body.appendChild(file);
        file.click();
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
                        <input type="date" name="date_filter" className="filter_fields" id="date_filter" onChange={this.handleChange}/>
                    </div>
                    <div className="filter_field_containers">
                        <label htmlFor="ticker_filter">Ticker</label>
                        <input type="text" name="ticker_filter" className="filter_fields" id="ticker_filter" onChange={this.handleChange}/>
                    </div>
                    <div className="commands_container">
                        <button className="alpha" onClick={this.importExcel}>Import</button>
                        <input className="alpha" type="file" id="csvfile"></input><br/>
                        <button className="alpha" onClick={this.exportExcel}>Export</button><br/>
                    </div>
                    <div className="filters_container">
                        <button className="bravo" onClick={this.handleFilter}>Search</button>
                        <button className="bravo" onClick={this.handleReset}>Reset</button>
                        <button className="bravo" onClick={this.showModal}>Add a New Option</button>
                    </div>
                </div>

                <div className="uoa_container">
                    <div className="uoa_header_card non-sortable">
                        <div className="date_header sortable" onClick={this.sortByDate}>
                            Date
                        </div>
                        <div className="ticker_header sortable" onClick={this.sortByTicker}>
                            Ticker
                        </div>
                        <div className="type_header">
                            Type
                        </div>
                        <div className="strike_header">
                            Strike
                        </div>
                        <div className="expiry_header sortable" onClick={this.sortByExpiry}>
                            Expiry
                        </div>
                        <div className="spot_header">
                            Spot
                        </div>
                        <div className="order_header">
                            Order
                        </div>
                        <div className="deets_header">
                            Deets
                        </div>
                        <div className="premium_header">
                            Premium
                        </div>
                    </div>
                </div>
                {this.state.filtering ? <UoaLinks uoa={this.state.filtered_elements} filtering={this.state.filtering} deleteFromMain={this.deleteFromMain}/> 
                    : <UoaLinks uoa={this.props.uoa} filtering={this.state.filtering} deleteFromMain={this.deleteFromMain}/>}
                <br />
                {/*<div className="new_button_container"><button onClick={this.showModal}>Add a New Option</button></div>*/}
                
                <div className="modal" style={this.getStyle(0)}>
                    <span className="close" onClick={this.hideAndClear}>&times;</span>
                    <div className="form-container">
                        <div className="modal-field">
                            <label htmlFor="date" className="date_labels">Date</label>
                            <input type="text" name="date" id="date_field" disabled/>
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="ticker">Ticker</label>
                            <input type="text" name="ticker" id="ticker_field" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="strike">Strike</label>
                            <input type="number" name="strike" id="strike_field" min="0" onChange={this.handleChange}/>
                        </div>
                        <div className="modal-field">
                            <label htmlFor="expiry" className="date_labels">Expiry</label>
                            <input type="date" name="expiry" id="expiry_field" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="spot">Spot</label>
                            <input type="number" name="spot" id="spot_field" min="0" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="deets">Details</label>
                            <input type="text" name="deets" id="deets_field" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field modal-field">
                            <label htmlFor="premium">Premium</label>
                            <input type="number" name="premium" id="premium_field" min="0" onChange={this.handleChange}/>
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

                <div className="modal_warning" style={this.getStyle(1)}>
                    <span className="close" onClick={this.hideWrongFile}>&times;</span>
                    <h5 className="warning">Only .csv files will be accepted for imports.</h5>
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