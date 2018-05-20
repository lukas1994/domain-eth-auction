import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3';
import Web3NotFound from './Web3NotFound.js';
import AccountNotFound from './AccountNotFound.js';
import MetamaskStatus from './MetamaskStatus.js';
import compiledContract from './DomainAuction.json';
import constants from './constants'
import './PlaceBidComponent.css';

const ethereumLogo = require('./ethereum-logo.svg');

function getContract(web3) {
    return new web3.eth.Contract(compiledContract.abi, constants.CONTRACT_ADDRESS);
}

class AccountDetailsComponent extends Component {
  render() {
    return (
      <div className="account">
        <div className="account-address">
          <div className="account-heading">account address</div>
          <span className="address">{this.props.address}</span>
        </div>
        <div className="account-balance">
          <div className="account-heading">balance</div>
          <span className="balance">{Number(this.props.balance).toPrecision(2)} ETH</span>
        </div>
        <img src={ethereumLogo} className="ethereum-logo"/>
      </div>
    )
  }
}

class PlaceBidComponent extends Component {
    componentWillMount() {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = getContract(web3);
      this.setState({ web3, contract });
  
      web3.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          const account = accounts[0];
          this.setState({ account });
          return web3.eth.getBalance(account);
        }
      }).then(balance => {
        this.setState({ balance });
      });
    }
  
    handleSubmit(values) {
      this.state.contract.methods.placeBid(values.url).send({
        from: this.state.account,
        to: constants.CONTRACT_ADDRESS,
        value: this.state.web3.utils.toWei(values.bid, 'ether'),
      }, (err, transactionHash) => {
        console.log(err);
        console.log(transactionHash);
      })
    }
  
    render () {
      const account = this.state.account
      const balance = this.state.balance ? this.state.web3.utils.fromWei((this.state.balance), 'ether') : 0
      const minimumBid = Number(this.props.minimumBid).toPrecision(4) || 0;
      const bidForm = 
        <Form
          onSubmit={this.handleSubmit.bind(this)}
          render={({ submitForm }) => (
            <form onSubmit={submitForm}>
              <div className="bid-form-fields">
                <div className="field-name">Bid:</div>
                <Text field="bid" className="field bid-field" placeholder='Bid (ETH)' defaultValue={minimumBid}/>
                <div className="field-help">Your bid amount in ETH</div>
                <div className="field-name">URL:</div>
                <Text field="url" className="field url-field" placeholder='URL' />
                <div className="field-help">The URL to point algo.app to</div>
              </div>
              <button type="submit" className="bid-form-submit">Place Bid</button>
            </form>
          )}
        />
      const topupNotice = 
        <div className="topup-notice">
          The best way to get more ether is on Coinbase. Make an account and buy some in exchange for fiat, and 
          then transfer it to your MetaMask wallet. It won't take more than a few minutes!
        </div>
      return !account ? (<p>loading account...</p>) : (
        <div>
          <AccountDetailsComponent address={account} balance={balance}/>
          <div className="bid-form">
            <div className="minimum-bid">Minimum Bid:<span className="mono"> {minimumBid} ETH</span></div>
            {balance < minimumBid ? <div className="balance-notice">Your account balance is lower than the minimum bid.</div> : null}
            <hr className="form-divider"/>
            {balance < minimumBid ? topupNotice : bidForm}
          </div>
        </div>
      )
  
    }
  }

  export default PlaceBidComponent;