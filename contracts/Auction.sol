pragma solidity 0.4.23;

contract DomainAuction {
    address public owner;

    struct Bid {
        uint timestamp;
        address bidder;
        uint256 amount;
        string url;
    }
    
    struct WinningBid {
        uint winTimestamp;
        Bid bid;
    }

    Bid public highestBid;

    Bid[] public allBids;
    
    WinningBid[] public winningBids;

    ///////////////////////////////////

    // TODO: handle case when highestBid has won a previous auction so shouldn't
    // be refunded
    function placeBid(string url) public payable {
        require(msg.value > highestBid.amount);
        newBid = Bid(now, msg.sender, msg.value, url);
        allBids.push(newBid);
        refundBid(highestBid);
        highestBid = newBid;
    }

    function refundBid(Bid bid) private {
        bid.bidder.transfer(bid.amount);
    }
    
    // TODO: do some timing shit to trigger pickWinner() every x days
    function pickWinner() public payable {
        require(msg.sender == owner);
        winners.push(WinningBid(now, highestBid));
    }

    ///////////////////////////////////

    constructor() public payable {
        owner = msg.sender;
    }

    function kill() public {
        if (msg.sender == owner) 
            selfdestruct(owner);
    }
}
