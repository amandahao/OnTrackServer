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
	, corsOptions = {
      origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
;

app.set('trust proxy', true);

app.use(cors(corsOptions));
app.get('/', (req, res, next) => {
	console.log('home');
	var geo = geoip.lookup(req.ip);
	var ua = parser(req.headers['user-agent']);
	var date = new Date();
	var site = req.query.site;
	var action = req.query.action;
	var id = req.query.id;
	var time = req.query.time;
	var data = new datamodel({
		site: site
		, time: time
		, action: action
		, id: id
		, date: date
		, ip: req.ip
		, range: geo.range
		, country: geo.country
		, region: geo.region
		, city: geo.city
		, ll: geo.ll
		, metro: geo.metro
		, area: geo.area
		, eu: geo.eu
		, timezone: geo.timezone
		, ua: ua.ua
		, browser: ua.browser
		, engine: ua.engine
		, device: ua.device
		, cpu: ua.cpu
	})
	console.log(req.ip);
	console.log(geo, ua);
	console.log(site, action, id);
	data.save();
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
