
export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  POLYGON = 137,
  BSC = 56,
}

export const V2_SUPPORTED = [
  ChainId.MAINNET,
  ChainId.KOVAN,
  ChainId.GÖRLI,
  ChainId.RINKEBY,
  ChainId.ROPSTEN,
];


export const V3_SUPPORTED = [
  ChainId.MAINNET,
  ChainId.POLYGON
];