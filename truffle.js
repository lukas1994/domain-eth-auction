const HDWalletProvider = require("truffle-hdwallet-provider");
const secrets = require("./src/secrets.js");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(secrets.MNEMONIC, "https://ropsten.infura.io/" + secrets.INFURA_API_KEY);
      },
      network_id: 3,
      gas: 1828127,
    }
  },
};
