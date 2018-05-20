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
import constants from './constants'

function getContract(web3) {
  return new web3.eth.Contract(compiledContract.abi, constants.CONTRACT_ADDRESS);
}

class App extends Component {
  componentWillMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider(constants.NETWORK_URL));
    const contract = getContract(web3);
    this.setState({ web3, contract });

    contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}).then(events => {
      const bidEvents = events.filter(event => event.event === 'BidLog').map(event => this.extractBidEvent(event))
      const winEvents = events.filter(event => event.event === 'WinningBidLog').map(event => this.extractWinEvent(event))
      this.setState({ bidEvents, winEvents })
    })

    contract.methods.highestBid().call((err, obj) => {
      const highestBid = {
        'amount': this.state.web3.utils.fromWei(obj.amount, 'ether'),
        'address': obj.bidder,
        'timestamp': obj.timestamp,
        'url': obj.url
      }
      this.setState({ highestBid })
    })
  }

  extractBidEvent(event) {
    return {
      amount: this.state.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      timestamp: event.returnValues.timestamp,
      url: event.returnValues.url
    }
  }

  extractWinEvent(event) {
    return {
      amount: this.state.web3.utils.fromWei(event.returnValues.amount, 'ether'),
      address: event.returnValues.bidder,
      bidTimestamp: event.returnValues.bidTimestamp,
      winTimestamp: event.returnValues.winTimestamp,
      url: event.returnValues.url
    }
  }

  render() {
    const bidEvents = this.state.bidEvents || []
    const highestBid = this.state.highestBid || {}
    const winEvents = this.state.winEvents || []
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
