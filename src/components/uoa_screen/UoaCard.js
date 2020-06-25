import React, { Component } from 'react';

class UoaCard extends Component {
    handleDeleteOption = () => {
        this.props.deleteOption(this.props.index);
    }

    render() {
        var premium = this.props.option.premium;
        if(premium >= 1000 && premium < 1000000)
            premium = premium / 1000 + "K";
        else if(premium >= 1000000)
            premium = premium / 1000000 + "M";

        return (
            <div className="card z-depth-0">
                <div className="card-content grey-text text-darken-3">
                    <div className="option_date">{this.props.option.date}</div>
                    <div className="option_ticker">{this.props.option.ticker}</div>
                    <div className="option_type">{this.props.option.type}</div>
                    <div className="option_strike">{this.props.option.strike}</div>
                    <div className="option_expiry">{this.props.option.expiry}</div>
                    <div className="option_spot">{this.props.option.spot}</div>
                    <div className="option_order">{this.props.option.order}</div>
                    <div className="option_deets">{this.props.option.deets}</div>
                    <div className="option_premium">{premium}</div>
                    <div className="option_delete">
                        <span onClick={this.handleDeleteOption}>&#128465;</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UoaCard;