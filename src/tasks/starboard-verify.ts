import { task, types } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import {
  Artifact,
  Artifacts,
  HardhatConfig,
  HardhatRuntimeEnvironment,
  TaskArguments,
} from "hardhat/types";
import fetch from "node-fetch";
import path from "path";
import fse from 'fs-extra'
import FormData from 'form-data'
import { fetchVerify } from "../service";

task("starboard-verify", "Verify smart contract on Starboard blockchain explorer.")
  .addPositionalParam("contractName", "Name of the contract to be verified.", "", types.string)
  .addPositionalParam("contractAddress", "Deployed contract address", "", types.string)
  .setAction(async function (
    args: TaskArguments,
    { config, artifacts }: HardhatRuntimeEnvironment
  ) {
    // console.log('%c [ config ]-20', 'font-size:13px; background:pink; color:#bf2c9f;', config)
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
    // const artifact = await artifacts.readArtifact(contractName)


    const starboardConfig = config.starboardConfig;
    // const starboardVerify = new StarboardVerify({
    //   contractAddress: contractAddress,
    //   contractName: contractName,
    //   baseURL: starboardConfig.baseURL,
    //   network: starboardConfig.network,
    // })
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
    // // console.log('%c [ s1 ]-29', 'font-size:13px; background:pink; color:#bf2c9f;', s1)
    // const s2 = await artifacts.getAllFullyQualifiedNames()
    // const fn = s2.find(s => s.split(':').pop() === contractName)
    // const [pn, cn] = fn!?.split(':')
    // if (!fn) return;
    // const buildInfo = await artifacts.getBuildInfo(fn)
    // const info = buildInfo?.output.contracts[pn]! as unknown as { [k: string]: { metadata: string } }
    // const contractMeta = info[cn]?.metadata
    // fse.writeFileSync('./out.json', contractMeta)
    // const formData = new FormData()

    // console.log('%c [ Object.entries(JSON.parse(contractMeta).sources) ]-41', 'font-size:13px; background:pink; color:#bf2c9f;', Object.keys(JSON.parse(contractMeta).sources))
    // formData.append('metadata.json', Buffer.from(contractMeta), 'metadata.json')
    // Object.entries(JSON.parse(contractMeta).sources as { [k: string]: { content: string } }).map(([k, v]) => {
    //   formData.append(k, Buffer.from(v.content), k)
    // })
    // console.log(formData)
    // try {
    //   const response = await starboardVerify.verify();
    //   if (response?.code === 0) {
    //     console.log(`${contractName} is verified`);
    //   } else {
    //     throw new NomicLabsHardhatPluginError(
    //       "@starboard/hardhat-verify",
    //       response.message || "Failed to verify contract"
    //     );
    //   }
    // } catch (e) {
    //   console.error('Error', e)
    //   throw new NomicLabsHardhatPluginError(
    //     "@starboard/hardhat-verify",
    //     (e as { message: string })?.message || "Failed to verify contract"
    //   );
    // }
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
  // const buildInfo = await this.getBuildInfo();
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

