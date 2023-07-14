import { task, types } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import {
  Artifact,
  Artifacts,
  HardhatConfig,
  HardhatRuntimeEnvironment,
  TaskArguments,
} from "hardhat/types";
import FormData from 'form-data'
import { fetchVerify } from "../service";

task("starboard-verify", "Verify smart contract on Starboard blockchain explorer.")
  .addPositionalParam("contractName", "Name of the contract to be verified.", "", types.string)
  .addPositionalParam("contractAddress", "Deployed contract address", "", types.string)
  .setAction(async function (
    args: TaskArguments,
    { config, artifacts }: HardhatRuntimeEnvironment
  ) {
    if (!validateArgs(args)) {
      throw new NomicLabsHardhatPluginError(
        "@starboard/hardhat-verify",
        "Missing args for this task"
      );
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

    const body = await createVerifyBody(contractName, buildInfo)

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


async function getBuildInfo(contractName: string, artifacts: Artifacts) {
  const allNames = await artifacts.getAllFullyQualifiedNames()
  const fn = allNames.find(s => s.split(':').pop() === contractName)!
  const [pathName, conName] = fn!?.split(':')
  const buildInfo = await artifacts.getBuildInfo(fn)
  const info = buildInfo?.output.contracts[pathName]! as unknown as { [k: string]: { metadata: string } }
  return info;
}

async function createVerifyBody(contractName: string, buildInfo: any) {
  const contractMeta = buildInfo[contractName]?.metadata
  const formData = new FormData()
  //required metadata file.
  formData.append('metadata.json', Buffer.from(contractMeta), 'metadata.json')
  Object.entries(JSON.parse(contractMeta)?.sources as { [k: string]: { content: string } }).map(([k, v]) => {
    formData.append(k, Buffer.from(v.content), k)
  })
  return formData;
}


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

