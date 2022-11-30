import { onchainPools } from './providers/onchain-provider/onchian-collection'
import { ChainId } from './providers/utils/chainId'
import { dexName } from './providers/utils/params'
const schedule = require('node-schedule');

const scheduleTask = () => {
    schedule.scheduleJob('59 */8 * * * *', () => {
        try{
            onchainPools(dexName.pancakeswap,ChainId.BSC)

            onchainPools(dexName.sushiswap,ChainId.MAINNET)
            onchainPools(dexName.uniswap_v2,ChainId.MAINNET)
            onchainPools(dexName.uniswap_v3,ChainId.MAINNET)
            //onchainPools(dexName.balancer,ChainId.MAINNET)
            //onchainPools(dexName.curve,ChainId.MAINNET)

            onchainPools(dexName.quickswap,ChainId.POLYGON)
            onchainPools(dexName.sushiswap,ChainId.POLYGON)
            onchainPools(dexName.uniswap_v3,ChainId.POLYGON)
            //onchainPools(dexName.balancer,ChainId.POLYGON)
            //onchainPools(dexName.curve,ChainId.POLYGON)
        }catch(err){
            console.log("fail to update OnChainPools ,error:",err)
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