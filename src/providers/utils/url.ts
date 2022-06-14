import { ChainId } from './chainId'

export const SUBGRAPH_URL_BY_SUSHISWAP: { [chainId in ChainId]?: string } = {
  [ChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
  [ChainId.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
};

export const SUBGRAPH_URL_BY_PANCAKESWAP: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]:
    'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
};

export const SUBGRAPH_URL_BY_QUICKSWAP: { [chainId in ChainId]?: string } = {
  [ChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
};

export const SUBGRAPH_URL_BY_UNISWAP_V2: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
};

export const SUBGRAPH_URL_BY_UNISWAP_V3: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [ChainId.RINKEBY]:
    'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-rinkeby',
  [ChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
};

export const SUBGRAPH_URL_BY_CURVE: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/convex-community/volume-mainnet',
  [ChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/convex-community/volume-matic',
};

export const API_URL_BY_CURVE: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://api.curve.fi/api/getPools/ethereum/main',
  [ChainId.POLYGON]:
    'https://api.curve.fi/api/getPools/polygon/main',
};

export const SUBGRAPH_URL_BY_BALANCER: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://thegraph.com/legacy-explorer/subgraph/balancer-labs/balancer-v2',
  [ChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
};

export const CHAIN_RPC: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]:
    'https://mainnet.infura.io/v3/8cce6b470ad44fb5a3621aa34243647f',
  [ChainId.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/8cce6b470ad44fb5a3621aa34243647f',
  [ChainId.BSC]:
    'https://bsc-dataseed.binance.org/',
}

export const ETH_PRICE_API = 'https://api.curve.fi/api/getETHprice'