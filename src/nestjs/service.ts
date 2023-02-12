import { BarterSwapDB, TableName } from '../mongodb/client'
import { Injectable } from '@nestjs/common';
import { dexName } from '../providers/utils/params';
import {RedisClient} from "../redis/client";
import {getSimplePoolRedisKey} from "../providers/utils/misc";

const redis = new RedisClient();
redis.connect()

@Injectable()
export class AppService {

  async getPools(dex: string[],chainId:number):Promise<string> {
    let pools = {
      updateTime:String,
      pancakeswap: String,
      quickswap: String,
      sushiswap: String,
      uniswap_v2: String,
      uniswap_v3: String,
      curve: String,
      balancer: String,
      hiveswap: String
    }
    let filter = {
      name: { "$in": dex },
      chainId: Number(chainId),
    }

    for (let i = 0; i < dex.length; i++) {
      let key = getSimplePoolRedisKey(chainId, dex[i])
      let ret = await redis.get(key);
      if (ret == null) {
        continue
      }
      let result = JSON.parse(ret);

      try {
        switch (result.name) {
          case dexName.uniswap_v3:
            pools.updateTime = result.updateTime
            pools.uniswap_v3 = result.result.pools
            break;
          case dexName.uniswap_v2:
            pools.updateTime = result.updateTime
            pools.uniswap_v2 = result.result.pairs
            break;
          case dexName.sushiswap:
            pools.updateTime = result.updateTime
            pools.sushiswap = result.result.pairs
            break;
          case dexName.quickswap:
            pools.updateTime = result.updateTime
            pools.quickswap = result.result.pairs
            break;
          case dexName.pancakeswap:
            pools.updateTime = result.updateTime
            pools.pancakeswap = result.result.pairs
            break;
          case dexName.curve:
            pools.updateTime = result.updateTime
            pools.curve = result.result
            break;
          case dexName.balancer:
            pools.updateTime = result.updateTime
            pools.balancer = result.result
            break;
          case dexName.hiveswap:
            pools.updateTime = result.updateTime
            pools.hiveswap = result.result;
            break;
        }
      } catch (err) {
        console.log("error by returning redis data,", err)
      }
    }

    return JSON.stringify(pools);
  }
}
