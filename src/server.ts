import { createServer, IncomingMessage, ServerResponse } from 'http';
import { BarterSwapDB, TableName } from './mongodb/client'
import { dexName } from './providers/utils/params';
const url = require('url')

const port = 9001;
const DB = new BarterSwapDB();

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    let http_url = request.url;
    let ok = url.parse(http_url, true);
    let pools = {
        pancakeswap: String,
        quickswap: String,
        sushiswap: String,
        uniswap_v2: String,
        uniswap_v3: String,
    }

    if (ok.path != '/favicon.ico') {
        try {
            let str: any = JSON.stringify(ok.query);
            str = JSON.parse(str);
            if (str.protocol == null) {
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.end("url error!");
            } else {
                let dex = str.protocol.split(',');
                let filter = {
                    name: { "$in": dex },
                }
                console.log("request:",filter)
                DB.findData(TableName.SimplePools, filter).then((ret: any) => {
                    let result = JSON.parse(ret)
                    for (let i = 0; i < dex.length; i++) {
                        try {
                            switch (result[i].name) {
                                case dexName.uniswap_v3:
                                    console.log(i, result[i].name)
                                    pools.uniswap_v3 = result[i].result.pools;
                                    break;
                                case dexName.uniswap_v2:
                                    console.log(i, result[i].name)
                                    pools.uniswap_v2 = result[i].result.pairs;
                                    break;
                                case dexName.sushiswap:
                                    console.log(i, result[i].name)
                                    pools.sushiswap = result[i].result.pairs;
                                    break;
                                case dexName.quickswap:
                                    console.log(i, result[i].name)
                                    pools.quickswap = result[i].result.pairs;
                                    break;
                                case dexName.pancakeswap:
                                    console.log(i, result[i].name)
                                    pools.pancakeswap = result[i].result.pairs;
                                    break;
                            }
                        } catch (err) {
                            console.log("error by returning db data,", err)
                        }
                    }
                    response.writeHead(200, { "Content-Type": "application/json" });
                    response.end(JSON.stringify(pools));
                }).catch((err) => {
                    console.log(err)
                    response.on('error', (err) => {
                        console.error(err);
                    });
                    response.writeHead(200, { "Content-Type": "text/plain" });
                    response.end("url error!");
                })
            }
        } catch (err) {
            console.log("fail to run server", err)
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("fail to run server");
        }
    }

});


server.listen(port);
console.log(`server is running ...`)