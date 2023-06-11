import { PancakeSwapV2SubgraphProvider } from './providers/subgraph-provider/pancakeswapv2-subgraph-provider'
import { QuickSwapSubgraphProvider } from './providers/subgraph-provider/quickswap-subgraph-provider'
import { SushiSwapSubgraphProvider } from './providers/subgraph-provider/sushiswap-subgraph-provider'
import { UniSwapV2SubgraphProvider } from './providers/subgraph-provider/uniswapv2-subgraph-provider'
import { UniSwapV3SubgraphProvider } from './providers/subgraph-provider/uniswapv3-subgraph-provider'
import { CurveSubgraphProvider } from './providers/subgraph-provider/curvefi-subgraph-provider'
import { BalancerSubgraphProvider } from './providers/subgraph-provider/balancer-subgraph-provider'

import { ChainId } from './providers/utils/chainId'
const schedule = require('node-schedule');


const PancakeSwapSubgraph_BSC = new PancakeSwapV2SubgraphProvider(ChainId.BSC)

const SushiSwapSubgraph_ETH = new SushiSwapSubgraphProvider(ChainId.MAINNET)
const UniSwapV2Subgraph_ETH = new UniSwapV2SubgraphProvider(ChainId.MAINNET)
const UniSwapV3Subgraph_ETH = new UniSwapV3SubgraphProvider(ChainId.MAINNET)
const CurveSubgraph_ETH = new CurveSubgraphProvider(ChainId.MAINNET)
const BalancerSubgraph_ETH = new BalancerSubgraphProvider(ChainId.MAINNET)

const QuickSwapSubgraph_MATIC = new QuickSwapSubgraphProvider(ChainId.POLYGON)
const SushiSwapSubgraph_MATIC = new SushiSwapSubgraphProvider(ChainId.POLYGON)
const UniSwapV3Subgraph_MATIC = new UniSwapV3SubgraphProvider(ChainId.POLYGON)
const CurveSubgraph_MATIC = new CurveSubgraphProvider(ChainId.POLYGON)
const BalancerSubgraph_MATIC = new BalancerSubgraphProvider(ChainId.POLYGON)

const scheduleTask = () => {
    schedule.scheduleJob('30 */10 * * * *', () => {
        try{
            PancakeSwapSubgraph_BSC.getPools()

            SushiSwapSubgraph_ETH.getPools()
            UniSwapV2Subgraph_ETH.getPools()
            UniSwapV3Subgraph_ETH.getPools()
            CurveSubgraph_ETH.getPools()
            BalancerSubgraph_ETH.getPools()

            //QuickSwapSubgraph_MATIC.getPools()
            SushiSwapSubgraph_MATIC.getPools()
            UniSwapV3Subgraph_MATIC.getPools()
            CurveSubgraph_MATIC.getPools()
            BalancerSubgraph_MATIC.getPools()

            console.log(new Date(), 'the DetailedPoolsTable have updated.');
        }catch(err){
            console.log("fail to update DetailedPools ,error:",err)
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