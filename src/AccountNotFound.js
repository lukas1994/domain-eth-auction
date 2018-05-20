import React, { Component } from 'react';
import MetamaskStatus from './MetamaskStatus.js';
import './Web3Notice.css';

class Web3NotFound extends Component {
  render() {
    return (
      <div className="Web3Notice">
        <MetamaskStatus status='locked'/>
        <div className="answer">
          Your MetaMask is locked — just open the extension and follow the instructions. You're almost there!
        </div>
      </div>
    );
  }
}

export default Web3NotFound;
