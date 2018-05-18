const DomainAuction = artifacts.require("./DomainAuction.sol");

contract('DomainAuction test', async (accounts) => {

  it("should store the highest bid URL correctly", async () => {
    let instance = await DomainAuction.deployed();
    const bidUrl = "google.com";

    await instance.placeBid(bidUrl, {from: accounts[0], value: 1e8, gas: 3e6});
    const highestBid = await instance.highestBid();
    const highestBidUrl = highestBid[3]

    assert.equal(highestBidUrl, bidUrl, "hihihi");
  })

  it("should reject bids that are lower than the threshold", async () => {
    let instance = await DomainAuction.deployed();
    const firstBidUrl = "google.com"
    await instance.placeBid(firstBidUrl, {from: accounts[0], value: 1e8, gas: 3e6});
    
  })

  // it("should call a function that depends on a linked library", async () => {
  //   let meta = await MetaCoin.deployed();
  //   let outCoinBalance = await meta.getBalance.call(accounts[0]);
  //   let metaCoinBalance = outCoinBalance.toNumber();
  //   let outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
  //   let metaCoinEthBalance = outCoinBalanceEth.toNumber();
  //   assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);

  // });

  // it("should send coin correctly", async () => {

  //   // Get initial balances of first and second account.
  //   let account_one = accounts[0];
  //   let account_two = accounts[1];

  //   let amount = 10;


  //   let instance = await MetaCoin.deployed();
  //   let meta = instance;

  //   let balance = await meta.getBalance.call(account_one);
  //   let account_one_starting_balance = balance.toNumber();

  //   balance = await meta.getBalance.call(account_two);
  //   let account_two_starting_balance = balance.toNumber();
  //   await meta.sendCoin(account_two, amount, {from: account_one});

  //   balance = await meta.getBalance.call(account_one);
  //   let account_one_ending_balance = balance.toNumber();

  //   balance = await meta.getBalance.call(account_two);
  //   let account_two_ending_balance = balance.toNumber();

  //   assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //   assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  // });

})
