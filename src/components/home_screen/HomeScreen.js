import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/constants';
import { updateScreen } from '../../store/actionCreators';
import CanvasJSReact from '../canvasjs/canvasjs.react';
import { round } from 'lodash';
import SectorLinks from './SectorLinks';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

/*
    comments on localstorage
    user info need to be retrieved at least once when the browser's local storage is fresh (first time logging into the site with this browser or after a clear browser setting)
    for now, keep the componentdidmount functions for the "first time" retrieval and have it stored in local storage
    might be able to fix this by checking if localstorage returns undefined and then if it is, we call them
*/

class HomeScreen extends Component {
    /*
         what to display:
            1. left side top: a pie chart showing how much money is in each sector
            2. right side: a table that shows each sector and how much money is in each sector, complementing the information in the chart
                a. each sector card is also clickable and expandable
                    after expanding, it will show a table similar to which it is nested within, showing each company in this sector and how much premium is invested in it
            3. left side bottom (boxed): complementing the right side table will be a small table with the following information:
                a. company name and ticker, industry, market cap
                b. short term, mid term, and long term sentiment calculated based on total premium, expiration dates, and call-put ratio
                    i. term sentiment shall have 5 values: extremely bullish, bullish, neutral, bearish, and extremely bearish
        
        COMPANY MAP OBJECT = {
            sector
            industry
            market cap
            # of 30 day puts contracts
            # of 30 day calls contracts
            $ of 30 day puts contracts
            $ of 30 day calls contracts
            # of 180 day puts contracts
            # of 180 day calls contracts
            $ of 180 day puts contracts
            $ of 180 day calls contracts
            # of 180+ day puts contracts
            # of 180+ day calls contracts
            $ of 180+ day puts contracts
            $ of 180+ day calls contracts
        }
        # used to calculate put/call ratio
        $ used to calculate put/call premium ratio
        both combined will be used to determine sentiment for the 3 time periods
    */
    state = {
        sectors: new Map(),             // maps sectors to total premium
        percentage: new Map(),          // maps sectors to premium's percentage total
        companies: new Map(),           // maps a company to an object of information SEE COMPANY MAP OBJECT ABOVE
        loading: true,
        pie_data: []
    }

    componentDidMount = () => {
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);

        // initialize the sectors map with value (premium) at 0
        this.props.sectors.forEach(sector => {
            if(sector !== "Miscellaneous" && sector !=="n/a")
                this.state.sectors.set(sector, 0);
        });

        // loop through each flow
        let premium = 0;
        this.props.uoa.forEach(flow => {
            let index = this.binarySearchString(flow.ticker);
            if(index > -1) {
                let company = this.props.tickers[index];
                if(company.sector !== "Miscellaneous" && company.sector !=="n/a") {
                    this.state.sectors.set(company.sector, parseInt(this.state.sectors.get(company.sector)) + parseInt(flow.premium));
                    premium += parseInt(flow.premium);
                }
            }
        });
        let pie_data = [];
        for(const [key, value] of this.state.sectors.entries()) {
            let percent = round((value / premium) * 100);
            this.state.percentage.set(key, percent);
            let data_point = {
                y: percent,
                label: key
            };
            pie_data.push(data_point);
        }
        this.setState({pie_data: pie_data});
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

    /* 
        get the time in days between 2 dates
        @param date1 Date object
        @param date2 Date object
    */
    differenceBetweenDates = (date1, date2) => {
        return (Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
    }

    render() {
        if(!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        const options = {
            theme: "dark2",
			animationEnabled: true,
			exportFileName: "sector_breakdown",
			exportEnabled: true,
			title:{
				text: "Sector Breakdown by Total Premium"
			},
			data: [{
                type: "pie",
                startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: this.state.pie_data
			}]
        }
        
        return (
            <div className="dashboard container">
                <div className="left-panel">
                    <h5>Welcome, { this.props.username }.</h5>
                    <div><CanvasJSChart options = {options} /* onRef={ref => this.chart = ref} */ /></div>
                    <div>
                        Idea:<br/>
                        keep this side of the page fixed<br/>
                        let the other side expand as each user click on a sector and scroll<br/>
                        let the chart change to a specific ticker's chart when clicked<br/>
                        and this area here where the idea is will change to texts analyzing this ticker<br/>
                        analysis of company:<br/>
                            calculate the days til expiration of each flow and see what range it falls into<br/>
                            30 days outlook<br/>
                            180 days months outlook<br/>
                            365 days and beyond outlook<br/>
                        provide an overall sentiment for the short term, mid term, and long term based on premium flow
                        <br/><br/>
                        finally, get a loading screen done
                    </div>
                </div>

                <div className="right-panel">
                    <SectorLinks sectors={this.state.sectors} percentage={this.state.percentage} companies={this.state.companies} />
                </div>
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