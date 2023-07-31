# @starboardventures/hardhat-verify


The @starboardventures/hardhat-verify is a [Hardhat](https://hardhat.org) plugin designed and developed for the source code verification of Solidity contracts on the Filecoin Virtual Machine (FVM) with the Starboard FVM Explorer. This plugin supports both the Mainnet and the Calibration Testnet.

Starboard FVM Explorer:

Mainnet: [https://fvm.starboard.ventures/explorer](https://fvm.starboard.ventures/explorer)

Calibration Testnet: [https://fvm.starboard.ventures/calibration/explorer](https://fvm.starboard.ventures/calibration/explorer)


## Installation
### In an existing project:
You can add the plugin to your existing project by running:
```bash
yarn add @starboardventures/hardhat-verify
```
### In a new project:
If you're setting up a new project, the [fevm-hardhat-kit](https://github.com/filecoin-project/fevm-hardhat-kit) provides better support for the FEVM chain. Here's how to set it up:
```js
git clone https://github.com/filecoin-project/fevm-hardhat-kit

cd fevm-hardhat-kit

yarn install

yarn add @starboardventures/hardhat-verify
```

## Configuration

The plugin can be imported into your hardhat.config.js file:
Import the plugin in your `hardhat.config.js`:

```js
require("@starboardventures/hardhat-verify");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@starboardventures/hardhat-verify";
```

This plugin depends on the `starboardConfig` field in your Hardhat config to distinguish between different network environments. To use the CLI tools, this config needs to be set up first. 


Here's an example for both the Mainnet and Calibration Testnet:

Mainnet:
```js
module.exports = {
  solidity: {},
  starboardConfig: {
    baseURL: 'https://fvm-api.starboard.ventures',
    network: 'Mainnet' // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
  },
};
```
Calibration Testnet:
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
## Usage
### Compile

Before you verify a contract, you need to compile it first:
```bash
npx hardhat compile
```

### Cli

This plugin adds the `starboard-verify` task to Hardhat :
```bash
npx hardhat starboard-verify <CONTRACT_NAME> <CONTRACT_ADDRESS>
```
Additionally, you can generate a metadata.json file for a contract. This will save the metadata in a file named <CONTRACT_NAME>_Metadata.json in your root directory:
```bash
npx hardhat starboard-verify <CONTRACT_NAME> metadata
```

### Script
You can also write a script to use this plugin. Make sure to compile your contracts and have the artifacts available before running the script:

Mainnet:
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

Calibration Testnet:
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

**Note:** 
For contracts that are newly deployed, the Starboard FVM Explorer will require some time to index them. The indexing time is approximately 30 seconds on Calibration, and around 1-2 minutes on Mainnet. Please ensure that they are indexed by the Starboard FVM Explorer before proceeding with verification, otherwise an error stating `resource not found` will be returned.
