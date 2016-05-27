'use strict';

var express = require('express'),
    path = require('path'),
    routes_index = require('./routes/index'),
    routes_sensor = require('./routes/sensor'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    bodyParser = require('body-parser'),
    RawData = require('./models/rawdata');

mongoose.connect('mongodb://localhost/clonagen');

db.on('error', function(){
  console.log('Database: error.');
}).once('open', function() {
  console.log('Database: success.');
});

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/')));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes_index);
app.use('/sensor', routes_sensor);

app.get('/rawdata-persist', function(req, res, next) {
  var itens = req.query;
  for(var key in itens){
    persit(key, itens[key]);
  }
  res.send({ error: false, message: 'RawData: success.' });
});

function persit(name, datavalue){
  var rawdata = new RawData();
  rawdata.name = name,
  rawdata.datavalue = datavalue,
  rawdata.created_at = new Date;
  rawdata.save(function(err, data) {
    if (err) throw console.log({ error: true, message: 'RawData: error.', data: err });
    io.sockets.emit('news-rawdata', data);
  });
}

io.on('connection', function(socket) {
  socket.on('rawdata', function(name) {
    RawData.findOne({
      name: name
    }).exec(function(err, data){
      if(data){
        io.sockets.emit('news-rawdata', data);
      }
    });
  });
  socket.on('rawdata-chart', function(name) {
    RawData.find({
      name: name
    }).sort([['created_at', 'desc']]).exec(function(err, data){
      var exit = [];
      data.forEach(function(item){
        exit.push(parseFloat(item.datavalue) || 0);
      });
      io.sockets.emit('news-rawdata-chart', { name: name, data: exit });
    });
  });
});

var server = server.listen(app.get('port'), function(){
	console.log('WEB started.');
});