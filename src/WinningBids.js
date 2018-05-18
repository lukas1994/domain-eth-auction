import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './WinningBids.css';

class WinningBid extends Component {
    render() {
        return (
          <div className="WinningBid">
            {this.props.amount} <br/>
            {this.props.url} <br/>
            {this.props.address}
          </div>  
        )
    }
}

class WinningBids extends Component {
  render() {
    const winningBids = this.props.winners.map(obj => {
      return <WinningBid address={obj.address} amount={obj.amount} url={obj.url}/>
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
