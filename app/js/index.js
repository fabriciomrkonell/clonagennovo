'use strict';

var socket = io();

angular.module('app', []);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});

angular.module('app').controller('index', ['$scope', '$http', function($scope, $http){

  $scope.sensors = {};

  function refresh(){
  	if (!$scope.$$phase) {
		  $scope.$apply();
		}
  }

  $scope.getAll = function(){
    $http.get('/sensor').success(function(data){
      if(!data.error){
      	data.data.forEach(function(sensor){
      		socket.emit('rawdata', sensor.name);
      		if(sensor.chart){
      			socket.emit('rawdata-chart', sensor.name);
      		}
      		$scope.sensors[sensor.name] = {};
      		$scope.sensors[sensor.name].description = sensor.description;
      		$scope.sensors[sensor.name].name = sensor.name;
      		$scope.sensors[sensor.name].datavalue = '0';
      		$scope.sensors[sensor.name].unit = sensor.unit;
      		$scope.sensors[sensor.name].chart = sensor.chart;
      	});
      }
    });
  };

  $scope.getAll();

  socket.on('news-rawdata', function(data){
  	if(angular.isObject($scope.sensors[data.name])){
  		$scope.sensors[data.name].datavalue = data.datavalue;
  		refresh();
  		var chart = $('#container' + data.name).highcharts();
  		if(chart){
  			chart.series[0].addPoint(parseFloat(data.datavalue) || 0);
  		}
  	}
  });

  socket.on('news-rawdata-chart', function(data){
    if($('#container' + data.name).highcharts() === undefined){
      $('#container' + data.name).highcharts({
        title: {
          text: ''
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function() {
            return this.series.name + ': <b>' + this.y + '</b>';
          }
        },
        series: [{
          showInLegend: false,
          name: $scope.sensors[data.name].description,
          data: data.data
        }]
      });
    }
  });

}])