import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import timeago from 'timeago.js';
import Web3 from 'web3'
import './HighestBid.css';

class HighestBid extends Component {
  render() {
    return (
      <div className="HighestBid">
        <div className="highest-bid-title">current bid</div>
        <div className="highest-bid-amount">{Number(this.props.bid).toPrecision(4)} ETH</div>
        <div className="highest-bid-time">{timeago().format(this.props.time * 1000)}</div>
      </div>
    );
  }
}

export default HighestBid;
