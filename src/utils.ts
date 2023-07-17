import FormData from 'form-data'
import hre from 'hardhat'
import { fetchVerify, getBuildInfo, createFormData, writeMetaFile } from './common'
import { VerifyArgs, VerifyArgsCaller, VerifyResponse, NetworkHost, Networks } from './types'

export const generateMetadata = async (contractName: string) => {
  const exist = await checkExist(contractName)
  if (!exist) {
    console.error(`Contract ${contractName} not found, please check if you have compiled it.`)
  };
  const buildInfo = await getBuildInfo(contractName, hre.artifacts);
  const contractMeta = buildInfo[contractName]?.metadata
  writeMetaFile(contractMeta, contractName)
}

export const checkExist = async (contractName: string) => {
  return await hre.artifacts.artifactExists(contractName)
}

export class StarboardVerify {
  private baseURL?: string
  private contractAddress: string
  private contractName: string
  private network?: Networks

  constructor(args: VerifyArgs) {
    this.baseURL = args.baseURL
    this.contractAddress = args.contractAddress
    this.contractName = args.contractName
    this.network = args.network
  }

  async getVerifyBody() {
    const buildInfo = await getBuildInfo(this.contractName, hre.artifacts);
    const formData = await createFormData(this.contractName, buildInfo)
    return formData;
  }

  async verify() {
    const exist = await checkExist(this.contractName)
    if (!exist) {
      console.error(`Contract ${this.contractName} not found, please check if you have compiled it.`)
      return;
    };
    try {
      const verifyRes = await fetchVerify({
        baseURL: this.baseURL,
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        body: await this.getVerifyBody() || new FormData(),
        network: this.network
      })
      const response: VerifyResponse = await verifyRes.json()
      if (response?.code === 0) {
        console.log(`${this.contractName} at ${this.contractAddress} verified successfully`);
        return response;
      } else {
        throw new Error(
          response?.message || "Failed to verify contract"
        );
      }
    } catch (e) {
      console.error('Failed to verify contract:', e)
    }
  }
}
