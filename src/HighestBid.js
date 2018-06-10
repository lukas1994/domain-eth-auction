import React, { Component } from 'react';
import timeago from 'timeago.js';
import './HighestBid.css';

class HighestBid extends Component {
  render() {
    return (
      <div className="HighestBid">
        <div className="highest-bid-title">current bid</div>
        <div className="highest-bid-amount">
          {this.props.bid ? String(Number(Number(this.props.bid).toPrecision(4))) + ' ETH' : 'Loading...'}
        </div>
        <div className="highest-bid-time">
          {timeago().format(this.props.time * 1000)}
        </div>
      </div>
    );
  }
}

export default HighestBid;
