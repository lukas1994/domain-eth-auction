const DomainAuction = artifacts.require("./DomainAuction.sol");
const FailingContract = artifacts.require("./FailingContract.sol");

async function expectThrow(
  promise,
  expectedExcpetion = "VM Exception while processing transaction: revert",
) {
  try {
    await promise;
  } catch (error) {
    assert.equal(
      error.message,
      expectedExcpetion,
      "Expected '" + expectedExcpetion + "'throw, got '" + error.message + "' instead",
    );
    return;
  }
  assert.fail('Expected throw not received');
}

async function getBalance(address) {
  const balance = await web3.eth.getBalance(address);
  return balance.toString(10);
}

function getUrl() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text + ".com";
}

contract('DomainAuction test', async (accounts) => {
  let instance;

  beforeEach(async function(){
    instance = await DomainAuction.new();
  });

  it("should reject 0 as a first bid", async () => {
    expectThrow(
      instance.placeBid("test.ss", {from: accounts[0], value: 0, gas: 3e6}),
    );
  });

  it("should store the highest bid URL correctly and allow updates", async () => {
    const firstBidUrl = getUrl();
    await instance.placeBid(firstBidUrl, {from: accounts[0], value: 1e8, gas: 3e6});
    const highestBid = await instance.highestBid();
    const highestBidBidder = highestBid[1];
    const highestBidUrl = highestBid[3];

    assert.equal(highestBidUrl, firstBidUrl, "Highest bid url not stored correctly.");
    assert.equal(highestBidBidder, accounts[0], "Highest bidder not stored correctly.");

    const secondBidUrl = getUrl();
    await instance.placeBid(secondBidUrl, {from: accounts[1], value: 1e9, gas: 3e6});
    const highestBid2 = await instance.highestBid();
    const highestBidBidder2 = highestBid2[1];
    const highestBidUrl2 = highestBid2[3];

    assert.equal(highestBidUrl2, secondBidUrl, "Highest bid url not stored correctly.");
    assert.equal(highestBidBidder2, accounts[1], "Highest bidder not stored correctly.");
  });

  it("should reject bids that are lower than 1.1x of the current maximum bid", async () => {
    const firstBidUrl = getUrl();
    await instance.placeBid(firstBidUrl, {from: accounts[0], value: 1e8, gas: 3e6});

    const secondBidUrl = getUrl();
    expectThrow(
      instance.placeBid(secondBidUrl, {from: accounts[1], value: 1e8+1, gas: 3e6}),
    );

    const highestBid = await instance.highestBid();
    const highestBidUrl = highestBid[3];
    assert.equal(highestBidUrl, firstBidUrl, "Highest bid url not stored correctly.");
  });

  it("should pick a winner correctly", async () => {
    const firstBidUrl = getUrl();
    await instance.placeBid(firstBidUrl, {from: accounts[0], value: 1e8, gas: 3e6});
    await instance.pickWinner();
    const winningBid = await instance.winningBid();
    const winningBidder = winningBid[2];
    assert.equal(winningBidder, accounts[0], "Winner doesn't match highest bidder.");
  });

  it("should not fail when refunding a failing contract", async () => {
    const firstBidUrl = getUrl();
    const failingContract = await FailingContract.new();
    await failingContract.proxyBid(instance.address, firstBidUrl, {from: accounts[0], value: 10, gas: 3e6});
    const failingContractBalance = await getBalance(failingContract.address);
    assert.equal(failingContractBalance, 0, "Failing contract didn't forward funds correctly");
    const highestBid = await instance.highestBid();
    const highestBidBidder = highestBid[1];
    const highestBidUrl = highestBid[3];
    assert.equal(highestBidBidder, failingContract.address, "Did not set proxy contract as highest bidder.");
    assert.equal(highestBidUrl, firstBidUrl, "Did not set proxy contract as highest bidder.");

    await instance.placeBid(firstBidUrl, {from: accounts[0], value: 1e8, gas: 3e6});
    const failingContractBalance2 = await getBalance(failingContract.address);
    assert.equal(failingContractBalance2, 0, "Failing contract received funds incorrectly");
  })
})
