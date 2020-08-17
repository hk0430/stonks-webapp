import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';


class CompanyLinks extends Component {
    render() {
        let { companies } = this.props;
        return (
            <div className="sector-links-wrapper">
                {companies}
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