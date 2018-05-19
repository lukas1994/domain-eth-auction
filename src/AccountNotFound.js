import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import { Web3Provider } from 'react-web3';
import timeago from 'timeago.js';
import Web3 from 'web3'

class Web3NotFound extends Component {
  render() {
    return (
      <div className="Web3Notice">
        account not found
      </div>
    );
  }
}

export default Web3NotFound; 
