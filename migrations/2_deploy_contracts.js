const DomainAuction = artifacts.require("./DomainAuction.sol");
const FailingContract = artifacts.require("./FailingContract.sol");

module.exports = function(deployer) {
  deployer.deploy(DomainAuction);
  deployer.deploy(FailingContract);
};
