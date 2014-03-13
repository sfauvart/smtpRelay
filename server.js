'use strict';

var express = require('express'),
    path = require('path'),
    simplesmtp = require("simplesmtp"),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

var options = {
    debug: true,
    SMTPBanner: "My Server",
    requireAuthentication: false,
    ignoreTLS: true,
    validateSender: false,
    validateRecipients: false,
    disableDNSValidation:true
};

var smtp = simplesmtp.createServer(options, function(req){
    req.pipe(process.stdout);
    req.accept();
});
var Mail = mongoose.model('Mail');

smtp.listen(config.portSMTP, function (err) {
	if(!err){
		console.log('SMTP server listening on port %d in %s mode', config.portSMTP, app.get('env'));
    } else {
        console.log("Could not start server on port 25. Ports under 1000 require root privileges.");
        console.log(err.message);
    }  
});
/*
smtp.on("validateSender", function(envelope, email, callback){
	callback(email != "me@example.com"?new Error("Failed sender") : null);
});
*/
smtp.on("startData", function(connection){
    connection.saveDBObj = { 
    	from: connection.from,
    	to: connection.to,
    	ipFrom: connection.remoteAddress,
    	dateReceived: connection.date
    };
});

smtp.on("data", function(connection, chunk){
    connection.saveDBObj.message = chunk;
});

smtp.on("dataReady", function(connection, callback){
	Mail.create(connection.saveDBObj, function() {
	  console.log('Incoming message saved in mongodb');
	}
	);
    callback(null, "ABC1"); // ABC1 is the queue id to be advertised to the client
    // callback(new Error("Rejected as spam!")); // reported back to the client
});
