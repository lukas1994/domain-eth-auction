import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3';
import BidHistory from './BidHistory.js';
import HighestBid from './HighestBid.js';
import WinningBids from './WinningBids.js';
import Web3NotFound from './Web3NotFound.js';
import PlaceBidComponent from './PlaceBidComponent.js';
import AccountNotFound from './AccountNotFound.js';
import './App.css';
import MetamaskStatus from './MetamaskStatus.js';
import compiledContract from './DomainAuction.json';

function getContract(web3) {
  return new web3.eth.Contract(compiledContract.abi, process.env.REACT_APP_CONTRACT_ADDRESS);
}

class App extends Component {
  componentWillMount() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
    this.contract = getContract(this.web3);

    // load past events
    const pastEventFilterConfig = { fromBlock: 0, toBlock: 'latest' };
    this.contract.getPastEvents('BidLog', pastEventFilterConfig).then(events => {
      console.log('now');
      this.setState({ bidEvents: events.map(event => this.extractBidEvent(event))});
    });
    this.contract.getPastEvents('WinningBidLog', pastEventFilterConfig).then(events => {
      this.setState({ winEvents: events.map(event => this.extractWinEvent(event))});
    });

    // subscribe to new events
    const newEventsFilterConfig = { fromBlock: 0 };
    console.log(this.contract.events);
    this.contract.events.BidLog(newEventsFilterConfig, (err, event) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({
          bidEvents: this.state.bidEvents.concat([this.extractBidEvent(event)])
        });
      }
    });
    this.contract.events.WinningBidLog(newEventsFilterConfig, (err, event) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({
          winEvents: this.state.winEvents.concat([this.extractWinEvent(event)])
        });
      }
    });
  }

  extractBidEvent(event) {
    return {
      amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      timestamp: event.returnValues.timestamp,
      url: event.returnValues.url
    }
  }

  extractWinEvent(event) {
    return {
      amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      bidTimestamp: event.returnValues.bidTimestamp,
      winTimestamp: event.returnValues.winTimestamp,
      url: event.returnValues.url
    }
  }

  getHighestBid(bidEvents) {
    let highestBid = null;
    bidEvents.forEach(bid => {
      if (highestBid === null || highestBid.amount < bid.amount) {
        highestBid = bid;
      }
    });
    return highestBid || {};
  }

  render() {
    if (!this.state) return <div/>;
    const bidEvents = this.state.bidEvents || [];
    const winEvents = this.state.winEvents || [];
    const highestBid = this.getHighestBid(bidEvents);

    return (
      <div className="App">
        <div className="wrapper">
          <aside className="side">
            <h1>algo.app</h1>
            <h2>domain auction on the<br/>ethereum blockchain</h2>
            <div className="faq">
              <div className="question">
                how does it work?
              </div>
              <div className="answer">
                This is a rolling auction — every 24 hours, the highest bidder controls where the algo.app domain points to.
                Bids can be placed anytime (see below).
              </div>
            </div>
            <div className="faq">
              <div className="question">
                rules
              </div>
              <div className="answer">
                <ol>
                  <li>New bids must be at least 1.1x the previous bid.</li>
                  <li>Bidders are automatically refunded if they are outbid.</li>
                  <li>Winners are automatically refunded when a new winner is selected.</li>
                </ol>
              </div>
            </div>
            <hr/>
            <div className="question">
              place bid
            </div>
            <Web3Provider
              web3UnavailableScreen={Web3NotFound}
              accountUnavailableScreen={AccountNotFound}
            >
              <MetamaskStatus status='connected'/>
              <PlaceBidComponent minimumBid={highestBid.amount * 1.1}/>
            </Web3Provider>
          </aside>
          <article className="content">
            <HighestBid bid={highestBid.amount} time={highestBid.timestamp}/>
            <BidHistory history={bidEvents}/>
            <WinningBids winners={winEvents}/>
          </article>
        </div>
      </div>
    );
  }
}

export default App;
