import React, { Component } from 'react';

import Expand from 'react-expand-animated';
import CompanyLinks from './CompanyLinks';

class SectorCard extends Component {
    state = {
        open: false
    }

    toggle = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        let premium_in_mil = (this.props.premium / 1000000).toFixed(2) + 'M';
        return (
            <div className="card sector-wrapper z-depth-0">
                <div className="sector-card" onClick={this.toggle}>
                    <span>{this.props.sector}</span>
                    <span>{premium_in_mil} ({this.props.percentage}%)</span>
                </div>
                <Expand open={this.state.open}>
                    <div>Yeet</div>
                    <CompanyLinks />
                </Expand>
            </div>
        );
    }
}

export default SectorCard;