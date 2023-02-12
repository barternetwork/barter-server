import {createClient, RedisClientType} from 'redis';
import RedisConfig from './config'

export enum TableName {
    DetailedPools = 'DetailedPools',
    SimplePools = 'SimplePools',
    OnChainPools = 'OnChainPools',
    ApiPools = 'ApiPools',
}

export class RedisClient {
    private client: RedisClientType

    constructor(
        url = RedisConfig.url,
    ) {
        this.client = createClient({url})
        this.client.on('error', err => console.log('Redis Client Error', err));
    }

    async connect() {
        await this.client.connect()
    }

    async set(key: string, value: string) {
        await this.client.set(key, value)
            .catch((err) => {
                console.log("fail to set to redis,error:", err);
            })
    }

    async get(key: string): Promise<string> {
        return new Promise((res, rej) => {
            this.client.get(key)
                .then(data => res(data))
                .catch(err => {
                    console.log("fail to get from redis, error:", err);
                    rej(err)
                })
        })
    }

    async disconnect() {
        await this.client.disconnect().catch((err) => {
            console.log("fail to disconnect from redis, error:", err);
        })
    }

    // async deleteData<Document>(collectionName: string, filter: Filter<Document>, many = false) {
    //     await this.connectDB().then((client) => {
    //         let collection = client.db(this.dbName).collection(collectionName)
    //         if (many) {
    //             collection.deleteMany(filter)
    //                 .catch((err) => {
    //                     console.log("fail to delete many data,error:", err)
    //                 })
    //                 .finally(() => {
    //                     client.close()
    //                 })
    //         } else {
    //             collection.deleteOne(filter)
    //                 .catch((err) => {
    //                     console.log("fail to delete a data,error:", err)
    //                 })
    //                 .finally(() => {
    //                     client.close()
    //                 })
    //         }
    //     }).catch((err) => {
    //         console.log("fail to connect mongoDB,error:", err);
    //     })
    // }
    //
    // async updateData<Document>(collectionName: string, filter: Filter<Document>, updateFilter: Filter<Document>, many = false) {
    //     await this.connectDB().then((client) => {
    //         let collection = client.db(this.dbName).collection(collectionName)
    //         if (many) {
    //             collection.updateMany(filter, {$set: updateFilter}, {upsert: true})
    //                 .catch((err) => {
    //                     console.log("fail to update many data,error:", err)
    //                 })
    //                 .finally(() => {
    //                     client.close()
    //                 })
    //         } else {
    //             collection.updateOne(filter, {$set: updateFilter}, {upsert: true})
    //                 .catch((err) => {
    //                     console.log("fail to update a data,error:", err)
    //                 })
    //                 .finally(() => {
    //                     client.close()
    //                 })
    //         }
    //     }).catch((err) => {
    //         console.log("fail to connect mongoDB,error:", err);
    //     })
    // }

}
