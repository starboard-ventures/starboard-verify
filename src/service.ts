import fetch from "node-fetch";
import FormData from 'form-data'
// import { artifacts } from 'hardhat'
import { VerifyArgs, VerifyArgsCaller, VerifyResponse, NetworkHost, Networks } from './types'
import { Artifacts, BuildInfo } from "hardhat/types";

export const fetchVerify = async ({ baseURL, contractAddress, body, network }: VerifyArgsCaller) => {
  const host = baseURL || network === 'Calibration' ? NetworkHost.Calibration : NetworkHost.Mainnet
  return fetch(
    `${host}/api/v1/contract/${contractAddress}/verify`,
    {
      method: "POST",
      body,
    }
  );
}

// export class StarboardVerify {
//   private baseURL?: string
//   private contractAddress: string
//   private contractName: string
//   private network?: Networks

//   constructor(args: VerifyArgs) {
//     this.baseURL = args.baseURL
//     this.contractAddress = args.contractAddress
//     this.contractName = args.contractName
//     this.network = args.network
//   }

//   async getBuildInfo() {
//     const allNames = await artifacts.getAllFullyQualifiedNames()
//     const fn = allNames.find(s => s.split(':').pop() === this.contractName)!
//     const [pathName, conName] = fn!?.split(':')
//     const buildInfo = await artifacts.getBuildInfo(fn)
//     const info = buildInfo?.output.contracts[pathName]! as unknown as { [k: string]: { metadata: string } }
//     console.log('get build info', info)
//     return info;
//   }

//   async getVerifyBody() {
//     const buildInfo = await this.getBuildInfo();
//     const contractMeta = buildInfo[this.contractName]?.metadata
//     const formData = new FormData()
//     //required metadata file.
//     formData.append('metadata.json', Buffer.from(contractMeta), 'metadata.json')
//     Object.entries(JSON.parse(contractMeta)?.sources as { [k: string]: { content: string } }).map(([k, v]) => {
//       formData.append(k, Buffer.from(v.content), k)
//     })
//     return formData;
//   }

//   async verify() {
//     const verifyRes = await fetchVerify({
//       baseURL: this.baseURL,
//       contractAddress: this.contractAddress,
//       contractName: this.contractName,
//       body: await this.getVerifyBody() || new FormData(),
//       network: this.network
//     })
//     const response: VerifyResponse = await verifyRes.json()
//     if (response?.code === 0) {
//       console.log(`${this.contractName} at ${this.contractAddress} verified successfully`);
//       return response;
//     } else {
//       throw new Error(
//         response?.message || "Failed to verify contract"
//       );
//     }
//   }
// }
