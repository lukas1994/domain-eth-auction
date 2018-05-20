import React, { Component } from 'react';
import './WinningBids.css';

class WinningBid extends Component {
    render() {
        const className = this.props.counter === 0 ? "WinningBid current-winner" : "WinningBid"
        return (
          <div className={className}>
            <div className="winning-bid-inner">
              <div className="winning-bid-amount">{this.props.amount} ETH</div>
              <div className="winning-bid-url">{this.props.url}</div>
              <div className="winning-bid-address">{this.props.address}</div>
            </div>
          </div>
        )
    }
}

class WinningBids extends Component {
  render() {
    const winningBids = this.props.winners.map((obj, index) => {
      return <WinningBid key={index} counter={index} address={obj.address} amount={obj.amount} url={obj.url}/>
    })

    return (
      <div className="WinningBids">
        <h3>winners</h3>
        <div className="winners-wrapper">
          {winningBids}
        </div>
      </div>
    )
  }
}

export default WinningBids;
