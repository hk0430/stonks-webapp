import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import { showAnalysis } from '../../store/actionCreators';
import { STOCK_SENTIMENT_SCALE } from '../../store/constants';

class CompanyCard extends Component {
    /*
        algorithm for calculating sentiment (my own custom, yet simple algorithm)
            1. calculate the p/c ratio for each time period
            2. calculate the premium p/c ratio for each time period
            3. determine the sentiment based on the following scale:
                EXTREMELY BULLISH: [0, 0.3]
                BULLISH: (0.3, 0.7]
                NEUTRAL: (0.7, 1.3)
                BEARISH: [1.3, 2)
                EXTREMELY BEARISH: [2, inf]
    */
    analyze = () => {
        let data = this.props.company_info;

        let analysis = {
            ticker: this.props.ticker,
            sector: data.sector,
            industry: data.industry,
            market_cap: data.market_cap,
            short_term_sentiment: '',
            short_term_pc_ratio: 0,
            mid_term_sentiment: '',
            mid_term_pc_ratio: 0,
            long_term_sentiment: '',
            long_term_pc_ratio: 0,
            overall_rating: ''
        }

        let st_pc_ratio = data.num_30d_puts / data.num_30d_calls;
        if(isNaN(st_pc_ratio)) st_pc_ratio = Infinity;
        analysis.short_term_pc_ratio = st_pc_ratio;

        let mt_pc_ratio = data.num_180d_puts / data.num_180d_calls;
        if(isNaN(mt_pc_ratio)) mt_pc_ratio = Infinity;
        analysis.mid_term_pc_ratio = mt_pc_ratio;

        let lt_pc_ratio = data.num_long_puts / data.num_long_calls;
        if(isNaN(lt_pc_ratio)) lt_pc_ratio = Infinity;
        analysis.long_term_pc_ratio = lt_pc_ratio;

        this.props.showAnalysis(this.props.ticker, analysis);
    }

    calculate_sentiment = ratio => {
        if(ratio >= 0 && ratio <= 0.3)  return STOCK_SENTIMENT_SCALE.EXTREMELY_BULLISH;
        else if(ratio > 0.3 && ratio <= 0.7)    return STOCK_SENTIMENT_SCALE.BULLISH;
        else if(ratio > 0.7 && ratio < 1.3) return STOCK_SENTIMENT_SCALE.NEUTRAL;
        else if(ratio >= 1.3 && ratio < 2)  return STOCK_SENTIMENT_SCALE.BEARISH;
        else    return STOCK_SENTIMENT_SCALE.EXTREMELY_BEARISH;
    }

    render() {
        return (
            <div className="card company-card z-depth-0" onClick={this.analyze}>
                <span>{this.props.ticker}</span>
                <span>{this.props.company_info.industry}</span>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    showAnalysis: (ticker, analysis) => dispatch(showAnalysis(ticker, analysis))
});

export default compose(
    connect(null, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(CompanyCard);