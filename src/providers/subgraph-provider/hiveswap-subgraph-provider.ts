import { GraphQLClient } from 'graphql-request';
// /import { default as retry } from 'async-retry';
import { ChainId } from '../utils/chainId'
import { dexName } from '../utils/params'
import { SUBGRAPH_URL_BY_HIVESWAP } from '../utils/url'
import { ISubgraphProvider,RawETHV2SubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryV2PoolGQL,quickQueryV2PoolGQL } from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'
import {getSimplePoolRedisKey} from "../utils/misc";
import {RedisClient} from "../../redis/client";
const retry = require('async-retry');
export class HiveSwapSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private redis: RedisClient;
    
    constructor(    
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_HIVESWAP[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
        this.redis = new RedisClient();
        this.redis.connect();
    }   

    async getPools(){
        // await retry(
        //     async () => {
        //         await this.client.request<{
        //             pairs: RawETHV2SubgraphPool[];
        //         }>(queryV2PoolGQL(LiquidityMoreThan90Percent.UniSwap_V2,'ETH')).then((res)=>{
        //             let data = {
        //                 updateTime: Date.parse(new Date().toString()),
        //                 name: dexName.uniswap_v2,
        //                 chainId :this.chainId,
        //                 result : res,
        //             }
        //             this.DB.deleteData(TableName.DetailedPools,{name: dexName.uniswap_v2,chainId: this.chainId},true).then(()=>{this.DB.insertData(TableName.DetailedPools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.DetailedPools)})                      
        //         });
        //     },      
        //     {
        //         retries: this.retries,       
        //         maxTimeout: this.maxTimeout,
        //         onRetry: (err, retry) => {
        //             console.log("error message:",err,",retry times:",retry)
        //         },
        //     }
        // );

    }

    async quickGetPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pairs: RawETHV2SubgraphPool[];
                }>(quickQueryV2PoolGQL(LiquidityMoreThan90Percent.hiveswap,'ETH')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.hiveswap,
                        chainId :this.chainId,
                        result : res.pairs,
                    }
                    console.log(data)
                    let key = getSimplePoolRedisKey(this.chainId, dexName.hiveswap)
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