import curve from "@curvefi/api";
import { BarterSwapDB, TableName } from '../../mongodb/client'
import { dexName } from '../utils/params'
import { CHAIN_RPC } from '../utils/url'
import { ChainId } from '../utils/chainId'


export async function queryCurveOnChain(name: dexName,chainId: ChainId) {
    // 2. Infura
    curve.init("Infura", { network: 137, apiKey: "8cce6b470ad44fb5a3621aa34243647f" }, { chainId: chainId });
    
    // Fetch factory pools
    await curve.fetchFactoryPools();
    await curve.getCryptoFactoryPoolList();
    
    let pools = curve.getPoolList();

    type poolStruct = {
        id : String|null,
        name : String|null,
        fullName : String|null,
        symbol : String|null,
        referenceAsset : String|null,
        address : String|null,
        lpToken : String|null,
        gauge : String|null,
        zap : String|null,
        rewardContract : String|null,
        isPlain : boolean|null,
        isLending : boolean|null,
        isMeta : boolean|null,
        isCrypto : boolean|null,
        isFake : boolean|null,
        isFactory : boolean|null,
        basePool : String|null,
        underlyingCoins : String[]|null,
        wrappedCoins : String[]|null,
        underlyingCoinAddresses : String[]|null,
        wrappedCoinAddresses : String[]|null,
        underlyingDecimals : Number[]|null,
        wrappedDecimals : Number[]|null,
        useLending : boolean[]|null,
        rewardTokens : String[]|null,
    }
    let newPools:poolStruct[] = []

    for(let i=0;i<pools.length;i++){
        let pool = await curve.getPool(pools[i])
        let newPool:poolStruct = {
        id : pool.id,
        name : pool.name,
        fullName: pool.fullName,
        symbol : pool.symbol,
        referenceAsset : pool.referenceAsset,
        address : pool.address,
        lpToken : pool.lpToken,
        gauge : pool.gauge,
        zap : pool.zap,
        rewardContract : pool.rewardContract,
        isPlain : pool.isPlain,
        isLending : pool.isLending,
        isMeta : pool.isMeta,
        isCrypto : pool.isCrypto,
        isFake : pool.isFake,
        isFactory : pool.isFactory,
        basePool : pool.basePool,
        underlyingCoins : pool.underlyingCoins,
        wrappedCoins : pool.wrappedCoins,
        underlyingCoinAddresses : pool.underlyingCoinAddresses,
        wrappedCoinAddresses : pool.wrappedCoinAddresses,
        underlyingDecimals : pool.underlyingDecimals,
        wrappedDecimals : pool.wrappedDecimals,
        useLending : pool.useLending,
        rewardTokens : pool.rewardTokens,
        };
        newPools[i] = newPool;
    }

    let storageData = {
        updateTime: Date.parse(new Date().toString()),
        name: name,
        chainId: chainId,
        result: newPools,
    }
    const DB = new BarterSwapDB()
    await DB.deleteData(TableName.OnChainPools, { name: dexName }, true).then(()=>{DB.insertData(TableName.OnChainPools, storageData)}).catch(()=>{console.log("fail to delete data,table name",TableName.OnChainPools)})           
}

