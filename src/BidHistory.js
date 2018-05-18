import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './BidHistory.css';

class BidHistory extends Component {
  render() {
    const historyItems = this.props.history.map((obj) => {
      return <li>{obj.address}{obj.amount}</li>
    })
    console.log(historyItems);
    return (
      <div className="BidHistory">
        bids
        <div className="history-wrapper">
          <ul>{historyItems}</ul>
        </div>
      </div>
    );
  }
}

export default BidHistory;
