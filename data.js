var mongoose = require('mongoose');

var model = mongoose.model('data', new mongoose.Schema({
	site: {type: String}
	, action: {type: String}
	, id: {type: String}
	, date: {type: Date}
	, ip: {type: String}
	, range: {}
	, country: {type: String}
	, region: {type: String}
	, city: {type: String}
	, ll: {}
	, metro: {type: Number}
	, area: {type: Number}
	, eu: {type: Number}
	, timezone: {type: String}
	, ua: {type: String}
	, browser: {
		name: {type: String}
		, version: {type: String}
		, major: {type: Number}
	}
	, engine: {
		name: {type: String}
		, version: {type: String}
	}
	, os: {
		name: {type: String}
		, version: {type: String}
	}
	, device: {
		vender: {type: String}
		, model: {type: String}
		, type: {type: String}
	}
	, cpu: {
		architecture: {type: String}
	}
}));

exports.getModel = function() {
	return model;
}
