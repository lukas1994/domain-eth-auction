# ETH domain auction

### setup
* get a mnemonic (use Metamask or [this](https://iancoleman.io/bip39/#english))
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
REACT_APP_ETH_NETWORK=[ropsten|mainnet]
REACT_APP_DOMAIN_NAME=the domain name for the auction
```

### deploy the contract

```bash
truffle migrate --network ropsten
```

* if you get an `exceeds block gas limit` error try to adjust the `gas` value or `gasPrice` in the `truffle.js` file (a [ETH converter](https://etherconverter.online/) and [ETH gas prices](https://www.ethgasstation.info/index.php) might be useful)

* use [Etherscan](https://ropsten.etherscan.io/) to verify the deployment

* set the contract address as `CONTRACT_ADDRESS` in `src/comstants.js`

### pick winner

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


