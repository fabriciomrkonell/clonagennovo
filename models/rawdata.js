'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RawData = mongoose.model('RawData', new Schema({
  name: String,
  datavalue: String,
  created_at: Date
}));

module.exports = RawData;