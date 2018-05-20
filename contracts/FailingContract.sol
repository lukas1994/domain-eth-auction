pragma solidity ^0.4.18;

import './DomainAuction.sol';

contract FailingContract {
    function proxyBid(address contractAddress, string url) public payable {
      DomainAuction auction = DomainAuction(contractAddress);
      auction.placeBid.value(msg.value)(url);
    }

    function() external payable {
      require(1 > 2);
    }
}
