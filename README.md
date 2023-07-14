# @starboard/hardhat-verify

[Hardhat](https://hardhat.org) plugin for solidity contract verification on Starboard block explorer

Mainnet: [https://fvm.starboard.ventures/explorer](https://fvm.starboard.ventures/explorer)

Calibration: [https://fvm.starboard.ventures/calibration/explorer](https://fvm.starboard.ventures/calibration/explorer)


## Installation

Now the [fevm-hardhat-kit](https://github.com/filecoin-project/fevm-hardhat-kit) has better support for fevm chain

```js
git clone https://github.com/filecoin-project/fevm-hardhat-kit
```


```bash
npm install @starboard/hardhat-verify
```

Import the plugin in your `hardhat.config.js`:

```js
require("@starboard/hardhat-verify");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@starboard/hardhat-verify";
```

## Tasks

This plugin adds the `starboard-verify` task to Hardhat:
```bash
npx hardhat starboard-verify <CONTRACT_NAME> <CONTRACT_ADDRESS>
```

## Configuration

This plugin extends the `HardhatUserConfig` object with an optional `starboardConfig` field.

This is an example of how to set it:

```js
module.exports = {
 solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
                details: { yul: false },
            },
        },
    },
    defaultNetwork: "calibrationnet",
    starboardConfig: {
        baseURL: 'https://fvm-calibration-api.starboard.ventures',
        network: 'Mainnet' // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
    },
};
```
