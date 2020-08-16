import React, { Component } from 'react';

import SectorCard from './SectorCard';

class SectorLinks extends Component {
    render() {
        let sectors = Array.from(this.props.sectors.keys());
        let premium = Array.from(this.props.sectors.values());
        let percentage = Array.from(this.props.percentage.values());
        return (
            <div className="sector-links-wrapper">
                {sectors && sectors.map((value, index) => {
                    return (
                        <SectorCard 
                            key={value}
                            premium={premium[index]}
                            sector={value}
                            percentage={percentage[index]}
                        />
                    );})
                }
            </div>
        );
    }
}

export default SectorLinks;