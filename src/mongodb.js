var url = "mongodb://localhost:27017";
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function (err, db) {
	if (err) throw err;
	console.log("Connected to MongoDB!");
	db.close();
});

var pair1 = { "_id": "625806e74f8caecbc9bedc67", "id": "0xedcb666e2279e02855cf3e28e8ccbfb9803e088f", "token0": { "id": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "symbol": "WMATIC" }, "token1": { "id": "0xf3f3065910a65f7c7a7cbd04871b5bef27c53e56", "symbol": "DISNEY" }, "totalSupply": "1732.050807568877292527", "reserveETH": "48706742942.30950104510364955938377", "trackedReserveETH": "0.000000003848391839686172562452299042268264" }
var pair2 = { "_id": "625806e74f8caecbc9bedc68", "id": "0x75c8bf6df135e37dff6488cba47845d28908d4e4", "token0": { "id": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "symbol": "WMATIC" }, "token1": { "id": "0x836b66bd36f0ce1b3d6f788b0675ef2913ba9b0e", "symbol": "Alpha Centauri" }, "totalSupply": "1732.050807568877292527", "reserveETH": "47351509390.91411439851315844929824", "trackedReserveETH": "0.000000003896011164819555578531712567774981" }
async function dataOperate() {
	var conn = null;
	try {
		conn = await MongoClient.connect(url);
		console.log("connecting...");
		const test = conn.db("BarterSwap").collection("Test");
		//add
		await test.insertOne(pair1);
		// find
		var arr1 = await test.find().toArray();
		console.log("pair1", arr1);
		// delete
		await test.deleteMany();
		// add
		await test.insertOne(pair2);
		// find
		var arr2 = await test.find().toArray();
		console.log("pair2", arr2);
	} catch (err) {
		console.log("error:" + err.message);
	} finally {
		if (conn != null) conn.close();
	}
}

async function dataOperate2() {
	var conn = null;
	try {
		conn = await MongoClient.connect(url);
		console.log("connecting...");
		const test = conn.db("BarterSwap").collection("Test");
		//add
		await test.insertOne(pair1);
		// find
		var arr1 = await test.find().toArray();
		console.log("pair1", arr1);
		// delete
		await test.deleteMany();
		// add
		await test.insertOne(pair2);
		// find
		var arr2 = await test.find().toArray();
		console.log("pair2", arr2);
	} catch (err) {
		console.log("error:" + err.message);
	} finally {
		if (conn != null) conn.close();
	}
}


dataOperate();
dataOperate2();
