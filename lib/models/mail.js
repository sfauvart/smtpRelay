'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var MailSchema = new Schema({
	dateReceived : Date,
	ipFrom : String,
	from : String,
	to : String,
	subject : String,
	message : String
});

/**
 * Validations
 */
 /*
ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');
*/

mongoose.model('Mail', MailSchema);
