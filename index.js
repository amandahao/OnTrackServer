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
app.get('/wepoipoiepoipourpowasdlkjfalkjajiepururgkaowifnjkdjdjdjasdskjelifasdjkznkdjkfjliseghaslkdjlfkjeiznkdknsi', (req, res, next) => {
	datamodel
		.find({site: {$ne: null}})
		.sort({_id: -1})
		.select('site')
		.limit(100)
		.exec((err, alldata) => {
			if(err) return res.send("oops");
			var html = fs.readFileSync("dashboard.html", "utf8");
			var domainData = alldata.reduce((o, r) => {
			    var domainParts = r.site.split('/');
			     var domain = domainParts[2];
			    if(!o[domain]) o[domain] = 0;
			        o[domain]++;
			    return o;
			}, {})
			html = html.replace(`{domainData}`, Object.keys(domainData).map(d => `<div><span>${d}</span><span>${domainData[d]}</span></div>`).join(''));
			res.send(html);
		})
})

app.get('/analytics/populardomains/:customerid', (req, res, next) => {
	datamodel
		.find({site: {$ne: null}, id: req.params.customerid})
		.sort({_id: -1})
		.select('site time')
		.limit(100)
		.exec((err, alldata) => {
			if(err) return res.send("oops");
			var html = fs.readFileSync("analytics.html", "utf8");
			var domainData = alldata.reduce((o, r) => {
			    var domainParts = r.site.split('/');
			     var domain = domainParts[2];
			    if(!o[domain]) o[domain] = 0;
			        o[domain]++;
			    return o;
			}, {})
			html = html.replace(`{{DATA}}`, Object.keys(domainData).map(d => `<div><span>${d}</span><span>${domainData[d]}</span></div>`).join(''));
			res.send(html);
		})
})

app.get('/analytics/sitesblocked/:customerid', (req, res, next) => {
	datamodel
	.aggregate([
		{$match: {id:  {$ne: null } } }
		, {$project: {date: 1, id: 1} }
		, { $group:
				{_id : {
					month: { $month: "$date" }
					, day: { $dayOfMonth: "$date" }
					, year: { $year: "$date" }
					}
					, customers: {$addToSet: "$id" }
				}
		}
	])
		.find({site: {$ne: null}, id: req.params.customerid})
		.sort({_id: -1})
		.select('site time')
		.limit(100)
		.exec((err, alldata) => {
			if(err) return res.send("oops");
			var html = fs.readFileSync("analytics.html", "utf8");
			var domainData = alldata.reduce((o, r) => {
			    var domainParts = r.site.split('/');
			     var domain = domainParts[2];
			    if(!o[domain]) o[domain] = 0;
			        o[domain]++;
			    return o;
			}, {})
			html = html.replace(`{{DATA}}`, Object.keys(domainData).map(d => `<div><span>${d}</span><span>${domainData[d]}</span></div>`).join(''));
			res.send(html);
		})
})

app.get('/', (req, res, next) => {
	console.log('home');
	var geo = geoip.lookup(req.ip);
	var ua = parser(req.headers['user-agent']);
	var date = new Date();
	var site = req.query.site;
	var action = req.query.action;
	var id = req.query.id;
	var time = req.query.time;
	var sim = req.query.sim;
	var subject = req.query.subject;
	var loadsimtime = req.query.loadsimtime;
	var data = new datamodel({
		site: site
		, loadsimtime: loadsimtime || -1
		, sim: sim || -1
		, subject: subject
		, time: time || -1
		, action: action
		, id: id
		, date: date
		, ip: req.ip
		, range: geo.range
		, country: geo.country
		, region: geo.region
		, city: geo.city
		, ll: geo.ll
		, metro: geo.metro || -1
		, area: geo.area || -1
		, eu: geo.eu || -1
		, timezone: geo.timezone || -1
		, ua: ua.ua
		, browser: ua.browser
		, engine: ua.engine
		, device: ua.device
		, cpu: ua.cpu
	})
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
