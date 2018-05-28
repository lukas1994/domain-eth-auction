import React, { Component } from 'react';
import './BidHistory.css';

class Bid extends Component {
  render() {
    return (
      <div className="Bid">
        <div className="bid-inner">
          <span className="bid-counter">#{this.props.counter}</span>
          <span className="bid-address">{this.props.address}</span>
          <span className="bid-amount">{Number(this.props.amount).toPrecision(3)} ETH</span>
        </div>
      </div>
    )
  }
}

class BidHistory extends Component {
  render() {
    const historyItems = this.props.history.map((obj, index) => {
      return <Bid key={index} counter={index + 1} address={obj.address} amount={obj.amount} />
    }).reverse()
    console.log(historyItems);
    return (
      <div className="BidHistory">
        <h3>recent bids</h3>
        <div className="history-wrapper">
          {historyItems.slice(0,12)}
        </div>
      </div>
    );
  }
}

export default BidHistory;
