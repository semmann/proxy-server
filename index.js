var http = require('http')
var fs = require('fs')
var request = require('request')
var argv = require('yargs').argv

var scheme = 'http://'
var host = argv.host || 'localhost'
var port = argv.port || (host === 'localhost' ? 8000 : 80)
var destUrl = scheme + host + ':' + port
var logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout

var echoserver = http.createServer((req, res) => {
logStream.write('echoserver\n')
  for(var header in req.headers) {
    res.setHeader(header, req.headers[header])
  }
  logStream.write(JSON.stringify(req.headers )+ '\n')
  req.pipe(res)
}).listen(8000)

var proxyserver = http.createServer((req, res) => {
logStream.write('proxyserver\n')
logStream.write(JSON.stringify(req.headers) + '\n')
var toUrl = destUrl
if (req.headers['x-destination-url']) {
  toUrl = scheme + req.headers['x-destination-url']
}

  var options = {
    url : toUrl + req.url
  }

  req.pipe(request(options)).pipe(res)
}).listen(8001)
