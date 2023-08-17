import { GraphQLClient } from 'graphql-request';
import { ChainId } from '../utils/chainId'
import {ButterProtocol} from '../utils/params'
import {
    CONCENTRATED_POOL_URL_BY_KLAYSWAP,
    RECENT_POOL_URL_BY_KLAYSWAP,
    SUBGRAPH_URL_BY_UNISWAP_V3,
    TOKEN_URL_BY_KLAYSWAP
} from '../utils/url'
import {ISubgraphProvider, RawBNBV3SubgraphPool, RawETHV2SubgraphPool, RawETHV3SubgraphPool} from '../utils/interfaces'
import {
    LiquidityMoreThan90Percent,
    PageSize,
    queryV3PoolGQL,
    quickQueryV3PoolGQL
} from '../utils/gql'
import {RedisClient} from "../../redis/client";
import {getSimplePoolRedisKey} from "../utils/misc";
import {ethers} from "ethers";
const retry = require('async-retry');
export class Klayswapv2Provider implements ISubgraphProvider{
    private redis: RedisClient;
    private poolUrl: string;
    private tokenUrl: string;

    constructor(    
        private chainId: ChainId,
        private redisClient: RedisClient,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        this.poolUrl = RECENT_POOL_URL_BY_KLAYSWAP[this.chainId]
        if (!this.poolUrl) {
            throw new Error(`No pool url for chain id: ${this.chainId}`);
        }
        this.tokenUrl = TOKEN_URL_BY_KLAYSWAP[this.chainId]
        if (!this.tokenUrl) {
            throw new Error(`No token url for chain id: ${this.chainId}`);
        }
        this.redis = redisClient;
    }   

    async getPools(){
    }

    async quickGetPools() {
        await retry(
            async () => {
                let start = Date.now();
                const pools = await this.getV2PoolsInfo();

                let data = {
                    updateTime: Date.parse(new Date().toString()),
                    name: ButterProtocol.KLAY_V2,
                    chainId: this.chainId,
                    result: pools,
                }
                // console.log(`query ${pools.length} uniswap v3 pools on chain ${this.chainId} costs:`, Date.now() - start);
                let key = getSimplePoolRedisKey(this.chainId, data.name)
                this.redis.set(key, JSON.stringify(data))
            },
            {
                retries: this.retries,
                maxTimeout: this.maxTimeout,
                onRetry: (err, retry) => {
                    console.log("error message:", err, ",retry times:", retry)
                },
            }
        );
    }

    async getTokens() {

    }

    async getV2PoolsInfo() {
        const tokensResponse = await fetch(this.tokenUrl);
            // .then((response) => {
            //     if (response.ok) {
            //         return response.json();
            //     } else {
            //         return Promise.reject({
            //             status: response.status,
            //             message: response.statusText
            //         });
            //     }
            // })
            // .then((response) => {
            //     console.log("token response:", response)
            //     const tokensInfo = response["tokenInfo"];
            //     let tokensMap = new Map();
            //     for (let i = 1; i < tokensInfo.length; i++) {
            //         let token = tokensInfo[i];
            //         tokensMap.set(token["address"], token);
            //     }
            //     return tokensMap;
            // });

        if (!tokensResponse.ok) {
            throw new Error(`Failed to fetch tokens with status code: ${tokensResponse.status}`);
        }

        const tokensInfo = await tokensResponse.json();
        const tokensMap = new Map();
        console.log("token response:", tokensInfo.length)
        for (let i = 1; i < tokensInfo.length; i++) {
            let token = tokensInfo[i];
            tokensMap.set(token[1], token);
        }

        const poolsResponse = await fetch(this.poolUrl);
            // .then((response) => {
            //     if (response.ok) {
            //         return response.json();
            //     } else {
            //         return Promise.reject({
            //             status: response.status,
            //             message: response.statusText
            //         });
            //     }
            // })
            // .then((response) => {
            //     // console.log("response:", response)
            //     let poolsArray : RawETHV2SubgraphPool[] =[] ;
            //     for (let i = 1; i < response["recentPool"].length; i++) {
            //         const poolInfo = response["recentPool"][i];
            //         const token0 = tokensMap.get(poolInfo[2]);
            //         const token1 = tokensMap.get(poolInfo[3]);
            //         const pool :RawETHV2SubgraphPool = {
            //             id: poolInfo[1],
            //             token0: {id: poolInfo[2], symbol: token0[2]},
            //             token1: {id: poolInfo[3], symbol: token1[2]},
            //             reserve0: ethers.utils.formatUnits(poolInfo[4], token0[5]) ,
            //             reserve1: ethers.utils.formatUnits(poolInfo[4], token0[5]),
            //             totalSupply: poolInfo[7],
            //             reserveETH: "1",
            //             reserveUSD: "1000",
            //             trackedReserveETH: "1",
            //         }
            //         poolsArray.push(pool);
            //     }
            //     return response["recentPool"].map((data) => {
            //         return
            //     });
            // });

        if (!poolsResponse.ok) {
            throw new Error(`Failed to fetch pools with status code: ${poolsResponse.status}`);
        }

        const poolsInfo = await poolsResponse.json();
        let poolsArray : RawETHV2SubgraphPool[] =[] ;
        for (let i = 1; i < poolsInfo["recentPool"].length; i++) {
            const poolInfo = poolsInfo["recentPool"][i];
            const token0 = tokensMap.get(poolInfo[2]);
            const token1 = tokensMap.get(poolInfo[3]);
            if (!token0 || !token1) {
                console.log("unknown token0:", poolInfo[2], ",token1:", poolInfo[3])
                continue;
            }
            const pool :RawETHV2SubgraphPool = {
                id: poolInfo[1],
                token0: {id: poolInfo[2], symbol: token0[2]},
                token1: {id: poolInfo[3], symbol: token1[2]},
                reserve0: ethers.utils.formatUnits(poolInfo[4], token0[5]) ,
                reserve1: ethers.utils.formatUnits(poolInfo[5], token1[5]),
                totalSupply: poolInfo[7],
                reserveETH: "1",
                reserveUSD: "1000",
                trackedReserveETH: "1",
            }
            poolsArray.push(pool);

            console.log("pool id:", pool.id);
            console.log("reserve0:", pool.reserve0);
            console.log("reserve1:", pool.reserve1);
        }

        return poolsArray;
    }
}