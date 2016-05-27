'use strict';

var express = require('express'),
		router = express.Router();

router.get('/', function(req, res, next) {
 res.sendfile('./view/index.html');
});

router.get('/configuration', function(req, res, next) {
 res.sendfile('./view/configuration.html');
});

module.exports = router;