import React, { Component } from 'react';
import timeago from 'timeago.js';
import './WinningBids.css';

class WinningBid extends Component {
    render() {
        const className = this.props.isCurrentWinner ? "WinningBid current-winner" : "WinningBid"
        const urlDisplay = this.props.url.split('://').pop()
        const urlLink = (this.props.url.startsWith('http://') || this.props.url.startsWith('https://')) 
                        ? this.props.url 
                        : 'http://' + this.props.url
        return (
          <div className={className}>
            <div className="winning-bid-inner">
              <div className="winning-bid-top-row">
                {
                  this.props.isCurrentWinner 
                  ? <div className="current-tag">current</div> 
                  : <div class="winning-bid-counter">#{this.props.counter + 1}</div>
                }
                <div className="winning-bid-timestamp">{timeago().format(this.props.winTimestamp * 1000)}</div>
              </div>
              <div className="winning-bid-amount">{this.props.amount} ETH</div>
              <div className="winning-bid-url">
                <a href={urlLink} target="_blank">{urlDisplay}</a>
              </div>
              <div className="winning-bid-address">{this.props.address}</div>
            </div>
          </div>
        )
    }
}

class WinningBids extends Component {
  render() {
    let winAmount = 0;
    this.props.winners.forEach(winner => {
      if (winner.amount > winAmount) {
        winAmount = winner.amount;
      }
    });
    const winningBids = this.props.winners.map((obj, index) => {
      return (
        <WinningBid
          key={index}
          counter={index}
          isCurrentWinner={obj.amount === winAmount}
          address={obj.address}
          amount={obj.amount}
          url={obj.url}
          winTimestamp={obj.winTimestamp}
        />
      );
    }).reverse()

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
