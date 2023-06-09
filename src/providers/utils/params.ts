import {ETH_PRICE_API} from './url'
const request = require('request');

export async function ethPrice():Promise<number>{
    return  new Promise(function (resolve, reject) {
        request(ETH_PRICE_API, { json: true }, (err: any, res: any, body: any) => {
            if (err != null){
                console.log("fail to get eth_price,error:",err)
            }else{
                let price
                try{
                    price = body.data.price
                }catch(err){
                    console.log(err)
                }
                resolve(price)
            }
        })
    })
}

// export enum dexName {
//     pancakeswap = 'pancakeswap',
//     quickswap = 'quickswap',
//     sushiswap = 'sushiswap',
//     uniswap_v2 = 'uniswap_v2',
//     uniswap_v3 = 'uniswap_v3',
//     curve = 'curve',
//     balancer = 'balancer',
//     hiveswap = 'hiveswap'
// }

export enum ButterProtocol {
    UNI_V2 = 'UniswapV2',
    UNI_V3 = 'UniswapV3',
    QUICK_V2 = 'Quickswap',
    SUSHI_V2 = 'Sushiswap',
    PANCAKE_V2 = 'PancakeswapV2',
    PANCAKE_V3 = 'PancakeswapV3',
    CURVE = 'Curve',
    REF = 'Ref.finance',
    HIVE_V2 = 'Hiveswap',
    BALANCER = 'Balancer'
}