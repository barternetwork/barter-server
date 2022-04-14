var http = require('http')
var graphql = require('./graphql')
var mongodb = require('mongodb')

var hostname = "0.0.0.0"
var port = 3000

let url = "mongodb://localhost:27017";
let MongoClient = mongodb.MongoClient;
let pairs = [];

function UpdateData(){
    graphql.query(graphql.QuickSwap, true, 140).then(res => {
        for (var i = 0; i < 140; i++) {
            pairs[i] = res[i]
        }
        console.log("query number of pairs:", pairs.length)
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("BarterSwap");
            dbo.collection("QuickSwap").insertMany(pairs, function (err, res) {
                if (err) throw err;
                console.log("insert result:", res);
                db.close();
            });
        });
    }).catch(e => { console.log(e) });
    
    var server = http.createServer((req, res) => {
        const url = req.url;
        const path = url.split('?')[0];
        console.log('url is:', url);
        console.log('path is:', path);
    
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("BarterSwap");
            dbo.collection("QuickSwap").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain')
                res.end(result)
                db.close();
            });
        })
    });
    
    server.listen(port, hostname, () => {
        console.log("server is running...")
    })
}

UpdateData();



