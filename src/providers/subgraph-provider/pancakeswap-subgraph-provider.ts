import { GraphQLClient } from 'graphql-request';
import { default as retry } from 'async-retry';
import { ChainId } from '../utils/chainId'
import { dexName } from '../utils/params'
import { SUBGRAPH_URL_BY_PANCAKESWAP } from '../utils/url'
import { ISubgraphProvider,RawBNBV2SubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryV2PoolGQL,quickQueryV2PoolGQL } from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'


export class PancakeSwapSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private DB = new BarterSwapDB();

    constructor(    
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_PANCAKESWAP[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
    }   

    async  getPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pairs: RawBNBV2SubgraphPool[];
                }>(queryV2PoolGQL(LiquidityMoreThan90Percent.PancakeSwap,'BNB')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.pancakeswap,
                        chainId :this.chainId,
                        result : res,
                    }
                    this.DB.deleteData(TableName.DetailedPools,{name: dexName.pancakeswap},true).then(()=>{this.DB.insertData(TableName.DetailedPools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.DetailedPools)})                    
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

    async  quickGetPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pairs: RawBNBV2SubgraphPool[];
                }>(quickQueryV2PoolGQL(LiquidityMoreThan90Percent.PancakeSwap,'BNB')).then((res)=>{
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.pancakeswap,
                        chainId :this.chainId,
                        result : res,
                    }
                    this.DB.deleteData(TableName.SimplePools,{name: dexName.pancakeswap},true).then(()=>{this.DB.insertData(TableName.SimplePools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.SimplePools)})                  
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
