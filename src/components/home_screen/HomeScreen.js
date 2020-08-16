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
        data structures needed:
            -> an object (A) that maps a sector name to another object (B), which contains all the companies in that sector and the total premium in that sector
                -> each object (B) shall contain 

        what to display:
            1. a pie chart showing how much money is in each sector
                a. round up every option flow, identify its sector, and add the premium to the sector total
    */
    state = {
        sectors: new Map(),             // maps sectors to total premium
        percentage: new Map(),          // maps sectors to premium's percentage total
        total_premium: 0,
        sectorsToIndustries: new Map()  // maps sectors to a map of industries to total premium
    }

    componentDidMount = () => {
        this.props.updateScreen(APP_SCREEN.LOGIN_SCREEN);

        // initialize the sectors map with value (premium) at 0
        this.props.sectors.forEach(sector => {
            if(sector !== "Miscellaneous" && sector !=="n/a") {
                this.state.sectors.set(sector, 0);

                //this.state.sectorsToIndustries.set(sectors, new Map());
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


                }
            }
        });
        this.setState({total_premium: premium});
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

        let pie_data = [];
        for(const [key, value] of this.state.sectors.entries()) {
            let percent = round((value / this.state.total_premium) * 100);
            this.state.percentage.set(key, percent);
            let data_point = {
                y: percent,
                label: key
            };
            pie_data.push(data_point);
        }
        console.log(pie_data);

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
				dataPoints: pie_data
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
                        and this area here where the idea is will change to texts analyzing this ticker
                    </div>
                </div>

                <div className="right-panel">
                    <SectorLinks sectors={this.state.sectors} percentage={this.state.percentage} />
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