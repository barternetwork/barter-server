import { gql, GraphQLClient } from 'graphql-request';

export const QuickSwap = new GraphQLClient('https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06');
export const SushiSwap = new GraphQLClient('https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange');
export const PancakeSwap = new GraphQLClient('https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2');
export const ApeSwap = new GraphQLClient('https://api.thegraph.com/subgraphs/name/hhassan01/apeswap-subgraph');

type RawV2SubgraphPool = {
    id: string;
    token0: {
        id: string;
        symbol: string;
    };
    token1: {
        id: string;
        symbol: string;
    };
    totalSupply: string;
    reserveETH: string;
    trackedReserveETH: string;
};


export async function query(client: GraphQLClient, isPolygon: boolean,first:number): Promise<RawV2SubgraphPool[]> {
    let query;
    if (isPolygon == true) {
        query = gql`
        {
        pairs(first: ${first},orderBy: reserveUSD, orderDirection: desc) {
        id
        token0 {
        id     
        symbol
        }
        token1 {
        id     
        symbol
        }
        totalSupply
        reserveETH
        trackedReserveETH
        }
        }
        `;;
    } else {
        query = gql`
        {
        pairs(first: ${first},orderBy: reserveUSD, orderDirection: desc) {
        id
        token0 {
        id
        symbol
        }
        token1 {
        id
        symbol
        }
        totalSupply
        reserveBNB
        trackedReserveBNB
        }
        }
        `;
    }
    let pairs: RawV2SubgraphPool[] = [];
    const poolsResult = await client.request<{
        pairs: RawV2SubgraphPool[];
    }>(query);
    pairs = pairs.concat(poolsResult.pairs);
    console.log("receive query entries:", pairs.length)
    return pairs;
}

