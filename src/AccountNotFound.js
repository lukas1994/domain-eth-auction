import React, { Component } from 'react';
import MetamaskStatus from './MetamaskStatus.js';
import './Web3Notice.css';
const metamaskLogo = require('./img/metamask-logo.svg');

class Web3NotFound extends Component {
  render() {
    return (
      <div className="Web3Notice">
        <MetamaskStatus status="locked" />
        <div className="answer">
          Your MetaMask is locked — just open the extension and follow the
          instructions. You're almost there!
          <div className="metamask-button-wrapper">
            <button className="metamask-button-locked">
              <img src={metamaskLogo} className="metamask-logo" alt="" />
              <span className="metamask-button-text">MetaMask locked</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Web3NotFound;
