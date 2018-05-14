import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import Web3 from 'web3'
import './App.css';

const CONTRACT_ETH_ADDRESS = 'xxx';

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
      value: values.bid,
      data: web3.toHex({ url })
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
        <header className="App-header">
          <h1 className="App-title">ETH URL auction: bidding</h1>
        </header>
        <Web3Provider
          /*web3UnavailableScreen={}
          accountUnavailableScreen={}*/
        >
          <p className="App-intro">
            Bid for algo.app
          </p>
          <InnerComponent />
        </Web3Provider>
      </div>
    );
  }
}

export default App;
