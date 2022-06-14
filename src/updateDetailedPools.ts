import { PancakeSwapSubgraphProvider } from './providers/subgraph-provider/pancakeswap-subgraph-provider'
import { QuickSwapSubgraphProvider } from './providers/subgraph-provider/quickswap-subgraph-provider'
import { SushiSwapSubgraphProvider } from './providers/subgraph-provider/sushiswap-subgraph-provider'
import { UniSwapV2SubgraphProvider } from './providers/subgraph-provider/uniswapv2-subgraph-provider'
import { UniSwapV3SubgraphProvider } from './providers/subgraph-provider/uniswapv3-subgraph-provider'
import { CurveSubgraphProvider } from './providers/subgraph-provider/curvefi-subgraph-provider'

import { ChainId } from './providers/utils/chainId'
const schedule = require('node-schedule');


const PancakeSwapSubgraph = new PancakeSwapSubgraphProvider(ChainId.BSC)
const QuickSwapSubgraph = new QuickSwapSubgraphProvider(ChainId.POLYGON)
const SushiSwapSubgraph = new SushiSwapSubgraphProvider(ChainId.POLYGON)
const UniSwapV2Subgraph = new UniSwapV2SubgraphProvider(ChainId.MAINNET)
const UniSwapV3Subgraph = new UniSwapV3SubgraphProvider(ChainId.POLYGON)
const CurveSubgraph = new CurveSubgraphProvider(ChainId.POLYGON)

const scheduleTask = () => {
    schedule.scheduleJob('30 */5 * * * *', () => {
        try{
            PancakeSwapSubgraph.getPools()
            QuickSwapSubgraph.getPools()
            SushiSwapSubgraph.getPools()
            UniSwapV2Subgraph.getPools()
            UniSwapV3Subgraph.getPools()
            CurveSubgraph.getPools()
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