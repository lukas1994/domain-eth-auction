import React, { Component } from 'react';
import timeago from 'timeago.js';
import './BidHistory.css';

const clockIcon = require('./img/clock.svg');

var locale = function(number, index, total_sec) {
  // number: the timeago / timein number;
  // index: the index of array below;
  // total_sec: total seconds between date to be formatted and today's date;
  return [
    ['now', 'now'],
    ['%s', '+%s'],
    ['1m', '+1m'],
    ['%sm', '+%sm'],
    ['1h', '+1h'],
    ['%sh', '+%sh'],
    ['1d', '+1d'],
    ['%sd', '+%sd'],
    ['1w', '+1w'],
    ['%sw', '+%sw'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years']
  ][index];
};
timeago.register('short', locale);
var timeagoInstance = timeago();

class Bid extends Component {
  render() {
    const urlDisplay = this.props.url.split('://').pop()
    const urlLink = (this.props.url.startsWith('http://') || this.props.url.startsWith('https://')) 
                    ? this.props.url 
                    : 'http://' + this.props.url
    const addressLink = process.env.ETHERSCAN_ADDRESS_URI + this.props.address
    return (
      <div className="Bid">
        <div className="bid-inner">
          <span className="bid-counter">#{this.props.counter}</span>
          <a className="bid-address" href={addressLink} target="_blank">
            {this.props.address}
          </a>
          <span className="bid-url"><a href={urlLink} target="_blank">{urlDisplay}</a></span>
          <span className="bid-amount">{Number(this.props.amount).toPrecision(3)} ETH</span>
          <span className="bid-timestamp">
            <img src={clockIcon} className="timestamp-icon"/>
            {timeagoInstance.format(this.props.timestamp * 1000, 'short')}
          </span>
        </div>
      </div>
    )
  }
}

class BidHistory extends Component {
  render() {
    const historyItems = this.props.history.map((obj, index) => {
      return <Bid 
              key={index} 
              counter={index + 1} 
              timestamp={obj.timestamp} 
              address={obj.address} 
              url={obj.url} 
              amount={obj.amount} 
              />
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
