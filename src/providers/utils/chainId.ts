const test = false;

export enum ChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42,
    POLYGON = 137,
    POLYGON_MUMBAI = 80001,
    BSC = 56,
    BSC_TEST = 97,
    MAP = 22776,
    MAP_TEST = 212
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


export const NETWORK_BSC: ChainId = test ? ChainId.BSC_TEST : ChainId.BSC;
export const NETWORK_ETH: ChainId = test ? ChainId.GÖRLI : ChainId.MAINNET;
export const NETWORK_POLYGON: ChainId = test ? ChainId.POLYGON_MUMBAI : ChainId.POLYGON;
export const NETWORK_MAP: ChainId = test ? ChainId.MAP_TEST : ChainId.MAP;

