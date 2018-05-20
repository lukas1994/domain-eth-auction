const DomainAuction = artifacts.require("./DomainAuction.sol");
const constants = require('./src/constants');

module.exports = function(callback) {
  const instance = DomainAuction.at(constants.CONTRACT_ADDRESS);
  instance.pickWinner().then(transaction => {
    console.log('tx: ', transaction.tx);
    callback({a: "b"});
  });
}
