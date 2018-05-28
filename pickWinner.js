const DomainAuction = artifacts.require("./DomainAuction.sol");

module.exports = function(callback) {
  const instance = DomainAuction.at(process.env.REACT_APP_CONTRACT_ADDRESS);
  instance.pickWinner().then(transaction => {
    console.log('tx: ', transaction.tx);
    callback({a: "b"});
  });
}
