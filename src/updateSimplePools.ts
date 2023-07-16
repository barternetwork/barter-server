import {PancakeSwapV2SubgraphProvider} from './providers/subgraph-provider/pancakeswapv2-subgraph-provider'
import {SushiSwapSubgraphProvider} from './providers/subgraph-provider/sushiswap-subgraph-provider'
import {UniSwapV2SubgraphProvider} from './providers/subgraph-provider/uniswapv2-subgraph-provider'
import {UniSwapV3SubgraphProvider} from './providers/subgraph-provider/uniswapv3-subgraph-provider'

import {ChainId, IS_ON_TESTNET} from './providers/utils/chainId'
import {RedisClient} from "./redis/client";
import {PancakeSwapV3SubgraphProvider} from "./providers/subgraph-provider/pancakeswapv3-subgraph-provider";
import {HiveSwapSubgraphProvider} from "./providers/subgraph-provider/hiveswap-subgraph-provider";
import {QuickSwapSubgraphProvider} from "./providers/subgraph-provider/quickswap-subgraph-provider";

const schedule = require('node-schedule');

const redis = new RedisClient();
redis.connect().then(() => {
    console.log("redis connected")
    scheduleTask();
}).catch((err) => {
    console.log("redis connect failed", err)
});


// const CurveApi_ETH = new CurveSubgraphProvider(NETWORK_ETH)
// const BalancerSubgraph_ETH = new BalancerSubgraphProvider(ChainId.MAINNET)
// const CurveApi_MATIC = new CurveSubgraphProvider(ChainId.POLYGON)
// const BalancerSubgraph_MATIC = new BalancerSubgraphProvider(ChainId.POLYGON)

const scheduleTask = async () => {
    let subgraphProviders = [];

    if (IS_ON_TESTNET()) {
        // subgraphProviders.push(new UniSwapV2SubgraphProvider(ChainId.GÖRLI, redis))
        //
        // subgraphProviders.push(new UniSwapV3SubgraphProvider(ChainId.GÖRLI, redis))
        //
        // subgraphProviders.push(new SushiSwapSubgraphProvider(ChainId.POLYGON_MUMBAI, redis))

        subgraphProviders.push(new PancakeSwapV2SubgraphProvider(ChainId.BSC_TEST, redis))
        //
        // subgraphProviders.push(new PancakeSwapV3SubgraphProvider(ChainId.GÖRLI, redis))
        subgraphProviders.push(new PancakeSwapV3SubgraphProvider(ChainId.BSC_TEST, redis))

        subgraphProviders.push(new QuickSwapSubgraphProvider(ChainId.POLYGON_MUMBAI, redis))

        subgraphProviders.push(new HiveSwapSubgraphProvider(ChainId.MAP_TEST, redis))

    } else {
        subgraphProviders.push(new UniSwapV2SubgraphProvider(ChainId.MAINNET, redis))

        subgraphProviders.push(new UniSwapV3SubgraphProvider(ChainId.MAINNET, redis))
        subgraphProviders.push(new UniSwapV3SubgraphProvider(ChainId.BSC, redis))
        subgraphProviders.push(new UniSwapV3SubgraphProvider(ChainId.POLYGON, redis))

        subgraphProviders.push(new SushiSwapSubgraphProvider(ChainId.MAINNET, redis))
        subgraphProviders.push(new SushiSwapSubgraphProvider(ChainId.BSC, redis))
        subgraphProviders.push(new SushiSwapSubgraphProvider(ChainId.POLYGON, redis))

        subgraphProviders.push(new PancakeSwapV2SubgraphProvider(ChainId.MAINNET, redis))
        subgraphProviders.push(new PancakeSwapV2SubgraphProvider(ChainId.BSC, redis))

        subgraphProviders.push(new PancakeSwapV3SubgraphProvider(ChainId.MAINNET, redis))
        subgraphProviders.push(new PancakeSwapV3SubgraphProvider(ChainId.BSC, redis))

        subgraphProviders.push(new QuickSwapSubgraphProvider(ChainId.POLYGON, redis))

        subgraphProviders.push(new HiveSwapSubgraphProvider(ChainId.MAP, redis))
    }

    schedule.scheduleJob('0 */1 * * * *', async () => {
        try {
            for (let provider of subgraphProviders) {
                await provider.quickGetPools()
            }
        } catch (err) {
            console.log("fail to update SimplePools ,error:", err)
        }
    });

}

// scheduleTask();

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandled exception', err);
})