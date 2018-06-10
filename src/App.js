import React, { Component } from 'react';
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
const uniqueBy = require('lodash.uniqby');
const contractUrl = process.env.REACT_APP_ETHERSCAN_ADDRESS_URI + process.env.REACT_APP_CONTRACT_ADDRESS

function getContract(web3) {
  return new web3.eth.Contract(
    compiledContract.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS,
  );
}

function getProvider (network) {
  try {
    return new Web3.providers.WebsocketProvider(network)
  } catch(err) {
    console.log(err)
    getProvider(network)
  }
}

class App extends Component {
  componentWillMount() {
    const network = 'wss://' + process.env.REACT_APP_ETH_NETWORK + '.infura.io/ws'
    let provider = getProvider(network)
    this.web3 = new Web3()
    this.web3.setProvider(provider)

    provider.on('connect', () => {
      console.log('WSS Reconnected');
      this.web3.setProvider(provider);
      setContract(this.web3)
    });
    provider.on('error', e => {
      console.log('WS error');
      console.log('Attempting to reconnect...');
      provider = getProvider(network)
    });
    provider.on('end', e => {
      console.log('WS closed');
      console.log('Attempting to reconnect...');
      provider = getProvider(network)
    });

    const setContract = (web3) => {
      try {
        this.contract = getContract(web3)
        loadPastEvents()
        subscribeToNewEvents()
      } 
      catch(err) {
        console.log(err)
        setContract(web3)
      }
    }

    // load past events
    const loadPastEvents = () => {
      const pastEventFilterConfig = { fromBlock: 0, toBlock: 'latest' };
      this.contract
        .getPastEvents('BidLog', pastEventFilterConfig)
        .then(events => {
          this.setState({
            bidEvents: events.map(event => this.extractBidEvent(event)),
          });
        }).catch(err => {
          console.log('Loading past events failed. Retrying...')
          setTimeout(loadPastEvents, 1000)
        });
      this.contract
        .getPastEvents('WinningBidLog', pastEventFilterConfig)
        .then(events => {
          this.setState({
            winEvents: events.map(event => this.extractWinEvent(event)),
          });
        }).catch(err => {
          console.log('Loading past events failed. Retrying...')
          setTimeout(loadPastEvents, 1000)
        });
    }

    // subscribe to new events
    const subscribeToNewEvents = () => {
      const newEventsFilterConfig = { fromBlock: 0 };
      try {
        this.contract.events.BidLog(newEventsFilterConfig).on('data', event => {
          this.setState({
            bidEvents: this.state.bidEvents.concat([this.extractBidEvent(event)]),
          });
        }).on('error', e => {
            console.log('Subscribing to new events failed. Retrying...')
            setTimeout(subscribeToNewEvents, 1000)
        });
        this.contract.events.WinningBidLog(newEventsFilterConfig).on('data', event => {
          this.setState({
            winEvents: this.state.winEvents.concat([this.extractWinEvent(event)]),
          });
        }).on('error', e => {
          console.log('Subscribing to new events failed. Retrying...')
          setTimeout(subscribeToNewEvents, 1000)
        });
      } catch (e) {
        subscribeToNewEvents()
      } 
    }
  }

  extractBidEvent(event) {
    return {
      amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      timestamp: event.returnValues.timestamp,
      url: event.returnValues.url,
    };
  }

  extractWinEvent(event) {
    return {
      amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      bidTimestamp: event.returnValues.bidTimestamp,
      winTimestamp: event.returnValues.winTimestamp,
      url: event.returnValues.url,
    };
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
    const bidEvents = this.state ? this.state.bidEvents || [] : [];
    const winEvents = this.state ? this.state.winEvents || [] : [];
    const highestBid = this.state ? this.getHighestBid(bidEvents) : 0;

    return (
      <div className="App">
        <div className="wrapper">
          <aside className="side">
            <h1>bid.{process.env.REACT_APP_DOMAIN_NAME}</h1>
            <h2>
              domain auction on the<br />ethereum blockchain
            </h2>
            <div className="faq">
              <div className="question">how does it work?</div>
              <div className="answer">
                This is a rolling auction — every 24 hours, the highest bidder
                controls where the{' '}
                <a
                  className="highlight"
                  href={`https://${process.env.REACT_APP_DOMAIN_NAME}`}
                  target="_blank"
                >
                  {process.env.REACT_APP_DOMAIN_NAME}
                </a>{' '}
                domain points to. Bids can be placed anytime. See the smart contract <a className="highlight" href={contractUrl} target="_blank">here</a>.
              </div>
            </div>
            <div className="faq">
              <div className="question">rules</div>
              <div className="answer">
                <ol>
                  <li>New bids must be at least 1.1x the current bid.</li>
                  <li>
                    If you are outbid at any point (even after winning), you are
                    automatically given a full refund.
                  </li>
                  <li>A new winner is selected every 24 hours.</li>
                </ol>
              </div>
            </div>
            <hr />
            <div className="question">place bid</div>
            <Web3Provider
              web3UnavailableScreen={Web3NotFound}
              accountUnavailableScreen={AccountNotFound}
            >
              <MetamaskStatus status="connected" />
              <PlaceBidComponent minimumBid={highestBid.amount * 1.1} />
            </Web3Provider>
          </aside>
          <article className="content">
            <HighestBid bid={highestBid.amount} time={highestBid.timestamp} />
            <BidHistory history={bidEvents} />
            <WinningBids winners={winEvents} />
          </article>
        </div>
      </div>
    );
  }
}

export default App;
