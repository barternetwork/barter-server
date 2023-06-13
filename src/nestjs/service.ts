import {Injectable} from '@nestjs/common';
import {ButterProtocol} from '../providers/utils/params';
import {RedisClient} from "../redis/client";
import {getSimplePoolRedisKey} from "../providers/utils/misc";

const redis = new RedisClient();
redis.connect()

@Injectable()
export class AppService {

    async getPools(protocols: string[], chainId: number): Promise<string> {
        let poolsMap = new Map();

        console.log("protocols", protocols)

        for (let i = 0; i < protocols.length; i++) {
            let key = getSimplePoolRedisKey(chainId, protocols[i])
            let ret = await redis.get(key);
            if (ret == null) {
                continue
            }
            let result = JSON.parse(ret);

            poolsMap.set("updateTime", result.updateTime)

            try {
                switch (result.name) {
                    case ButterProtocol.UNI_V3:
                    case ButterProtocol.PANCAKE_V3:
                        poolsMap.set(result.name, result.result.pools)
                        break;
                    case ButterProtocol.UNI_V2:
                    case ButterProtocol.SUSHI_V2:
                    case ButterProtocol.QUICK_V2 :
                    case ButterProtocol.PANCAKE_V2:
                        poolsMap.set(result.name, result.result.pairs)
                        break;
                    default:
                        poolsMap.set(result.name, result.result)
                        break;
                }
            } catch (err) {
                console.log("error by returning redis data,", err)
            }
        }

        const poolsObj = Object.fromEntries(poolsMap);

        return JSON.stringify(poolsObj);
    }
}
