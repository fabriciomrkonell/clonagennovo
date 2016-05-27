'use strict';

var express = require('express'),
		router = express.Router(),
		Sensor = require('../models/sensor');

router.get('/', function(req, res, next) {
	Sensor.find().exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Sensor: error.', data: err });
  	res.send({ error: false, message: 'Sensor: success.', data: data });
  });
});

router.post('/', function(req, res, next) {
	var sensor = new Sensor();
	sensor.description = req.body.description;
  sensor.name = req.body.name;
  sensor.unit = req.body.unit;
  sensor.chart = req.body.chart;
  sensor.update_at = new Date;
  sensor.created_at = new Date;
  sensor.save(function(err, data) {
	  if (err) throw console.log({ error: true, message: 'Sensor: error.', data: err });
	  res.send({ error: false, message: 'Sensor: success.', data: data });
	});
});

router.post('/update', function(req, res, next) {
  Sensor.findById(req.body._id, function(err, sensor) {
    if(sensor === null){
      throw console.log({ error: true, message: 'Sensor: error.', data: err });
    }
    sensor.description = req.body.description;
    sensor.name = req.body.name;
    sensor.unit = req.body.unit;
    sensor.chart = req.body.chart;
    sensor.update_at = new Date;
    sensor.save(function(err, data) {
      res.send({ error: false, message: 'Sensor: success.', data: data });
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Sensor.remove({
    _id: req.param('id')
  }, function(err, data) {
    if (err) throw console.log({ error: true, message: 'Sensor: error.', data: err });
    res.send({ error: false, message: 'Sensor: success.', data: data });
  });
});

module.exports = router;