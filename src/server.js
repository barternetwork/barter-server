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
	const path = url.split('?')[0];
	console.log('url is:', url);
	console.log('path is:', path);
    res.writeHead(200,{"Content-Type":"application/json"});
    res.end(JSON.stringify(pairs));
})

server.listen(port, hostname, () => {
	console.log("server is running...")
})