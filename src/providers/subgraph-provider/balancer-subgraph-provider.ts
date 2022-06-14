import { GraphQLClient } from 'graphql-request';
import { default as retry } from 'async-retry';
import { ChainId } from '../utils/chainId'
import { dexName } from '../utils/params'
import { SUBGRAPH_URL_BY_BALANCER } from '../utils/url'
import { ISubgraphProvider,RawBalancerSubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryBalancerPoolGQL,quickQueryBalancerPoolGQL } from '../utils/gql'
import { BarterSwapDB,TableName } from '../../mongodb/client'

export class BalancerSubgraphProvider implements ISubgraphProvider{
    private client: GraphQLClient;
    private DB = new BarterSwapDB();

    constructor(    
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ){
        let subgraphUrl = SUBGRAPH_URL_BY_BALANCER[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
          }
        this.client = new GraphQLClient(subgraphUrl);
    }   

    async getPools(){
        await retry(
            async () => {
                await this.client.request<{
                    pools: RawBalancerSubgraphPool[];
                }>(queryBalancerPoolGQL(LiquidityMoreThan90Percent.Balancer)).then((res)=>{
                    let tmp = JSON.stringify(res.pools)
                    const ok = JSON.parse(tmp)

                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.balancer,
                        chainId :this.chainId,
                        result : ok,
                    }
                    //console.log("res",res)
                    //console.log("len",res.pools.length,data.result.length)
                    this.DB.deleteData(TableName.DetailedPools,{name: dexName.balancer},true).then(()=>{this.DB.insertData(TableName.DetailedPools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.DetailedPools)})                     
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
                await this.client.request<{
                    pools: RawBalancerSubgraphPool[];
                }>(quickQueryBalancerPoolGQL(LiquidityMoreThan90Percent.Balancer)).then((res)=>{
                    let tmp = JSON.stringify(res.pools)
                    const ok = JSON.parse(tmp)
                    let array = []
                    let index = 0
                    for (let key in ok) {
                        if (ok[key].tokensList.length == 2) {
                            array[index] = ok[key];
                            index++;
                        }else if (ok[key].tokensList.length == 3){
                            let copyCoinsAddresses = ok[key].tokensList

                            let copy1 = ok[key]
                            copy1.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[1]]
                            array[index] = copy1 
                            index++

                            let copy2 = ok[key]
                            copy2.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[2]]
                            array[index] = copy2 
                            index++

                            let copy3 = ok[key]
                            copy3.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[2]]               
                            array[index] = copy3 
                            index++
                        }else if (ok[key].tokensList.length == 4){
                            let copyCoinsAddresses = ok[key].tokensList         

                            let copy1 = ok[key]
                            copy1.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[1]]
                            array[index] = copy1 
                            index++

                            let copy2 = ok[key]
                            copy2.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[2]]
                            array[index] = copy2 
                            index++

                            let copy3 = ok[key]
                            copy3.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[2]]
                            array[index] = copy3 
                            index++

                            let copy4 = ok[key]
                            copy4.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[3]]

                            array[index] = copy4 
                            index++

                            let copy5 = ok[key]
                            copy5.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[3]]
                            array[index] = copy5 
                            index++

                            let copy6 = ok[key]
                            copy6.tokensList = [copyCoinsAddresses[2],copyCoinsAddresses[3]]
                            array[index] = copy6 
                            index++
                        }else if (ok[key].tokensList.length == 5){
                            let copyCoinsAddresses = ok[key].tokensList         

                            let copy1 = ok[key]
                            copy1.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[1]]
                            array[index] = copy1 
                            index++

                            let copy2 = ok[key]
                            copy2.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[2]]
                            array[index] = copy2 
                            index++

                            let copy3 = ok[key]
                            copy3.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[2]]
                            array[index] = copy3 
                            index++

                            let copy4 = ok[key]
                            copy4.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[3]]
                            array[index] = copy4 
                            index++

                            let copy5 = ok[key]
                            copy5.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[3]]
                            array[index] = copy5 
                            index++

                            let copy6 = ok[key]
                            copy6.tokensList = [copyCoinsAddresses[2],copyCoinsAddresses[3]]
                            array[index] = copy6 
                            index++

                            let copy7 = ok[key]
                            copy7.tokensList = [copyCoinsAddresses[0],copyCoinsAddresses[4]]
                            array[index] = copy7 
                            index++

                            let copy8 = ok[key]
                            copy8.tokensList = [copyCoinsAddresses[1],copyCoinsAddresses[4]]
                            array[index] = copy8 
                            index++

                            let copy9 = ok[key]
                            copy9.tokensList = [copyCoinsAddresses[2],copyCoinsAddresses[4]]
                            array[index] = copy9 
                            index++

                            let copy10 = ok[key]
                            copy10.tokensList = [copyCoinsAddresses[3],copyCoinsAddresses[4]]
                            array[index] = copy10 
                            index++
                        }
                    }

                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.balancer,
                        chainId :this.chainId,
                        result : array,
                    }
                    //console.log("array",array)
                    //console.log("len",res.pools.length,array.length)
                    this.DB.deleteData(TableName.SimplePools,{name: dexName.balancer},true).then(()=>{this.DB.insertData(TableName.SimplePools,data)}).catch(()=>{console.log("fail to delete data,table name",TableName.SimplePools)})                     
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
let test = new BalancerSubgraphProvider(ChainId.POLYGON)
test.quickGetPools()