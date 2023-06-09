import { GraphQLClient } from 'graphql-request';
import { ChainId } from '../utils/chainId'
import {ButterProtocol} from '../utils/params'
import { SUBGRAPH_URL_BY_SUSHISWAP } from '../utils/url'
import { ISubgraphProvider,RawETHV2SubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryV2PoolGQL,quickQueryV2PoolGQL } from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'
import {RedisClient} from "../../redis/client";
import {getSimplePoolRedisKey} from "../utils/misc";
const retry = require('async-retry');

export class SushiSwapSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private redis: RedisClient;

    constructor(    
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_SUSHISWAP[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
        this.redis = new RedisClient();
        this.redis.connect().then(r => {console.log("redis is connected")});
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

    async quickGetPools(){
        await retry(
            async () => {
                let start = Date.now();
                await this.client.request<{
                    pairs: RawETHV2SubgraphPool[];
                }>(quickQueryV2PoolGQL(LiquidityMoreThan90Percent.SushiSwap,'ETH')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: ButterProtocol.SUSHI_V2,
                        chainId :this.chainId,
                        result : res,
                    }
                    console.log("query sushiswap pools costs:", Date.now() - start);
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
}