import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { uploadTickersToDb, retrieveTickers, updateDataCollection } from '../../store/asynchHandler.js';

class Test extends Component {
    state = {
        data: []
    }

    importData = () => {
        let fileUpload = document.getElementById("ticker_data");
        if(typeof(FileReader) != "undefined") {
            let reader = new FileReader();
            reader.onload = (e) => {
                let rows = e.target.result.split("\n");
                for (let i = 1; i < rows.length - 1; i++) {
                    let optionStr = rows[i].split(",");
                    let company = {
                        uid: optionStr[0],
                        ticker: optionStr[0],
                        name: optionStr[1],
                        market_cap: optionStr[3],
                        ipo_year: optionStr[4],
                        sector: optionStr[5],
                        industry: optionStr[6]
                    }
                    this.state.data.push(company);
                }
                this.sortByTicker();
                console.log(this.state.data);
            }
            reader.readAsText(fileUpload.files[0]);
        }
    }

    compare = (item1, item2) => {
        if(item1.ticker < item2.ticker)
            return -1;
        else if(item1.ticker > item2.ticker)
            return 1;
        else
            return 0;
    }

    sortByTicker = () => {
        this.state.data.sort(this.compare);
    }

    uploadDataToDb = () => {
        for(let i = this.state.data.length - 1; i > 0; i--) {
            let current = this.state.data[i];
            let prev = this.state.data[i-1];
            if(current.uid === prev.uid)
                this.state.data.splice(i, 1);
        }
        console.log(this.state.data.length);
        this.props.uploadTickersToDb(this.state.data);
    }

    uploadDataToDataCollection = () => {
        for(let i = this.state.data.length - 1; i > 0; i--) {
            let current = this.state.data[i];
            let prev = this.state.data[i-1];
            if(current.uid === prev.uid)
                this.state.data.splice(i, 1);
        }
        console.log(this.state.data.length);
        this.props.updateDataCollection(this.state.data);
    }

    loadData = () => {
        this.props.retrieveTickers();
    }

    exportData = () => {
        let data = [];
        data.push(["ticker", "name", "intentionally empty", "market cap", "ipo year", "sector", "industry"]);
        for(let i = 0; i < this.props.tickers.length; i++) {
            let x = this.props.tickers[i];
            data.push([x.ticker, x.name, "", x.market_cap, x.ipo_year, x.sector, x.industry]);
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
        file.setAttribute("download", "tickers.csv");
        document.body.appendChild(file);
        file.click();
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        const { profile } = this.props;
        if(profile.username === "admin") {
            console.log(this.state.data.length);
            return (
                <div className="test_container">
                    <p>Data pulled from NASDAQ, NYSE, AMEX</p><br/>
                    <input type="file" id="ticker_data"></input><br/>
                    <button onClick={this.importData}>Import</button><br/>
                    <button onClick={this.uploadDataToDb}>Update DB</button><br/>
                    <button onClick={this.uploadDataToDataCollection}>Update DB in data collection</button><br/>
                    <button onClick={this.loadData}>Load</button>
                    <button onClick={this.exportData}>Export</button>
                </div>)
        } else {
            return (
                <div className="test_container">
                    SIR, YOU ARE NOT SUPPOSED TO BE HERE!!! PLEASE EXIT IMMEDIATELY.
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        tickers: state.manager.tickers
    };
};

const mapDispatchToProps = dispatch => ({
    uploadTickersToDb : (data) => dispatch(uploadTickersToDb(data)),
    retrieveTickers : () => dispatch(retrieveTickers()),
    updateDataCollection : (data) => dispatch(updateDataCollection(data))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(Test);