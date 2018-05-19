import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './BidHistory.css';

class Bid extends Component {
  render() {
    return (
      <div className="Bid">
        <div className="bid-inner">
          <span className="bid-counter">#{this.props.counter}</span>
          <span className="bid-address">{this.props.address}</span>
          <span className="bid-amount">{Number(this.props.amount).toPrecision(2)} ETH</span>
        </div>
      </div>
    )
  }
}

class BidHistory extends Component {
  render() {
    const historyItems = this.props.history.map((obj, index) => {
      return <Bid key={index} counter={index} address={obj.address} amount={obj.amount} />
    }).reverse()
    console.log(historyItems);
    return (
      <div className="BidHistory">
        <h3>bids</h3>
        <div className="history-wrapper">
          {historyItems}
        </div>
      </div>
    );
  }
}

export default BidHistory;
