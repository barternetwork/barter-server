import { gql } from 'graphql-request';

export enum LiquidityMoreThan90Percent {
  QuickSwap = 3000,
  SushiSwap = 3000,
  PancakeSwap_V2 = 2000,
  PancakeSwap_V3 = 3000,
  ApeSwap = 100,
  UniSwap_V2 = 3000,
  UniSwap_V3 = 3000,
  Curve = 44,
  Balancer = 15,
  Hiveswap = 1000
}

export const PageSize = 1000;

// gql needed to query graph data

// quickswap\uniswap\pancakeswap\sushiswap
export function queryV2PoolGQL(first:number, tokenType:string) {

  return gql`
{
    pairs(first: ${first}, orderBy: trackedReserve${tokenType}, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      token0Price
      token1Price
      totalSupply
      reserve${tokenType}
      trackedReserve${tokenType}
    }
}
`;

}

export function queryV3PoolGQL(first:number) {

  return  gql`
        {
            pools(first: ${first}, orderBy: totalValueLockedUSD, orderDirection: desc) {
              id
              feeTier
              liquidity
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
              token1Price
              token0Price
              totalValueLockedUSD
              totalValueLockedETH
            }
          }
`;
}

export function quickQueryV2PoolGQL(first:number, tokenType:string, skip:number) {

  return gql`
{
    pairs(first: ${first}, orderBy: trackedReserve${tokenType}, orderDirection: desc, skip: ${skip}) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      reserve0
      reserve1
      totalSupply
      reserve${tokenType}
      reserveUSD
      trackedReserve${tokenType}
    }
}
`;

}

export function pancakeQuickQueryV2PoolGQL(first:number, tokenType:string, skip:number) {

  return gql`
{
    pairs(first: ${first}, orderBy: trackedReserve${tokenType}, orderDirection: desc, skip: ${skip}) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      reserve0
      reserve1
      totalSupply
      reserve${tokenType}
      reserveUSD
      trackedReserve${tokenType}
    }
}
`;
}


export function pancakeQuickQueryV2PoolGQL2( tokenType:string) {

  return gql`
{
    pairs(first: $first, where: { id_gt: "$id" }) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      reserve0
      reserve1
      totalSupply
      reserve${tokenType}
      reserveUSD
      trackedReserve${tokenType}
    }
}
`;
}

export function quickQueryV3PoolGQL(first:number, skip:number) {

  return  gql`
        {
            pools(first: ${first}, orderBy: totalValueLockedUSD, orderDirection: desc, skip: ${skip}) {
              id
              feeTier
              liquidity
              sqrtPrice
              tick
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
              totalValueLockedUSD
              totalValueLockedETH
            }
          }
`;
}

export function pancakeQuickQueryV3PoolGQL(first:number, skip:number) {

  return  gql`
        {
            pools(first: ${first}, orderBy: totalValueLockedUSD, orderDirection: desc, skip: ${skip}) {
              id
              feeTier
              liquidity
              sqrtPrice
              tick
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
              totalValueLockedUSD
              totalValueLockedETH
            }
          }
`;
}

// curve
export function queryCurvePoolGQL(first:number) {

  return gql`
  query MyQuery {
      pools(first: ${first}, orderBy: cumulativeVolumeUSD, orderDirection: desc) {
        address
        assetType
        baseApr
        basePool
        coinDecimals
        coins
        creationBlock
        creationDate
        creationTx
        cumulativeVolume
        cumulativeVolumeUSD
        id
        isV2
        lpToken
        metapool
        name
        poolType
        symbol
        virtualPrice
      }
    }
  `;

}

export function quickQueryCurvePoolGQL(first:number) {

  return gql`
  query MyQuery {
      pools(first: ${first}, orderBy: cumulativeVolumeUSD, orderDirection: desc) {
        address
        coins
      }
    }
  `;

}

// balancer
export function queryBalancerPoolGQL(first:number){
  return gql`
  query MyQuery {
    pools(first: ${first}, orderDirection: desc, orderBy: totalLiquidity) {
      address
      id
      name
      poolType
      swapEnabled
      swapFee
      swapsCount
      symbol
      tokensList
      totalLiquidity
      totalShares
      totalSwapFee
      totalSwapVolume
      totalWeight
      tx
    }
  }
  `
}

export function quickQueryBalancerPoolGQL(first:number){
  return gql`
  query MyQuery {
    pools(first: ${first}, orderDirection: desc, orderBy: totalLiquidity) {
      id
      name
      symbol
      totalLiquidity
      tokensList
    }
  }
  `
}