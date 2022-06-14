export interface ISubgraphProvider {
  //fetch details from graphql and storage to mongodb
  getPools: () => any | undefined;
  //fetch simple message from graphql quickly and storage to mongodb 
  quickGetPools: () => any | undefined;
}

//several formats http returns
export interface V3SubgraphPool {
  id: string;
  feeTier: string;
  liquidity: string;
  token0: {
    id: string;
  };
  token1: {
    id: string;
  };
  tvlETH: number;
  tvlUSD: number;
}

export interface V2SubgraphPool {
  id: string;
  token0: {
    id: string;
  };
  token1: {
    id: string;
  };
  supply: number;
  reserve: number;
}

//several types graphql fetch data
export type RawETHV2SubgraphPool = {
  id: string;
  token0: {
    symbol: string;
    id: string;
  };
  token1: {
    symbol: string;
    id: string;
  };
  totalSupply: string;
  reserveETH: string;
  trackedReserveETH: string;
};

export type RawETHV3SubgraphPool = {
  id: string;
  feeTier: string;
  liquidity: string;
  token0: {
    symbol: string;
    id: string;
  };
  token1: {
    symbol: string;
    id: string;
  };
  totalValueLockedUSD: string;
  totalValueLockedETH: string;
};

export type RawBNBV2SubgraphPool = {
  id: string;
  token0: {
    symbol: string;
    id: string;
  };
  token1: {
    symbol: string;
    id: string;
  };
  totalSupply: string;
  reserveBNB: string;
  trackedReserveBNB: string;
};

export type RawCurveSubgraphPool = {
  address: string,
  assetType: string,
  baseApr: string,
  basePool: string,
  coinDecimals: [],
  coinNames: [],
  coins: [],
  creationBlock: string,
  creationDate: string,
  creationTx: string,
  cumulativeVolume: string,
  cumulativeVolumeUSD: string,
  id: string,
  isV2: boolean,
  lpToken: string,
  metapool: boolean,
  name: string,
  poolType: string,
  symbol: string,
  virtualPrice: string
};

export type RawBalancerSubgraphPool = {
  address: string;
  id: string;
  name: string;
  poolType: string;
  swapEnabled: string;
  swapFee: string;
  swapsCount: string;
  symbol: string;
  tokensList: string;
  totalLiquidity: string;
  totalShares: string;
  totalSwapFee: string;
  totalSwapVolume: string;
  totalWeight: string;
  tx: string;
};