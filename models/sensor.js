'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Sensor = mongoose.model('Sensor', new Schema({
  description: String,
  name: String,
  unit: String,
  chart: Boolean,
  update_at: Date,
  created_at: Date
}));

module.exports = Sensor;