'use strict';

var mongoose = require('mongoose'),
  Mail = mongoose.model('Mail');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Mail.find({}).remove(function() {
  Mail.create({
    dateReceived : '01/01/2014 10:00',
    ipFrom : '127.0.0.1',
    from : 'dummy@dummy.org',
    to : 'fake@dummy.org',
    subject : 'Dummy Subject email 1',
    message : 'Blablalblalbalb'
  }, {
    dateReceived : '01/01/2014 11:00',
    ipFrom : '127.0.0.1',
    from : 'dummy@dummy.org',
    to : 'fake@dummy.org',
    subject : 'Dummy Subject email 2',
    message : 'Blablalblalbalb'
  }, function() {
      console.log('finished populating mails');
    }
  );
});
