# @starboardventures/hardhat-verify

[Hardhat](https://hardhat.org) plugin for solidity contract verification on Starboard block explorer

Mainnet: [https://fvm.starboard.ventures/explorer](https://fvm.starboard.ventures/explorer)

Calibration: [https://fvm.starboard.ventures/calibration/explorer](https://fvm.starboard.ventures/calibration/explorer)


## Installation
If you need to create a new project, the [fevm-hardhat-kit](https://github.com/filecoin-project/fevm-hardhat-kit) has better support for FEVM chain, or you can inject it into your own project.

In a new project with [fevm-hardhat-kit](https://github.com/filecoin-project/fevm-hardhat-kit) :
```js
git clone https://github.com/filecoin-project/fevm-hardhat-kit

cd fevm-hardhat-kit

yarn install

yarn add @starboardventures/hardhat-verify
```

Or in your own project :
```bash
yarn add @starboardventures/hardhat-verify
```

## Configuration


Import the plugin in your `hardhat.config.js`:

```js
require("@starboardventures/hardhat-verify");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@starboardventures/hardhat-verify";
```

This plugin depend on the `starboardConfig` field to distinguish environments, so if you need to use the Cli tools you need to set the config first.

This is examples of how to set it:
* Mainnet:
```js
module.exports = {
  solidity: {},
  starboardConfig: {
    baseURL: 'https://fvm-api.starboard.ventures',
    network: 'Mainnet' // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
  },
};
```
* Calibration Testnet:
```js
module.exports = {
  solidity: {
    version: "0.8.17",
  },
  starboardConfig: {
      baseURL: 'https://fvm-calibration-api.starboard.ventures',
      network: 'Calibration' // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
  },
};
```
## Compile

You need to complie you smart contracts first.
```bash
npx hardhat compile
```

## Cli

This plugin adds the `starboard-verify` task to Hardhat :
```bash
npx hardhat starboard-verify <CONTRACT_NAME> <CONTRACT_ADDRESS>
```
Also you can generate the metadata.json of a contract, it will be saved with a name of <CONTRACT_NAME>_Metadata.json in your root dir:
```bash
npx hardhat starboard-verify <CONTRACT_NAME> metadata
```

## Script
You can create your own script with this plugin, before executing, make sure that compile has been executed and that resource of artifacts are available.:
* Mainnet:
```js
const { StarboardVerify, generateMetadata } = require('@starboardventures/hardhat-verify/dist/src/utils')

async function verify() {
  const verify = new StarboardVerify({
    network: 'Mainnet',
    contractName: 'BigDataAuctionImpl',
    contractAddress: '0x5588c33dFF7e3A1831D41B0E3aBdD4D67E897a02',
  })
  await generateMetadata('BigDataAuctionImpl') // optional
  await verify.verify()
}
verify();
```

* Calibration Testnet:
```js
const { StarboardVerify, generateMetadata } = require('@starboardventures/hardhat-verify/dist/src/utils')

async function verify() {
  const verify = new StarboardVerify({
    network: 'Calibration',
    contractName: 'BigDataAuctionImpl',
    contractAddress: '0x5588c33dFF7e3A1831D41B0E3aBdD4D67E897a02',
  })
  await generateMetadata('BigDataAuctionImpl') // optional
  await verify.verify()
}
verify();
```
