'use strict';

angular.module('app', []);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});

angular.module('app').controller('configuration', ['$scope', '$http', function($scope, $http){

  $scope.data = {};
  $scope.sensors = [];

  function valid(sensor){
    function isNullOrEmpty(a){
      return (a == null) || (a == "") || !!(a.match(/^\s+$/));
    }
    if(isNullOrEmpty(sensor.description)){
      alert('Favor preencher o campo: Descrição.');
      return false;
    }
    if(isNullOrEmpty(sensor.name)){
      alert('Favor preencher o campo: Nome.');
      return false;
    }
    return true;
  };

  $scope.clear = function(){
    angular.extend($scope.data, {
      _id: null,
      description: '',
      name: '',
      unit: '',
      chart: false
    });
  };

  $scope.getAll = function(){
    $http.get('/sensor').success(function(data){
      if(!data.error){
        $scope.sensors = data.data;
      }
    });
    $scope.clear();
  };

  $scope.persist = function(sensor){
    if(sensor._id === null){
      $scope.save('/sensor', sensor);
    }else{
      $scope.save('/sensor/update', sensor);
    }
  };

  $scope.edit = function(sensor){
    angular.copy(sensor, $scope.data);
  };

  $scope.save = function(address, sensor){
    if(valid(sensor)){
      $http.post(address, sensor).success(function(data){
        if(!data.error){
          $scope.getAll();
        }else{
          alert('Não foi possível salvar/atualizar o sensor.');
        }
      });
    }
  };

  $scope.delete = function(sensor){
    $http.delete('/sensor/' + sensor._id).success(function(data){
      if(!data.error){
        $scope.getAll();
      }else{
        alert('Não foi possível excluir o sensor.');
      }
    });
  };

  $scope.getAll();

}])