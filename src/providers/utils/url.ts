import {ChainId} from './chainId'

// https://dev.sushi.com/docs/Developers/Subgraphs/Overview
export const SUBGRAPH_URL_BY_SUSHISWAP: { [chainId in ChainId]?: string } = {
    [ChainId.POLYGON]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
};

// TODO: Deploy on Ethereum mainnet/ Goerli testnet/ BSC testnet
export const SUBGRAPH_URL_BY_PANCAKESWAP_V2: { [chainId in ChainId]?: string } = {
    // [ChainId.MAINNET]:
    //     'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange',
    // [ChainId.GÖRLI]:
    //     'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-goerli',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-cake-pairs',
    [ChainId.BSC_TEST]:
        'https://api.thegraph.com/subgraphs/name/pandarr007/pancakeswap',
};

// https://github.com/pancakeswap/pancake-subgraph
export const SUBGRAPH_URL_BY_PANCAKESWAP_V3: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
    [ChainId.GÖRLI]:
        'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc',
    [ChainId.BSC_TEST]:
        'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
};

// TODO: Deploy on Polygon Mumbai testnet
export const SUBGRAPH_URL_BY_QUICKSWAP: { [chainId in ChainId]?: string } = {
    [ChainId.POLYGON]:
        'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
    [ChainId.POLYGON_MUMBAI]:
        'https://api.thegraph.com/subgraphs/name/pandarr007/quickswap-v2-mumbai',
};

// TODO: Deploy on BSC and Polygon
export const SUBGRAPH_URL_BY_UNISWAP_V2: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
    // 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev',
    [ChainId.GÖRLI]:
        'https://api.thegraph.com/subgraphs/name/pandarr007/uniswap-v2-goerli',
};

export const SUBGRAPH_URL_BY_UNISWAP_V3: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [ChainId.GÖRLI]:
        'https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli',
    [ChainId.BSC]:
        'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc',
    [ChainId.POLYGON]:
        'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
};

export const SUBGRAPH_URL_BY_CURVE: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/convex-community/volume-mainnet',
    [ChainId.POLYGON]:
        'https://api.thegraph.com/subgraphs/name/convex-community/volume-matic',
};

export const API_URL_BY_CURVE: { [chainId in ChainId]?: string[] } = {
    [ChainId.MAINNET]:
        ['https://api.curve.fi/api/getPools/ethereum/main', 'https://api.curve.fi/api/getPools/ethereum/crypto',
            'https://api.curve.fi/api/getPools/ethereum/factory', 'https://api.curve.fi/api/getPools/ethereum/factory-crypto'],
    [ChainId.POLYGON]:
        ['https://api.curve.fi/api/getPools/polygon/main', 'https://api.curve.fi/api/getPools/polygon/crypto', 'https://api.curve.fi/api/getPools/polygon/factory'],
};

export const SUBGRAPH_URL_BY_BALANCER: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    [ChainId.POLYGON]:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
};

export const SUBGRAPH_URL_BY_HIVESWAP: { [chainId in ChainId]?: string } = {
    [ChainId.MAP]:
        'https://makalu-graph.maplabs.io/subgraphs/name/map/hiveswap2',
    [ChainId.MAP_TEST]:
        'http://8.222.255.78:8000/subgraphs/name/testnet/hiveswap2',
};

export const CHAIN_RPC: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]:
        'https://mainnet.infura.io/v3/8cce6b470ad44fb5a3621aa34243647f',
    [ChainId.POLYGON]:
        'https://polygon-mainnet.infura.io/v3/8cce6b470ad44fb5a3621aa34243647f',
    [ChainId.BSC]:
        'https://bsc-dataseed.binance.org/',
    [ChainId.MAP]:
        'https://poc3-rpc.maplabs.io'
}

export const ETH_PRICE_API = 'https://api.curve.fi/api/getETHprice'