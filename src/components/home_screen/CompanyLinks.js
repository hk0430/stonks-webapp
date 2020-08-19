import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import CompanyCard from './CompanyCard';

class CompanyLinks extends Component {
    compare = (item1, item2) => {
        if(item1 < item2)
            return -1;
        else if(item1 > item2)
            return 1;
        else
            return 0;
    }

    render() {
        let { companies, companies_in_this_sector } = this.props;
        companies_in_this_sector.sort(this.compare);
        
        return (
            <div className="company-links-wrapper">
                {companies_in_this_sector && companies_in_this_sector.map(company => {
                    return (
                        <CompanyCard 
                            key={company}
                            ticker={company}
                            company_info={companies.get(company)}
                        />
                    );})
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        uoa: state.manager.currentUoa,
        tickers: state.manager.tickers,
        sectors: state.manager.sectors
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'users' },
    ])
)(CompanyLinks);