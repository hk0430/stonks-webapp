import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';

import { APP_SCREEN } from '../../store/constants';
import { updateScreen, showAnalysis } from '../../store/actionCreators';
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

        Idea for lower left side of screen:
        keep this side of the page fixed
        let the other side expand as each user click on a sector and scroll
        let the chart change to a specific ticker's chart when clicked
        and this area here where the idea is will change to texts analyzing this ticker
        analysis of company:
            calculate the days til expiration of each flow and see what range it falls into
            30 days outlook
            180 days months outlook
            365 days and beyond outlook
        provide an overall sentiment for the short term, mid term, and long term based on premium flow
        finally, get a loading screen done
    */
    state = {
        sectors: new Map(),             // maps sectors to total premium
        percentage: new Map(),          // maps sectors to premium's percentage total
        companies: new Map(),           // maps a company to an object of information SEE COMPANY MAP OBJECT ABOVE
        sectors_to_companies: new Map(),    // maps a sector to an array of company tickers (keys for the companies array, key is the company ticker)
        loading: true,
        pie_data: []
    }
    
    componentDidMount = () => {
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);
        this.props.showAnalysis('', null);

        // initialize the sectors map with value (premium) at 0
        this.props.sectors.forEach(sector => {
            if(sector !== "Miscellaneous" && sector !=="n/a") {
                this.state.sectors.set(sector, 0);
                this.state.sectors_to_companies.set(sector, []);
            }
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

                    if(this.state.companies.get(company.ticker) === undefined) {
                        let company_info = {
                            sector: company.sector,
                            industry: company.industry,
                            market_cap: company.market_cap,
                            num_30d_puts: 0,
                            num_30d_calls: 0,
                            premium_30d_puts: 0,
                            premium_30d_calls: 0,
                            num_180d_puts: 0,
                            num_180d_calls: 0,
                            premium_180d_puts: 0,
                            premium_180d_calls: 0,
                            num_long_puts: 0,
                            num_long_calls: 0,
                            premium_long_puts: 0,
                            premium_long_calls: 0
                        }
                        this.state.companies.set(company.ticker, company_info);
                    } else {
                        let company_info = this.state.companies.get(company.ticker);
                        let type = flow.type;
                        let num_options = parseInt(flow.deets.split("@")[0]);
                        let money = parseInt(flow.premium);
                        let expiry = flow.expiry.split("-");
                        let days = this.differenceBetweenDates(new Date(), new Date(parseInt(expiry[0]), parseInt(expiry[1]), parseInt(expiry[2])));
                        if(days <= 30) {
                            if(type === "calls") {
                                company_info.num_30d_calls += num_options;
                                company_info.premium_30d_calls += money;
                            } else {
                                company_info.num_30d_puts += num_options;
                                company_info.premium_30d_puts += money;
                            }
                        } else if(days > 30 && days <= 180) {
                            if(type === "calls") {
                                company_info.num_180d_calls += num_options;
                                company_info.premium_180d_calls += money;
                            } else {
                                company_info.num_180d_puts += num_options;
                                company_info.premium_180d_puts += money;
                            }
                        } else {
                            if(type === "calls") {
                                company_info.num_long_calls += num_options;
                                company_info.premium_long_calls += money;
                            } else {
                                company_info.num_long_puts += num_options;
                                company_info.premium_long_puts += money;
                            }
                        }
                    }
                }
            }
        });

        for(const [key, value] of this.state.companies.entries()) {
            let updated_arr = this.state.sectors_to_companies.get(value.sector);
            updated_arr.push(key);
            this.state.sectors_to_companies.set(value.sector, updated_arr);
        }

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

        console.log(this.props.ticker_analyzed);

        return (
            <div className="dashboard container">
                <div className="left-panel">
                    <h5>Welcome, { this.props.username }.</h5>
                    <div><CanvasJSChart options = {options} /* onRef={ref => this.chart = ref} */ /></div>
                    <div className="analysis-wrapper">
                        <div className="analysis-info"><span>Ticker:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Sector:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Industry:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Market Cap:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Short Term Sentiment:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Short Term P/C Ratio:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Mid Term Sentiment:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Mid Term P/C Ratio:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Long Term Sentiment:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Long Term P/C Ratio:</span><span>PLACEHOLDER</span></div>
                        <div className="analysis-info"><span>Overall Rating:</span><span>PLACEHOLDER</span></div>
                    </div>
                </div>

                <div className="right-panel">
                    <SectorLinks 
                        sectors={this.state.sectors}
                        percentage={this.state.percentage}
                        companies={this.state.companies}
                        sectors_to_companies={this.state.sectors_to_companies}
                    />
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
        sectors: state.manager.sectors,
        ticker_analyzed: state.manager.ticker_analyzed
    };
};

const mapDispatchToProps = dispatch => ({
    updateScreen: newScreen => dispatch(updateScreen(newScreen)),
    showAnalysis: (ticker, analysis) => dispatch(showAnalysis(ticker, analysis))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(HomeScreen);