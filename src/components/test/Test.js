import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { updateDataCollection, retrieveCompanies } from '../../store/asynchHandler.js';

/*
    database architecture:
        collections:
            data:
                documents:
                    market:
                        companies: array of objects
                            each object have fields:
                                industry: string
                                ipo_year: string
                                market_cap: string
                                name: string
                                sector: string
                                ticker: string
                                uid: string
                        sectors: array of strings
            users:
                documents:
                    each user document:
                        email: string
                        firstName: string
                        initials: string
                        lastName: string
                        uoa: array of objects
                            each object have fields:
                                date: string
                                deets: string
                                expiry: string
                                order: string
                                premium: number
                                spot: number
                                strike: number
                                ticker: string
                                type: string
                                uid: string
                        username: string
*/

class Test extends Component {
    state = {
        data: [],
        sectors: new Map()      // originally maps sector to an array of industries
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
                    this.state.sectors.set(company.sector, 0);
                    /*
                    let industries = this.state.sectors.get(company.sector);
                    if(industries === undefined)   // if the industries array is not defined and not initialized
                        this.state.sectors.set(company.sector, []);
                    else {
                        industries.push(company.industry);
                        this.state.sectors.set(company.sector, industries);
                    }
                    */
                }
                this.sortByTicker();
                console.log(this.state.data);
            }
            reader.readAsText(fileUpload.files[0]);
        }
    }

    compare = (item1, item2) => {
        if(item1 < item2)
            return -1;
        else if(item1 > item2)
            return 1;
        else
            return 0;
    }

    compareTickers = (item1, item2) => {
        if(item1.ticker < item2.ticker)
            return -1;
        else if(item1.ticker > item2.ticker)
            return 1;
        else
            return 0;
    }

    sortByTicker = () => {
        this.state.data.sort(this.compareTickers);
    }

    // precondition: sorted
    removeDuplicates = (arr) => {
        for(let i = arr.length - 1; i >= 0; i--) {
            if(arr[i] === arr[i-1])
                arr.splice(i, 1);
        }
        return arr;
    }

    uploadDataToDataCollection = () => {
        for(let i = this.state.data.length - 1; i > 0; i--) {
            let current = this.state.data[i];
            let prev = this.state.data[i-1];
            if(current.uid === prev.uid)
                this.state.data.splice(i, 1);
        }
        /*
        // sort and remove duplicate values in the industries array
        for(const [key, value] of this.state.sectors.entries()) {
            let dataArr = value;
            dataArr.sort(this.compare);
            let finalArr = this.removeDuplicates(dataArr);
            this.state.sectors.set(key, finalArr);
        }

        console.log(Array.from(this.state.sectors.keys()));
        console.log(Array.from(this.state.sectors.values()));
        */
        this.props.updateDataCollection(this.state.data, Array.from(this.state.sectors.keys()).sort(this.compare));
    }

    loadData = () => {
        this.props.retrieveCompanies();
    }

    exportData = () => {
        console.log(this.props.tickers);
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
                    <button onClick={this.uploadDataToDataCollection}>Update DB in data collection</button><br/><br/><br/>
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
    retrieveCompanies : () => dispatch(retrieveCompanies()),
    updateDataCollection : (companies, sectors) => dispatch(updateDataCollection(companies, sectors))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(Test);