require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const DomainAuction = artifacts.require("./DomainAuction.sol");

module.exports = function(callback) {
  const instance = DomainAuction.at(process.env.REACT_APP_CONTRACT_ADDRESS);
  instance.pickWinner().then(resp => {
    console.log(JSON.stringify(resp));
    console.log('tx: ', resp.tx);
    const rawUrl = resp.logs[0].args.url;
    if (!url.startswith('http://') && !url.startswith('https://')) {
      const url = 'http://' + rawUrl
    } else {
      const url = rawUrl
    }
    console.log('url: ', url)
    const template = `[build]
  base = "."
  publish = "."
  command = "true"

[[redirects]]
  from = "https://algo.app/*"
  to = "https://${url}/:splat"
  status = 200
  force = true
`
    exec('git checkout master', (err) => {
      if (err) { return console.log(err); }
      console.log('switched branch');
      fs.writeFileSync('netlify.toml', template);
      console.log('wrote file')
      exec('git add . && git commit -am "update redirect" && git push origin master && git checkout bid', {maxBuffer: 1024 * 1000}, (err) => {
        if (err) { return console.log(err); }
        console.log('pushed');
        callback("success");
      });
    });    
  });
}
