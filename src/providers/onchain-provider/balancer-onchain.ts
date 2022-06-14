import { BalancerSDK, SubgraphPoolBase } from '@balancer-labs/sdk';
import { BarterSwapDB, TableName } from '../../mongodb/client'
import { dexName } from '../utils/params'
import { CHAIN_RPC } from '../utils/url'
import { ChainId } from '../utils/chainId'


export interface Pool extends SubgraphPoolBase {
    chainId: number;
    totalLiquidity:string;
  }

export async function queryBalancerSwapOnChain(name: dexName,chainId: ChainId) {
    const DB = new BarterSwapDB();
    let id:number= chainId
    let url:string = CHAIN_RPC[chainId]!
    const balancer = new BalancerSDK({
        network: id,
        rpcUrl: url,
    });

    await balancer.sor.fetchPools();
    const pools: Pool[] = balancer.sor.getPools()
    .map((pool:any) => {
        return Object.assign({}, pool,{chainId});
      });


    let data = pools.slice(0,15)
    let storageData = {
        updateTime: Date.parse(new Date().toString()),
        name: name,
        chainId: chainId,
        result: data,
    }
    await DB.deleteData(TableName.OnChainPools, { name: dexName }, true).then(()=>{DB.insertData(TableName.OnChainPools, storageData)}).catch(()=>{console.log("fail to delete data,table name",TableName.OnChainPools)})           
}

