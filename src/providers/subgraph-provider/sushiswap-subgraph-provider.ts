import { GraphQLClient } from 'graphql-request';
import { ChainId } from '../utils/chainId'
import {ButterProtocol} from '../utils/params'
import { SUBGRAPH_URL_BY_SUSHISWAP } from '../utils/url'
import { ISubgraphProvider,RawETHV2SubgraphPool } from '../utils/interfaces'
import {LiquidityMoreThan90Percent, PageSize, queryV2PoolGQL, quickQueryV2PoolGQL} from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'
import {RedisClient} from "../../redis/client";
import {getSimplePoolRedisKey} from "../utils/misc";
const retry = require('async-retry');

export class SushiSwapSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private redis: RedisClient;

    constructor(    
        private chainId: ChainId,
        private redisClient: RedisClient,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_SUSHISWAP[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
        this.redis = redisClient;
    }   

    async getPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pairs: RawETHV2SubgraphPool[];
                }>(queryV2PoolGQL(LiquidityMoreThan90Percent.SushiSwap,'ETH')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: ButterProtocol.SUSHI_V2,
                        chainId :this.chainId,
                        result : res,
                    }
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
                    const {pairs: poolsAtCurrentPage} = await this.client.request<{
                        pairs: RawETHV2SubgraphPool[];
                    }>(quickQueryV2PoolGQL(PageSize, 'ETH', skip));
                    pools = [...pools, ...poolsAtCurrentPage]
                    skip += PageSize
                    if (pools.length >= LiquidityMoreThan90Percent.SushiSwap || poolsAtCurrentPage.length < PageSize) {
                        break
                    }
                }
                let data = {
                    updateTime: Date.parse(new Date().toString()),
                    name: ButterProtocol.SUSHI_V2,
                    chainId: this.chainId,
                    result: pools,
                }
                console.log(`query ${pools.length} sushiswap v2 pools on chain ${this.chainId} costs:`, Date.now() - start);
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