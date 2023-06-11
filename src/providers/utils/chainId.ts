export enum ChainId {
    MAINNET = 1,
    GÖRLI = 5,
    POLYGON = 137,
    POLYGON_MUMBAI = 80001,
    BSC = 56,
    BSC_TEST = 97,
    MAP = 22776,
    MAP_TEST = 212
}

export function IS_ON_TESTNET(): boolean {
    if (process.env.TESTNET == undefined) {
        return true;
    }
    return JSON.parse(process.env.TESTNET);
}