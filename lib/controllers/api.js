'use strict';

var mongoose = require('mongoose'),
    Mail = mongoose.model('Mail');

/**
 * Get awesome mails
 */
exports.getMails = function(req, res) {
  return Mail.find(function (err, mails) {
    if (!err) {
      return res.json(mails);
    } else {
      return res.send(err);
    }
  });
};