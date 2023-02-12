import { PancakeSwapSubgraphProvider } from './providers/subgraph-provider/pancakeswap-subgraph-provider'
import { QuickSwapSubgraphProvider } from './providers/subgraph-provider/quickswap-subgraph-provider'
import { SushiSwapSubgraphProvider } from './providers/subgraph-provider/sushiswap-subgraph-provider'
import { UniSwapV2SubgraphProvider } from './providers/subgraph-provider/uniswapv2-subgraph-provider'
import { UniSwapV3SubgraphProvider } from './providers/subgraph-provider/uniswapv3-subgraph-provider'
import { CurveSubgraphProvider } from './providers/subgraph-provider/curvefi-subgraph-provider'
import { BalancerSubgraphProvider } from './providers/subgraph-provider/balancer-subgraph-provider'
import { HiveSwapSubgraphProvider } from './providers/subgraph-provider/hiveswap-subgraph-provider'

import {ChainId, NETWORK_BSC, NETWORK_ETH, NETWORK_MAP, NETWORK_POLYGON} from './providers/utils/chainId'
import {RedisClient} from "./redis/client";
const schedule = require('node-schedule');

const PancakeSwapSubgraph_BSC = new PancakeSwapSubgraphProvider(NETWORK_BSC)
//
// const HiveSwapSubgraph_MAP = new HiveSwapSubgraphProvider(NETWORK_MAP)
//
// const SushiSwapSubgraph_ETH = new SushiSwapSubgraphProvider(NETWORK_ETH)
const UniSwapV2Subgraph_ETH = new UniSwapV2SubgraphProvider(NETWORK_ETH)
// const UniSwapV3Subgraph_ETH = new UniSwapV3SubgraphProvider(NETWORK_ETH)
// const CurveApi_ETH = new CurveSubgraphProvider(NETWORK_ETH)
// // const BalancerSubgraph_ETH = new BalancerSubgraphProvider(ChainId.MAINNET)
//
const QuickSwapSubgraph_MATIC = new QuickSwapSubgraphProvider(NETWORK_POLYGON)
// const SushiSwapSubgraph_MATIC = new SushiSwapSubgraphProvider(ChainId.POLYGON)
// const UniSwapV3Subgraph_MATIC = new UniSwapV3SubgraphProvider(ChainId.POLYGON)
// const CurveApi_MATIC = new CurveSubgraphProvider(ChainId.POLYGON)
// const BalancerSubgraph_MATIC = new BalancerSubgraphProvider(ChainId.POLYGON)

const scheduleTask = () => {
    schedule.scheduleJob('0 */1 * * * *', () => {
        try{
            PancakeSwapSubgraph_BSC.quickGetPools()
            //
            // HiveSwapSubgraph_MAP.quickGetPools()
            //
            // SushiSwapSubgraph_ETH.quickGetPools()
            UniSwapV2Subgraph_ETH.quickGetPools()
            // UniSwapV3Subgraph_ETH.quickGetPools()
            // // CurveApi_ETH.getPoolsByApi()
            // // BalancerSubgraph_ETH.quickGetPools()
            //
            QuickSwapSubgraph_MATIC.quickGetPools()
            // SushiSwapSubgraph_MATIC.quickGetPools()
            // UniSwapV3Subgraph_MATIC.quickGetPools()
            // CurveApi_MATIC.getPoolsByApi()
            // BalancerSubgraph_MATIC.quickGetPools()
        }catch(err){
            console.log("fail to update SimplePools ,error:",err)
        }
    });

}

scheduleTask();

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandled exception', err);
})