import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import Modal from 'react-modal';
import Web3 from 'web3';
import compiledContract from './DomainAuction.json';
import './PlaceBidComponent.css';

const ethereumLogo = require('./img/ethereum-logo.svg');
const coinbaseLink = 'https://www.coinbase.com/join/536747e12c1c882c4000359a';

Modal.setAppElement('#root');

function getContract(web3) {
  return new web3.eth.Contract(
    compiledContract.abi,
    process.env.REACT_APP_CONTRACT_ADDRESS,
  );
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
          <span className="balance">
            {Number(this.props.balance).toPrecision(2)} ETH
          </span>
        </div>
        <img src={ethereumLogo} className="ethereum-logo" alt="" />
      </div>
    );
  }
}

class PlaceBidComponent extends Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }
  componentWillMount() {
    this.web3 = new Web3(window.web3.currentProvider);
    this.contract = getContract(this.web3);
    this.setState({ bidFlow: {} });
    this.web3.eth
      .getAccounts()
      .then(accounts => {
        if (accounts.length > 0) {
          const account = accounts[0];
          this.setState({ account });
          return this.web3.eth.getBalance(account);
        }
      })
      .then(balance => {
        this.setState({ balance });
      });
  }

  handleSubmit(values) {
    this.setState({ bidFlow: { submitted: true } });
    this.contract.methods.placeBid(values.url).send(
      {
        from: this.state.account,
        to: process.env.REACT_APP_CONTRACT_ADDRESS,
        value: this.web3.utils.toWei(String(values.bid), 'ether'),
      },
      (error, transactionHash) => {
        const successObj = {
          url: values.url,
          amount: values.bid,
          transactionHash,
        };
        if (error) {
          let errorMessage = 'Something went wrong :(';
          if (
            error.message.includes('User denied transaction') ||
            error.message.includes('Request has been rejected.') ||
            error.message.includes('transaction has been discarded') ||
            error.message.includes('Transaction not confirmed')
          ) {
            errorMessage = 'User aborted transaction.';
          } else if (error.message.includes('insufficient funds for gas')) {
            errorMessage = 'Insufficient funds for gas';
          } else if (error.message.includes('intrinsic gas too low')) {
            errorMessage = 'Gas too low';
          }
          this.setState({ bidFlow: { error: errorMessage } });
        } else {
          this.setState({ bidFlow: { success: successObj } });
        }
      },
    );
  }

  validateUrl(url) {
    const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!urlPattern.test(url)) {
      const message = 'Make sure your URL is valid!';
      this.setState({ validationError: message });
      return message;
    } else {
      this.setState({ validationError: null });
    }
  }

  closeModal() {
    this.setState({ bidFlow: {} });
  }

  render() {
    if (!this.state) return <div />;
    const account = this.state.account;
    const balance = this.state.balance
      ? this.web3.utils.fromWei(this.state.balance, 'ether')
      : 0;
    const minimumBid = Number(this.props.minimumBid).toPrecision(4) || 0;
    const bidForm = (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        render={formApi => (
          <form onSubmit={formApi.submitForm}>
            <div className="bid-form-fields">
              <div className="field-name">Bid</div>
              <Text
                field="bid"
                required
                className="field bid-field"
                type="number"
                step="0.00000001"
                placeholder="Bid (ETH)"
                min={this.props.minimumBid}
                defaultValue={this.props.minimumBid}
              />
              <div className="field-help">Your bid amount in ETH</div>
              <div className="field-name">URL</div>
              <Text
                field="url"
                required
                className={
                  this.state.validationError
                    ? 'field url-field invalid-field'
                    : 'field url-field'
                }
                placeholder="example.com"
                validate={this.validateUrl.bind(this)}
              />
              <div className="field-help">
                The URL to point {process.env.REACT_APP_DOMAIN_NAME} to
              </div>
            </div>
            <button type="submit" className="bid-form-submit">
              {this.state.bidFlow['submitted'] ? 'Go to metamask' : 'Place bid'}
            </button>
          </form>
        )}
      />
    );
    const topupNotice = (
      <div className="topup-notice">
        If you're in the US, you can purchase ETH from MetaMask itself (via
        Coinbase). For everyone else, you'll need to buy ETH from an exchange
        (like{' '}
        <a href={coinbaseLink} target="_blank">
          Coinbase
        </a>) and transfer it to your MetaMask wallet. This only takes a few
        minutes.
      </div>
    );
    const formError = (
      <div className="form-error">
        <hr className="form-divider" />
        {this.state.bidFlow.error || null}
      </div>
    );
    return !account ? (
      <p>loading account...</p>
    ) : (
      <div>
        <AccountDetailsComponent address={account} balance={balance} />
        <div className="bid-form">
          <div className="minimum-bid">
            Minimum Bid:<span className="mono"> ~{minimumBid} ETH</span>
          </div>
          {balance < this.props.minimumBid ? (
            <div className="balance-notice">
              Your account balance is lower than the minimum bid.
            </div>
          ) : null}
          <hr className="form-divider" />
          {balance < this.props.minimumBid ? topupNotice : bidForm}
          {this.state.bidFlow.error ? formError : null}
          <Modal
            isOpen={this.state.bidFlow.success}
            contentLabel="Bid successfully placed"
            className="success-modal"
            overlayClassName="success-modal-overlay"
          >
            <div className="success-modal-title">bid successful!</div>
            <div className="success-modal-bid-details">
              <div className="detail">
                <strong>Amount:</strong>
                <span class="mono">
                  {' '}
                  {this.state.bidFlow.success
                    ? Number(this.state.bidFlow.success.amount).toPrecision(4)
                    : null}{' '}
                  ETH
                </span>
              </div>
              <div className="detail">
                <strong>URL: </strong>
                {this.state.bidFlow.success
                  ? this.state.bidFlow.success.url
                  : null}
              </div>
              <div className="detail">
                <div class="transaction-link">
                  <a
                    href={
                      process.env.REACT_APP_ETHERSCAN_TRANSACTION_URI +
                      (this.state.bidFlow.success
                        ? this.state.bidFlow.success.transactionHash
                        : '')
                    }
                    target="_blank"
                  >
                    Track
                  </a>
                </div>
              </div>
            </div>
            <div className="success-modal-description">
              Your transaction can take up to a minute to propagate.<br />
              <br />
              If you have the highest bid when the next winner is selected, the{' '}
              {process.env.REACT_APP_DOMAIN_NAME} domain will point to your URL
              for 24 hours. If you are outbid at any point, you will be refunded
              your full bid amount.
            </div>
            <button className="close-modal" onClick={this.closeModal}>
              Got it
            </button>
          </Modal>
        </div>
      </div>
    );
  }
}

export default PlaceBidComponent;
