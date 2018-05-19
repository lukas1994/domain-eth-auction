import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3';
import BidHistory from './BidHistory.js';
import HighestBid from './HighestBid.js';
import WinningBids from './WinningBids.js';
import './App.css';

const CONTRACT_ETH_ADDRESS = '0xd96d1947b7758271c4b0621d90808825121bf329';
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
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
				"indexed": false,
				"name": "bid",
				"type": "tuple"
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
				"components": [
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
				"indexed": false,
				"name": "bid",
				"type": "tuple"
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
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ETH_ADDRESS)
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
    console.log(contract);
    contract.methods.placeBid(values.url).send({
      from: this.state.account,
      to: CONTRACT_ETH_ADDRESS,
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
  render() {
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
              /*web3UnavailableScreen={}
              accountUnavailableScreen={}*/
            >
              <PlaceBidComponent />
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
