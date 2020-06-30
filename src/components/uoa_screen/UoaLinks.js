import React, { Component } from 'react';

import UoaCard from './UoaCard.js';

class UoaLinks extends Component {
    deleteOption = key => {
        console.log(key);
        if(this.props.filtering) {
            // delete from filtered list (this.props.uoa) and from the actual uoa
            for(let i = 0; i < this.props.uoa.length; i++) {
                if(key === this.props.uoa[i].uid)
                    this.props.uoa.splice(i, 1);
            }
        }
        this.props.deleteFromMain(key);
    }

    render() {
        const { uoa } = this.props;
        return (
            <div>
                {uoa && uoa.map(option => {
                    return (
                        <UoaCard 
                            option={option} 
                            key={option.uid}
                            uid={option.uid}
                            deleteOption={this.deleteOption}
                        />
                    );})
                }
            </div>
        );
    }
}

export default UoaLinks;