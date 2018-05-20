# ETH domain auction

### setup
* create a file `src/secrets.js` with the following content

```javascript
module.exports = {
  INFURA_API_KEY: "your infura API key",
  MNEMONIC: "your mnemonic",
};
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
