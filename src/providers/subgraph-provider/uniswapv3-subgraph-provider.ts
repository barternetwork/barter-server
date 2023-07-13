import { GraphQLClient } from 'graphql-request';
import { ChainId } from '../utils/chainId'
import {ButterProtocol} from '../utils/params'
import { SUBGRAPH_URL_BY_UNISWAP_V3 } from '../utils/url'
import {ISubgraphProvider, RawBNBV3SubgraphPool, RawETHV3SubgraphPool} from '../utils/interfaces'
import {
    LiquidityMoreThan90Percent,
    PageSize,
    queryV3PoolGQL,
    quickQueryV3PoolGQL
} from '../utils/gql'
import {RedisClient} from "../../redis/client";
import {getSimplePoolRedisKey} from "../utils/misc";
const retry = require('async-retry');
export class UniSwapV3SubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private redis: RedisClient;

    constructor(    
        private chainId: ChainId,
        private redisClient: RedisClient,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_UNISWAP_V3[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new GraphQLClient(subgraphUrl);
        this.redis = redisClient;
    }   

    async getPools(){
        await retry(
            async () => {
                let start = Date.now();
                await this.client.request<{
                    pools: RawETHV3SubgraphPool[];
                }>(queryV3PoolGQL(LiquidityMoreThan90Percent.UniSwap_V3)).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: ButterProtocol.UNI_V3,
                        chainId :this.chainId,
                        result : res,
                    }
                    console.log("query uniswap v3 pools costs:", Date.now() - start);
                    console.log(data.result);
                    let key = getSimplePoolRedisKey(this.chainId, data.name)
                    this.redis.set(key, JSON.stringify(data))
                });
            },      
            {
                retries: this.retries,       
                maxTimeout: this.maxTimeout,
                onRetry: (err, retry) => {
                    console.log("error message:",err,",retry times:",retry)
                },
            }
        );

    }

    async quickGetPools() {
        await retry(
            async () => {
                let start = Date.now();
                let pools = []
                let skip = 0;
                while (true) {
                    const {pools: poolsAtCurrentPage} = await this.client.request<{
                        pools: RawETHV3SubgraphPool[];
                    }>(quickQueryV3PoolGQL(PageSize, skip));
                    pools = [...pools, ...poolsAtCurrentPage]
                    skip += PageSize
                    if (pools.length >= LiquidityMoreThan90Percent.UniSwap_V3 || poolsAtCurrentPage.length < PageSize) {
                        break
                    }
                }
                let data = {
                    updateTime: Date.parse(new Date().toString()),
                    name: ButterProtocol.UNI_V3,
                    chainId: this.chainId,
                    result: pools,
                }
                console.log(`query ${pools.length} uniswap v3 pools on chain ${this.chainId} costs:`, Date.now() - start);
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
}