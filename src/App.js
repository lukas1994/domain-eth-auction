import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3';
import BidHistory from './BidHistory.js';
import HighestBid from './HighestBid.js';
import WinningBids from './WinningBids.js';
import Web3NotFound from './Web3NotFound.js';
import AccountNotFound from './AccountNotFound.js';
import './App.css';
import compiledContract from './DomainAuction.json';


const NETWORK_URL = 'https://ropsten.infura.io/KlHjV3YUnqo1NiSwGRNF';
// const NETWORK_URL = 'https://mainnet.infura.io/KlHjV3YUnqo1NiSwGRNF';
const CONTRACT_TEST_ADDRESS = '0x5a659e4168fb2deb5793ff3eba3d3323750a3058';
const CONTRACT_ABI = compiledContract.abi
const winners = [
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45,
    "url": "google.com"
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45,
    "url": "google.com"
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45,
    "url": "google.com"
  }
]

class PlaceBidComponent extends Component {
  componentWillMount() {
    const web3 = new Web3(window.web3.currentProvider);
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_TEST_ADDRESS)
    this.setState({ web3, contract });

    web3.eth.getAccounts().then(accounts => {
      const account = accounts[0]
      this.setState({ account });
      return web3.eth.getBalance(account)
    }).then((balance) => {
      this.setState({ balance });
    });
  }

  handleSubmit(values) {
    const contract = this.state.contract;
    contract.methods.placeBid(values.url).send({
      from: this.state.account,
      to: CONTRACT_TEST_ADDRESS,
      value: this.state.web3.utils.toWei(values.bid, 'ether'),
    }, (err, transactionHash) => {
      console.log(err);
      console.log(transactionHash);
    })
  }

  render () {
    const account = this.state.account
    const balance = this.state.balance ? this.state.web3.utils.fromWei((this.state.balance), 'ether') : 0

    return !account ? (<p>loading account...</p>) : (
      <div>
        <p>account: {account}</p>
        <p>balance: {balance} ETH</p>
        <Form
          onSubmit={this.handleSubmit.bind(this)}
          render={({ submitForm }) => (
            <form onSubmit={submitForm}>
              <Text field="bid" placeholder='Bid (in ETH)' />
              <Text field="url" placeholder='Url' />
              <button type="submit">Submit</button>
            </form>
          )}
        />
      </div>
    )

  }
}

class App extends Component {
  componentWillMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_TEST_ADDRESS)
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
            <div className="spacer-20"/>
            <div className="faq">
              <div className="question">
                how does it work?
              </div>
              <div className="answer">
                This is a rolling auction — every 3 days, the highest bidder gets to choose where the algo.app domain goes to.
                <br/><br/>
                Bids can be placed anytime, by sending the bid amount in ETH to the auction’s smart contract (see below).
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
            <Web3Provider
              web3UnavailableScreen={Web3NotFound}
              accountUnavailableScreen={AccountNotFound}
            >
              <PlaceBidComponent />
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
