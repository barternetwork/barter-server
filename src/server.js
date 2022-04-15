const http = require('http')

const hostname = "0.0.0.0"
const port = 3000

var pair = {
	id:"11",
	total:100
}
var pairs = [pair,pair]

const server = http.createServer((req, res) => {
	const url = req.url;
	const path = url.split('/')[1];
	console.log('path is:', path);
	switch (path) {
        case "quickswap":
			console.log(0)
			res.writeHead(200,{"Content-Type":"application/json"});
			res.end(JSON.stringify(pairs));
	}
})

server.listen(port, hostname, () => {
	console.log("server is running...")
})