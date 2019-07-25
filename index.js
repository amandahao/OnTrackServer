var express = require('express')
	, path = require('path')
	, bodyParser = require('body-parser')
	, http = require('http')
	, async = require('async')
	, fs = require('fs')
	, mongoose = require('mongoose')
	, stream = require('stream')
	, cors = require('cors')
;

var app = express()
	, port = parseInt(process.env.PORT || '8080')
	, server = http.createServer(app)
;
