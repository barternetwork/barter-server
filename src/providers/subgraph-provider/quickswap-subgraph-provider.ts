import { GraphQLClient } from 'graphql-request';
import { ChainId } from '../utils/chainId'
import {ButterProtocol} from '../utils/params'
import { SUBGRAPH_URL_BY_QUICKSWAP } from '../utils/url'
import { ISubgraphProvider,RawETHV2SubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryV2PoolGQL,quickQueryV2PoolGQL } from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'
import {RedisClient} from "../../redis/client";
import {getSimplePoolRedisKey} from "../utils/misc";
const retry = require('async-retry');
export class QuickSwapSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private redis: RedisClient;

    constructor(    
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_QUICKSWAP[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
        this.redis = new RedisClient();
        this.redis.connect();
    }   

    async getPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pairs: RawETHV2SubgraphPool[];
                }>(queryV2PoolGQL(LiquidityMoreThan90Percent.QuickSwap,'ETH')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: ButterProtocol.QUICK_V2,
                        chainId :this.chainId,
                        result : res,
                    }
                    // this.DB.deleteData(TableName.DetailedPools,{name: dexName.quickswap},true).then(()=>{this.DB.insertData(TableName.DetailedPools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.DetailedPools)})
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
                }>(quickQueryV2PoolGQL(LiquidityMoreThan90Percent.QuickSwap,'ETH')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: ButterProtocol.QUICK_V2,
                        chainId :this.chainId,
                        result : res,
                    }
                    console.log("query quick pools costs:", Date.now() - start);
                    console.log(data.result)
                    let key = getSimplePoolRedisKey(this.chainId, data.name)
                    this.redis.set(key, JSON.stringify(data))
                    // this.DB.deleteData(TableName.SimplePools,{name: dexName.quickswap,chainId: this.chainId},true).then(()=>{this.DB.insertData(TableName.SimplePools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.SimplePools)})
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