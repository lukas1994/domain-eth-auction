require('dotenv').config();
const request = require('request');
const DomainAuction = artifacts.require("./DomainAuction.sol");

function updateDNS(url, callback) {
  const gandiRequestOptions = {
      method: 'PUT',
      uri: `https://dns.api.gandi.net/api/v5/domains/${process.env.REACT_APP_DOMAIN_NAME}/records/www/CNAME`,
      headers: {
          'X-Api-Key': process.env.GANDI_API_KEY,
      },
      body: {
          "rrset_values":[url + '.']
      },
      json: true,
  };
  request(gandiRequestOptions, (err, resp, body) => {
    console.log(JSON.stringify(resp), JSON.stringify(err));
    callback("success " + new Date());
  });
}

module.exports = function(callback) {
  const instance = DomainAuction.at(process.env.REACT_APP_CONTRACT_ADDRESS);
  instance.pickWinner().then(resp => {
    console.log(JSON.stringify(resp));
    console.log('tx: ', resp.tx);
    const url = resp.logs[0].args.url;
    console.log('url: ', url)
    updateDNS(url, callback);
  });
}
