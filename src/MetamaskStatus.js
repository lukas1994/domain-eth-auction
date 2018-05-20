import React, { Component } from 'react';
import './MetamaskStatus.css';

class MetamaskStatus extends Component {
  render() {
    const className = 'metamask-status metamask-' + this.props.status
    let statusText = 'Loading...'
    switch (this.props.status) {
        case 'not-found':
            statusText = 'MetaMask not found'
            break;
        case 'locked':
            statusText = 'MetaMask is locked'
            break;
        case 'connected': 
            statusText = 'MetaMask connected'
            break;
    }
    return (
        <div className={className}>
            {statusText}
        </div>
    );
  }
}

export default MetamaskStatus;
