pragma solidity ^0.4.22;

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

    WinningBid[] public winningBids;

    event BidLog(Bid bid);

    ///////////////////////////////////

    function placeBid(string url) public payable {
        require(msg.value > highestBid.amount);
        Bid memory newBid = Bid(now, msg.sender, msg.value, url);

        // Refund the current highest bid unless it's also the current winning bid
        if (winningBids.length > 0) {
            Bid memory currentWinningBid = winningBids[winningBids.length - 1].bid;
            if (currentWinningBid.amount != highestBid.amount) {
                refundBid(highestBid);
            }   
        }

        // Update the highest bid and log the event
        highestBid = newBid;
        emit BidLog(newBid);
    }

    // This might fail if the bidder is trying some contract bullshit, but they do this
    // at their own risk. It won't fail if the bidder is a non-contract address.
    function refundBid(Bid bid) private {
        bid.bidder.send(bid.amount);
    }
    
    // This will need to be triggered externally every x days
    function pickWinner() public payable {
        require(msg.sender == owner);
        winningBids.push(WinningBid(now, highestBid));
    }

    ///////////////////////////////////

    constructor() public payable {
        owner = msg.sender;
    }

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }
}