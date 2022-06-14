import { GraphQLClient } from 'graphql-request';
import { default as retry } from 'async-retry';
import { ChainId } from '../utils/chainId'
import { dexName } from '../utils/params'
import { SUBGRAPH_URL_BY_CURVE, API_URL_BY_CURVE } from '../utils/url'
import { ISubgraphProvider, RawCurveSubgraphPool } from '../utils/interfaces'
import { LiquidityMoreThan90Percent, queryCurvePoolGQL, quickQueryCurvePoolGQL } from '../utils/gql'
import { BarterSwapDB, TableName } from '../../mongodb/client'

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
                    this.DB.deleteData(TableName.DetailedPools, { name: dexName.curve }, true).then(() => { this.DB.insertData(TableName.DetailedPools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.DetailedPools) })
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
                    this.DB.deleteData(TableName.SimplePools, { name: dexName.curve }, true).then(() => { this.DB.insertData(TableName.SimplePools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.SimplePools) })
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
        await retry(
            async () => {
                axios.get(API_URL_BY_CURVE[this.chainId])
                    .then((res: any) => {
                        //console.log(res.data.data.poolData)
                        let tmp = JSON.stringify(res.data.data.poolData)
                        const ok = JSON.parse(tmp)
                        let array = []
                        let index = 0
                        for (let key in ok) {
                            if (ok[key].coins.length == 2) {
                                ok[key].coinsAddresses.length = 2
                                ok[key].decimals.length = 2
                                ok[key].underlyingDecimals.length = 2
                                array[index] = ok[key];
                                index++;
                            }else if (ok[key].coins.length == 3){
                                let copyCoinsAddresses = ok[key].coinsAddresses
                                let copyDecimals = ok[key].decimals
                                let copyUnderlyingDecimals = ok[key].underlyingDecimals
                                let copyCoins = ok[key].coins

                                let copy1 = ok[key]
                                copy1.coinsAddresses = [copyCoinsAddresses[0],copyCoinsAddresses[1]]
                                copy1.decimals = [copyDecimals[0],copyDecimals[1]]
                                copy1.underlyingDecimals = [copyUnderlyingDecimals[0],copyUnderlyingDecimals[1]]
                                copy1.coins = [copyCoins[0],copyCoins[1]]
                                array[index] = copy1 
                                index++

                                let copy2 = ok[key]
                                copy2.coinsAddresses = [copyCoinsAddresses[0],copyCoinsAddresses[2]]
                                copy2.decimals = [copyDecimals[0],copyDecimals[2]]
                                copy2.underlyingDecimals = [copyUnderlyingDecimals[0],copyUnderlyingDecimals[2]]
                                copy2.coins = [copyCoins[0],copyCoins[2]]
                                array[index] = copy2 
                                index++

                                let copy3 = ok[key]
                                copy3.coinsAddresses = [copyCoinsAddresses[1],copyCoinsAddresses[2]]
                                copy3.decimals = [copyDecimals[1],copyDecimals[2]]
                                copy3.underlyingDecimals = [copyUnderlyingDecimals[1],copyUnderlyingDecimals[2]]
                                copy3.coins = [copyCoins[1],copyCoins[2]]
                                array[index] = copy3 
                                index++
                            }else if (ok[key].coins.length == 4){
                                let copyCoinsAddresses = ok[key].coinsAddresses
                                let copyDecimals = ok[key].decimals
                                let copyUnderlyingDecimals = ok[key].underlyingDecimals
                                let copyCoins = ok[key].coins

                                let copy1 = ok[key]
                                copy1.coinsAddresses = [copyCoinsAddresses[0],copyCoinsAddresses[1]]
                                copy1.decimals = [copyDecimals[0],copyDecimals[1]]
                                copy1.underlyingDecimals = [copyUnderlyingDecimals[0],copyUnderlyingDecimals[1]]
                                copy1.coins = [copyCoins[0],copyCoins[1]]
                                array[index] = copy1 
                                index++

                                let copy2 = ok[key]
                                copy2.coinsAddresses = [copyCoinsAddresses[0],copyCoinsAddresses[2]]
                                copy2.decimals = [copyDecimals[0],copyDecimals[2]]
                                copy2.underlyingDecimals = [copyUnderlyingDecimals[0],copyUnderlyingDecimals[2]]
                                copy2.coins = [copyCoins[0],copyCoins[2]]
                                array[index] = copy2 
                                index++

                                let copy3 = ok[key]
                                copy3.coinsAddresses = [copyCoinsAddresses[1],copyCoinsAddresses[2]]
                                copy3.decimals = [copyDecimals[1],copyDecimals[2]]
                                copy3.underlyingDecimals = [copyUnderlyingDecimals[1],copyUnderlyingDecimals[2]]
                                copy3.coins = [copyCoins[1],copyCoins[2]]
                                array[index] = copy3 
                                index++

                                let copy4 = ok[key]
                                copy4.coinsAddresses = [copyCoinsAddresses[0],copyCoinsAddresses[3]]
                                copy4.decimals = [copyDecimals[0],copyDecimals[3]]
                                copy4.underlyingDecimals = [copyUnderlyingDecimals[0],copyUnderlyingDecimals[3]]
                                copy4.coins = [copyCoins[0],copyCoins[3]]
                                array[index] = copy4 
                                index++

                                let copy5 = ok[key]
                                copy5.coinsAddresses = [copyCoinsAddresses[1],copyCoinsAddresses[3]]
                                copy5.decimals = [copyDecimals[1],copyDecimals[3]]
                                copy5.underlyingDecimals = [copyUnderlyingDecimals[1],copyUnderlyingDecimals[3]]
                                copy5.coins = [copyCoins[1],copyCoins[3]]
                                array[index] = copy5 
                                index++

                                let copy6 = ok[key]
                                copy6.coinsAddresses = [copyCoinsAddresses[2],copyCoinsAddresses[3]]
                                copy6.decimals = [copyDecimals[2],copyDecimals[3]]
                                copy6.underlyingDecimals = [copyUnderlyingDecimals[2],copyUnderlyingDecimals[3]]
                                copy6.coins = [copyCoins[2],copyCoins[3]]
                                array[index] = copy6 
                                index++
                            }
                        }
                        let data = {
                            updateTime: Date.parse(new Date().toString()),
                            name: dexName.curve,
                            chainId: this.chainId,
                            result: array,
                        }
                        //console.log(array, data.result.length)
                        this.DB.deleteData(TableName.SimplePools, { name: dexName.curve }, true).then(() => { this.DB.insertData(TableName.SimplePools, data) }).catch(() => { console.log("fail to delete data,table name", TableName.SimplePools) })
                    })
                    .catch((err: any) => { console.log("cannot get data from api,err:", err) })
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
