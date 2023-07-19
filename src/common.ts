
import fetch from "node-fetch";
import path from 'path'
import fs from 'fs'
import FormData from 'form-data'
import {
  Artifacts, BuildInfo,
} from "hardhat/types";
import { VerifyArgsCaller, NetworkHost } from './types'

export async function fetchVerify({ baseURL, contractAddress, body, network }: VerifyArgsCaller) {
  const host = baseURL || network === 'Calibration' ? NetworkHost.Calibration : NetworkHost.Mainnet
  return fetch(
    `${host}/api/v1/contract/${contractAddress}/verify`,
    {
      method: "POST",
      body,
    }
  );
}

export async function writeMetaFile(meta: string, contractName: string,) {
  const out = path.join(process.cwd(), `${contractName}_Metadata.json`)
  fs.writeFileSync(out, meta)
  console.log('Metadata generated successfully at:', out)
}

export async function createFormData(contractName: string, buildInfo: any) {
  const contractMeta = buildInfo[contractName]?.metadata
  const formData = new FormData()
  formData.append('metadata.json', Buffer.from(contractMeta), 'metadata.json')
  Object.entries(JSON.parse(contractMeta)?.sources as { [k: string]: { content: string } }).map(([k, v]) => {
    formData.append(k, Buffer.from(buildInfo.input.sources?.[k]?.content), k)
  })
  return formData;
}

export async function getBuildInfo(contractName: string, artifacts: Artifacts) {
  const allNames = await artifacts.getAllFullyQualifiedNames()
  const fn = allNames.find(s => s.split(':').pop() === contractName)!
  const [pathName, conName] = fn!?.split(':')
  const buildInfo = await artifacts.getBuildInfo(fn)
  const info = buildInfo?.output.contracts[pathName]! as unknown as { [k: string]: { metadata: string }} & {input: BuildInfo['input']}
  info.input = buildInfo?.input!
  return info;
}
