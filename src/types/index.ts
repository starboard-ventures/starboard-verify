import FormData from 'form-data'

export interface VerifyArgs {
  baseURL?: string,
  contractAddress: string,
  contractName: string,
 
  network?: Networks,
}
export interface VerifyArgsCaller extends VerifyArgs {
  body: FormData,
}

export type Networks = 'Mainnet' | 'Calibration'

export enum NetworkHost {
  Mainnet = 'https://fvm-api.starboard.ventures',
  Calibration = 'https://fvm-calibration-api.starboard.ventures'
}

export interface VerifyResponse {
  code: number,
  message: string,
  data?: any
}
