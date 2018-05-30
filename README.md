# ETH domain auction

### setup
* create a file `src/secrets.js` with the following content

```javascript
module.exports = {
  INFURA_API_KEY: "your infura API key",
  MNEMONIC: "your mnemonic",
};
```

* create `.env` file with the following content
```
REACT_APP_CONTRACT_ADDRESS=your ETH contract address
REACT_APP_ETHERSCAN_ADDRESS_URI=https://[ropsten].etherscan.io/address/
REACT_APP_ETHERSCAN_TRANSACTION_URI=https://[ropsten].etherscan.io/tx/
REACT_APP_DOMAIN_NAME=the domain name for the auction
```

* add a DNS record to redirect the bare domain to www (e.g. see [Gandi web forwarding](https://wiki.gandi.net/en/domains/management/domain-as-website/forwarding)) - we change the www CNAME record every 24h based on the highest bid

### deploy the contract

```bash
truffle migrate --network ropsten
```

* if you get an `exceeds block gas limit` error try to adjust the `gas` value in the `truffle.js` file

* use [Etherscan](https://ropsten.etherscan.io/) to verify the deployment

* set the contract address as `CONTRACT_ADDRESS` in `src/comstants.js`

### pick winner

* add your [Gandi](https://www.gandi.net/en) API key to the `.env file`
```
GANDI_API_KEY=XXX
```

* setup a cron job that runs at midnight every day by running `crontab -e` and adding the following line
```
0 0 * * * truffle exec ~/domain-eth-auction/pickWinner.js --network ropsten
```

### testing

* install and run [Ganache](http://truffleframework.com/ganache/)

```bash
truffle test
```

### deploy the website
```bash
truffle compile && yarn build
# then host the ./build directory as bid.{domain name}
```

### development mode for the website
```bash
yarn start
```


