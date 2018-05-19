pragma solidity ^0.4.18;

contract DomainAuction {
    address public owner;

    struct Bid {
        uint timestamp;
        address bidder;
        uint amount;
        string url;
    }

    struct WinningBid {
        uint winTimestamp;
        Bid bid;
    }

    Bid public highestBid;

    WinningBid public winningBid;

    event BidLog(uint timestamp, address bidder, uint amount, string url);
    event WinningBidLog(uint winTimestamp, uint bidTimestamp, address bidder, uint amount, string url);

    ///////////////////////////////////

    function placeBid(string url) public payable {
        require(msg.value > ((highestBid.amount * 11) / 10));
        Bid memory newBid = Bid(now, msg.sender, msg.value, url);

        // Refund the current highest bid unless it's also the current winning bid
        // Have to check whether there has been a winningBid yet via the timestamp
        if (winningBid.winTimestamp != 0 && winningBid.bid.amount != highestBid.amount) {
            refundBid(highestBid);
        }

        // Update the highest bid and log the event
        highestBid = newBid;
        emit BidLog(newBid.timestamp, newBid.bidder, newBid.amount, newBid.url);
    }

    // This might fail if the bidder is trying some contract bullshit, but they do this
    // at their own risk. It won't fail if the bidder is a non-contract address.
    function refundBid(Bid bid) private {
        bid.bidder.send(bid.amount);
    }
    
    // This will need to be triggered externally every x days
    function pickWinner() public payable {
        require(msg.sender == owner);
        
        // Have to store the new winning bid in memory in order to emit it as part
        // of an event. Can't emit an event straight from a stored variable.
        WinningBid memory newWinningBid = WinningBid(now, highestBid);
        winningBid = newWinningBid;
        emit WinningBidLog(
            newWinningBid.winTimestamp, 
            newWinningBid.bid.timestamp, 
            newWinningBid.bid.bidder, 
            newWinningBid.bid.amount, 
            newWinningBid.bid.url
        );
    }

    ///////////////////////////////////

    constructor() public payable {
        owner = msg.sender;
    }

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }
}
