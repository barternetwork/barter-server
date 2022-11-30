import { GraphQLClient } from 'graphql-request';
//import { default as retry } from 'async-retry';
import { ChainId } from '../utils/chainId'
import { dexName } from '../utils/params'
import { SUBGRAPH_URL_BY_CURVE, API_URL_BY_CURVE } from '../utils/url'
import { ISubgraphProvider, RawCurveSubgraphPool, RawETHV2SubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryCurvePoolGQL, quickQueryCurvePoolGQL } from '../utils/gql'
import { BarterSwapDB, TableName } from '../../mongodb/client'
const retry = require('async-retry');
const axios = require('axios');

export class CurveSubgraphProvider implements ISubgraphProvider {
    private client: GraphQLClient;
    private DB = new BarterSwapDB();

    constructor(
        private chainId: ChainId,
        private retries = 2,     //The maximum amount of times to retry the operation.
        private maxTimeout = 5000,  //The maximum number of milliseconds between two retries.
    ) {
        let subgraphUrl = SUBGRAPH_URL_BY_CURVE[this.chainId]
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new GraphQLClient(subgraphUrl);
    }

    async getPools() {
        await retry(
            async () => {
                await this.client.request<{
                    pools: RawCurveSubgraphPool[];
                }>(queryCurvePoolGQL(LiquidityMoreThan90Percent.Curve)).then((res) => {
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.curve,
                        chainId: this.chainId,
                        result: res,
                    }
                    this.DB.deleteData(TableName.DetailedPools, { name: dexName.curve, chainId: this.chainId }, true).then(() => { this.DB.insertData(TableName.DetailedPools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.DetailedPools) })
                });
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

    async quickGetPools() {
        await retry(
            async () => {
                await this.client.request<{
                    pools: RawCurveSubgraphPool[];
                }>(quickQueryCurvePoolGQL(LiquidityMoreThan90Percent.Curve)).then((res) => {
                    let data = {
                        updateTime: Date.parse(new Date().toString()),
                        name: dexName.curve,
                        chainId: this.chainId,
                        result: res,
                    }
                    this.DB.deleteData(TableName.SimplePools, { name: dexName.curve, chainId: this.chainId }, true).then(() => { this.DB.insertData(TableName.SimplePools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.SimplePools) })
                });
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

    async getPoolsByApi() {
        let array = []
        let index = 0
        let start = 0
        for (let i = 0; i < API_URL_BY_CURVE[this.chainId].length; i++) {
            await retry(
                async () => {
                    axios.get(API_URL_BY_CURVE[this.chainId][i])
                        .then((res: any) => {
                            //console.log(i,res.data.data.poolData)
                            let tmp = JSON.stringify(res.data.data.poolData)
                            const ok = JSON.parse(tmp)
                            let newFormat = { id: null, token0: { id: null, decimals: null }, token1: { id: null, decimals: null }, totalSupply: null, usdTotal: null }
                            for (let key in ok) {
                                if (ok[key].coins.length == 2) {
                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++;
                                } else if (ok[key].coins.length == 3) {
                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[2].address, decimals: ok[key].coins[2].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[2].address, decimals: ok[key].coins[2].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++
                                } else if (ok[key].coins.length == 4) {
                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[2].address, decimals: ok[key].coins[2].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[2].address, decimals: ok[key].coins[2].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[0].address, decimals: ok[key].coins[0].decimals }, token1: { id: ok[key].coins[3].address, decimals: ok[key].coins[3].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[3].address, decimals: ok[key].coins[3].decimals }, token1: { id: ok[key].coins[2].address, decimals: ok[key].coins[2].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++

                                    newFormat = { id: ok[key].address, token0: { id: ok[key].coins[3].address, decimals: ok[key].coins[3].decimals }, token1: { id: ok[key].coins[1].address, decimals: ok[key].coins[1].decimals }, totalSupply: ok[key].totalSupply, usdTotal: ok[key].usdTotal }
                                    array[index] = newFormat
                                    index++
                                } else if(ok[key].name == ''|| ok[key].name == ''){
                                    console.log("there is a pool that has 5 token.")
                                }
                            }
                            start++
                            if (start == API_URL_BY_CURVE[this.chainId].length){
                                let data = {
                                    updateTime: Date.parse(new Date().toString()),
                                    name: dexName.curve,
                                    chainId: this.chainId,
                                    result: array,
                                }
                                //console.log(this.chainId,API_URL_BY_CURVE[this.chainId],API_URL_BY_CURVE[this.chainId].length, data)
                                this.DB.deleteData(TableName.SimplePools, {name: dexName.curve,chainId: this.chainId}, true).then(() => { this.DB.insertData(TableName.SimplePools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.SimplePools) })          
                            }
                        }).catch((err: any) => { console.log("cannot get data from api,err:", err) })
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

}