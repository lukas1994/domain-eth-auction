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

const TEST_NETWORK_URL = 'https://ropsten.infura.io/KlHjV3YUnqo1NiSwGRNF';
const MAIN_NETWORK_URL = 'https://mainnet.infura.io/KlHjV3YUnqo1NiSwGRNF';
const CONTRACT_TEST_ADDRESS = '0x5a659e4168fb2deb5793ff3eba3d3323750a3058';
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "url",
				"type": "string"
			}
		],
		"name": "BidLog",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "url",
				"type": "string"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "winTimestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "bidTimestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "url",
				"type": "string"
			}
		],
		"name": "WinningBidLog",
		"type": "event"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "highestBid",
		"outputs": [
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "bidder",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "url",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winningBid",
		"outputs": [
			{
				"name": "winTimestamp",
				"type": "uint256"
			},
			{
				"components": [
					{
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"name": "bidder",
						"type": "address"
					},
					{
						"name": "amount",
						"type": "uint256"
					},
					{
						"name": "url",
						"type": "string"
					}
				],
				"name": "bid",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
const history = [
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45
  },
  {
    "address": "0x65F2eac17eBd78529680223a2B992964aa6A98d3",
    "amount": 12.45
  },
]
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
      value: values.bid
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
  componentWillMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider(TEST_NETWORK_URL));
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_TEST_ADDRESS)
    this.setState({ web3, contract });

    contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}).then(events => {
      const bidEvents = events.filter(event => event.event == 'BidLog').map(event => this.extractBidEvent(event))
      const winEvents = events.filter(event => event.event == 'WinningBidLog').map(event => this.extractWinEvent(event))
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
            <WinningBids winners={winners}/>
          </article> 
        </div>
      </div>
    );
  }
}

export default App;
