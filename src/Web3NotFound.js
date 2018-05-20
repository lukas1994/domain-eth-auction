import React, { Component } from 'react';
import MetamaskStatus from './MetamaskStatus.js';
import './Web3Notice.css';
const metamaskLogo = require('./metamask-logo.svg');

class Web3NotFound extends Component {
  render() {
    return (
      <div className="Web3Notice">
        <MetamaskStatus status='not-found'/>
        <div className="answer">
          To get started, you need to connect your browser to the blockchain. 
          An extension called MetaMask lets you do this: <br/>
          <div className="metamask-button-wrapper">
            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">
              <button className="metamask-button">
                <img src={metamaskLogo} className="metamask-logo"/>
                <span className="metamask-button-text">Install Metamask</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Web3NotFound;
