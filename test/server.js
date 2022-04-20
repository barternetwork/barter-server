var http = require('http');
var url = require('url');

var hostname = "0.0.0.0"
var port = 9001

const server = http.createServer((req, res) => {
    let http_url = req.url;
	let ok = url.parse(http_url,true);
	if (ok.path != '/favicon.ico'){
		let str = JSON.stringify(ok.query);
        str = JSON.parse(str);
        if (str.protocol != null){
			let obj = str.protocol;
			let dex = obj.split('_');
			console.log(dex);
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("url ok!");
		}else{
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("url error!");
		} 
	}
})

server.listen(port, hostname, () => {
	console.log("server is running...")
})
