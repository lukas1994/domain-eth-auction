import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './HighestBid.css';

class HighestBid extends Component {
  render() {
    return (
      <div className="HighestBid">
        <div className="highest-bid-title">current bid</div>
        <div className="highest-bid-amount">{this.props.bid} ETH</div>
        <div className="highest-bid-time">{this.props.time}</div>
      </div>
    );
  }
}

export default HighestBid;
