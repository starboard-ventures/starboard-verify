import { task, types } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import {
  Artifacts,
  HardhatConfig,
  HardhatRuntimeEnvironment,
  TaskArguments,
} from "hardhat/types";
import { fetchVerify, writeMetaFile, createFormData, getBuildInfo } from "../common";

task("starboard-verify", "Verify smart contract on Starboard blockchain explorer.")
  .addPositionalParam("contractName", "Name of the contract to be verified.", "", types.string)
  .addPositionalParam("contractAddress", "Deployed contract address or metadata", "", types.string)
  .setAction(async function (
    args: TaskArguments,
    { config, artifacts, run }: HardhatRuntimeEnvironment
  ) {
    if (!validateArgs(args)) {
      throw new NomicLabsHardhatPluginError(
        "@starboard/hardhat-verify",
        "Missing args for this task"
      );
    }
    if (!await artifacts.artifactExists(args.contractName)) {
      await run('compile')
    }

    if (!validateConfig(config)) {
      throw new NomicLabsHardhatPluginError(
        "@starboard/hardhat-verify",
        "Invalid starboardConfig for this task"
      );
    }
    const { contractName, contractAddress } = args

    const starboardConfig = config.starboardConfig;
    const buildInfo = await getBuildInfo(contractName, artifacts)
    if (!buildInfo) {
      throw new NomicLabsHardhatPluginError(
        "@starboard/hardhat-verify",
        "Invalid build info for this task"
      );
    }

    if (args.contractAddress === 'metadata') {
      const contractMeta = buildInfo[contractName]?.metadata
      writeMetaFile(contractMeta, contractName)
      return;
    }

    const body = await createFormData(contractName, buildInfo);

    try {
      console.log('verifing...')
      const res = await fetchVerify({
        baseURL: starboardConfig.baseURL,
        contractAddress: contractAddress,
        contractName: contractName,
        body,
      })
      const data = await res.json();
      if (data?.code === 0) {
        console.log(`${contractName} at ${contractAddress} is verified successfully`);
      } else {
        throw new NomicLabsHardhatPluginError(
          "@starboard/hardhat-verify",
          data.message || "Failed to verify contract"
        );
      }
    } catch (e) {
      throw new NomicLabsHardhatPluginError(
        "@starboard/hardhat-verify",
        (e as { message: string })?.message || "Failed to verify contract"
      );
    }
  });

function validateArgs(args: TaskArguments): boolean {
  return args.contractName !== null && args.contractAddress !== null;
}

function validateConfig(config: HardhatConfig) {
  const { starboardConfig } = config
  if (!starboardConfig.baseURL && !starboardConfig.network) {
    return false
  }
  return true
}

