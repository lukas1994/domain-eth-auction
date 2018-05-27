# ETH domain auction

### setup
* create a file `src/secrets.js` with the following content

```javascript
module.exports = {
  INFURA_API_KEY: "your infura API key",
  MNEMONIC: "your mnemonic",
};
```

create `.env` file with the following content
```
REACT_APP_CONTRACT_ADDRESS=your ETH contract address
```
### deploy the contract

```bash
truffle migrate --network ropsten
```

* if you get an `exceeds block gas limit` error try to adjust the `gas` value in the `truffle.js` file

* use [Etherscan](https://ropsten.etherscan.io/) to verify the deployment

* set the contract address as `CONTRACT_ADDRESS` in `src/comstants.js`

### pick winner

```bash
truffle exec pickWinner.js --network ropsten
```

### testing

* install and run [Ganache](http://truffleframework.com/ganache/)

```bash
truffle test
```

### deploy the website
```bash
truffle compile && yarn build
# then host the ./build directory
```

### development mode for the website
```bash
yarn start
```

