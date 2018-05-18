import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3';
import BidHistory from './BidHistory.js';
import HighestBid from './HighestBid.js';
import WinningBids from './WinningBids.js';
import './App.css';

const CONTRACT_ETH_ADDRESS = 'xxx';
const history = [
  {
    "address": "abcdef",
    "amount": 12.45
  },
  {
    "address": "abcdef",
    "amount": 12.45
  },
  {
    "address": "abcdef",
    "amount": 12.45
  }
]
const winners = [
  {
    "address": "abcdef",
    "amount": 12.45,
    "url": "google.com"
  },
  {
    "address": "abcdef",
    "amount": 12.45,
    "url": "google.com"
  },
  {
    "address": "abcdef",
    "amount": 12.45,
    "url": "google.com"
  }
]

class InnerComponent extends Component {
  componentWillMount() {
    const web3 = new Web3(window.web3.currentProvider);
    this.setState({ web3 });
    web3.eth.getAccounts().then(accts => this.setState({ account: accts[0] }));
  }

  handleSubmit(values) {
    const web3 = this.state.web3;
    console.log(web3);
    web3.eth.sendTransaction({
      from: this.state.account,
      to: CONTRACT_ETH_ADDRESS,
      data: web3.toHex({ url: 'url' })
    }, (err, transactionHash) => {
      console.log(err);
      console.log(transactionHash);
    })
  }

  render () {
    const account = this.state.account

    return !account ? (<p>loading account...</p>) : (
      <div>
        <p>account: {account}</p>
        <Form
          onSubmit={this.handleSubmit}
          render={({ submitForm }) => (
            <form onSubmit={submitForm}>
              <Text field="bid" placeholder='Bid (in Wei)' />
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
  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <aside className="side">
            <h1>algo.app</h1>
            <h2>domain auction on the<br/>ethereum blockchain</h2>
            <div className="spacer-50"/>
            <div className="faq">
              <div className="question">
                how does it work?
              </div>
              <div className="answer">
                This is a rolling auction — every 7 days, the highest bidder is awarded the right to point the algo.app domain to a URL of their choice.
                <br/><br/>
                Bids can be placed anytime, by sending ETH to the auction’s smart contract. See below.
              </div>
            </div>
            <hr/>
            <Web3Provider
              /*web3UnavailableScreen={}
              accountUnavailableScreen={}*/
            >
              <InnerComponent />
            </Web3Provider>
          </aside>
          <article className="content">
            <HighestBid bid={12.45} time='8m ago'/>
            <BidHistory history={history}/>
            <WinningBids winners={winners}/>
          </article> 
        </div>
      </div>
    );
  }
}

export default App;
