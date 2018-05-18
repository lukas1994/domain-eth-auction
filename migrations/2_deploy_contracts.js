var DomainAuction = artifacts.require("./DomainAuction.sol");

module.exports = function(deployer) {
  deployer.deploy(DomainAuction);
};
