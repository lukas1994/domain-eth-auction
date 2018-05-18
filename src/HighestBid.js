import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './App.css';

class HighestBid extends Component {
  render() {
    return (
      <div className="HighestBid">
        highest bid
        <br/>
        {this.props.bid}
        <br/>
        {this.props.time}
      </div>
    );
  }
}

export default HighestBid;
