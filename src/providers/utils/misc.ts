import {ChainId} from "./chainId";

export function getSimplePoolRedisKey(chainId: ChainId, dex: string): string {
    return `simple-${chainId}-${dex}`;
}