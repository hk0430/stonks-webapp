import React, { Component } from 'react';

import UoaCard from './UoaCard.js';

class UoaLinks extends Component {
    deleteOption = index => {
        this.props.uoa.splice(index, 1);
        this.props.deleteAndUpdate();
    }

    render() {
        const { uoa } = this.props;
        return (
            <div>
                {uoa && uoa.map((option, index) => {
                    return (
                        <UoaCard 
                            option={option} 
                            key={index} 
                            index={index}
                            deleteOption={this.deleteOption}
                        />
                    );})
                }
            </div>
        );
    }
}

export default UoaLinks;