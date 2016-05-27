'use strict';

var socket = io();

angular.module('app', ['ngMask']);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});

angular.module('app').controller('index', ['$scope', '$http', function($scope, $http){

  $scope.sensors = {};
  $scope.date = {
    start: '01012016',
    end: '01012020'
  };

  function refresh(){
  	if (!$scope.$$phase) {
		  $scope.$apply();
		}
  }

  $scope.searchData = function(){
    for(var sensor in $scope.sensors) {
      socket.emit('rawdata-chart-history', {
        start: $scope.date.start,
        end: $scope.date.end,
        sensor: $scope.sensors[sensor].name
      });
    }
  };

  $scope.getAll = function(){
    $http.get('/sensor').success(function(data){
      if(!data.error){
      	data.data.forEach(function(sensor){
      		if(sensor.chart){
      			socket.emit('rawdata-chart-history', {
              start: $scope.date.start,
              end: $scope.date.end,
              sensor: sensor.name
            });
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

  socket.on('news-rawdata-chart-history', function(data){
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

  });

}])