# @starboard/hardhat-verify

[Hardhat](https://hardhat.org) plugin for solidity contract verification on Starboard block explorer

Mainnet: [https://fvm.starboard.ventures/explorer](https://fvm.starboard.ventures/explorer)
Calibration: [https://fvm.starboard.ventures/calibration/explorer](https://fvm.starboard.ventures/calibration/explorer)
## What


## Installation

now the fevm-hardhat-kit has better support for fevm chain
```js
git clone https://github.com/filecoin-project/fevm-hardhat-kit
```


```bash
npm install @ericxstone/hardhat-blockscout-verify
```

Import the plugin in your `hardhat.config.js`:

```js
require("@ericxstone/hardhat-blockscout-verify");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@ericxstone/hardhat-blockscout-verify";
import {SOLIDITY_VERSION, EVM_VERSION} from "@ericxstone/hardhat-blockscout-verify";
```

## Tasks

This plugin adds the `blockscout-verify` task to Hardhat:
```bash
npx hardhat blockscout-verify <contract file path> <contract address>
```

## Configuration

This plugin extends the `HardhatUserConfig` object with an optional `blockscoutVerify` field.

This is an example of how to set it:

```js
module.exports = {
  blockscoutVerify: {
    blockscoutURL: "<BLOCKSCOUT_EXPLORER_URL>",
    contracts: {
      "<CONTRACT_NAME>": {
        compilerVersion: SOLIDITY_VERSION.<CONTRACT_COMPILER_VERSION>, // checkout enum SOLIDITY_VERSION
        optimization: true,
        evmVersion: EVM_VERSION.<EVM_VERSION>, // checkout enum SOLIDITY_VERSION
        optimizationRuns: 999999,
      },
    },
  },
};
```

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access ethers through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).

You can use the plugin as CLI
```bash
npx hardhat blockscout-verify <contract file path> <contract address>
```

If you use it in a script, the task parameters are `filePath` and `address`.

Example:
```js
await hre.run("blockscout-verify", {
    filePath: "<contract file path>",
    address: "<contract address>"
})
```

## Known Issue

- Upgradeable contracts is current not supported.
