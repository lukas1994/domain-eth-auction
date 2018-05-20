const secrets = require('./secrets');

module.exports = {
  CONTRACT_ADDRESS: '0x4978bf37e01827ad85c5e6f53feff6bf249a1545',
  // CONTRACT_ADDRESS: '0x5a659e4168fb2deb5793ff3eba3d3323750a3058',
  NETWORK_URL: 'https://ropsten.infura.io/' + secrets.INFURA_API_KEY,
  // NETWORK_URL: 'https://mainnet.infura.io/' + secrets.INFURA_API_KEY,
};
