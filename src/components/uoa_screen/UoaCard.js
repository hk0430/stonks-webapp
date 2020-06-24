import React, { Component } from 'react';

class UoaCard extends Component {
    state = {
        ticker: '',
        type: 'Calls',
        strike: 0,
        expiry: '',
        spot: 0,
        deets: '',
        premium: 0
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.option !== prevProps.option) {
            this.setState({
                ticker: this.props.option.ticker,
                type: this.props.option.type,
                strike: this.props.option.strike,
                expiry: this.props.option.expiry,
                spot: this.props.option.spot,
                deets: this.props.option.deets,
                premium: this.props.option.premium
            });
        }
    }

    handleDeleteOption = () => {
        this.props.deleteOption(this.props.index);
    }

    render() {
        return (
            <div className="card z-depth-0">
                <div className="card-content grey-text text-darken-3">
                    <div className="option_ticker">{this.state.ticker}</div>
                    <div className="option_type">{this.state.type}</div>
                    <div className="option_strike">{this.state.strike}</div>
                    <div className="option_expiry">{this.state.expiry}</div>
                    <div className="option_spot">{this.state.spot}</div>
                    <div className="option_deets">{this.state.deets}</div>
                    <div className="option_premium">{this.state.premium}</div>
                    <div className="option_delete">
                        <span onClick={this.handleDeleteOption}>&#128465;</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UoaCard;