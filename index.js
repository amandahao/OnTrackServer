var express = require('express')
	, path = require('path')
	, bodyParser = require('body-parser')
	, http = require('http')
	, async = require('async')
	, fs = require('fs')
	, mongoose = require('mongoose')
	, stream = require('stream')
	, cors = require('cors')
	, configs = require('./configs.js')
	, parser = require('ua-parser-js')
	, geoip = require('geoip-lite')
	, datamodel = require('./data.js').getModel()
;

var app = express()
	, port = parseInt(process.env.PORT || '8080')
	, server = http.createServer(app)
;

app.set('trust proxy', true);

app.get('/', (req, res, next) => {
	console.log('home');
	var geo = geoip.lookup(req.ip);
	var ua = parser(req.headers['user-agent']);
	var date = new Date();
	var site = req.query.site;
	var action = req.query.action;
	var id = req.query.id;
	console.log(req.ip);
	console.log(geo, ua);
	console.log(site, action, id);
	res.send("ok");
});

function startServer() {
	server.on('listening', () => {
		var addr = server.address()
			, bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port
		;
		console.log('Listening on ' + bind);
	});
	server.listen(port);
}

mongoose.connect(configs.dbUri, startServer);
