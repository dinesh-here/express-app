var reportApp=angular.module("reportApp",[]);
reportApp.controller('reportCtrl', ['$scope','$http','$filter', function($scope,$http,$filter){
  $http.get("/getmytasklist").then(function(res){
  	$scope.reportData=res.data;
  },function(err){
  	console.log("Error");
  });
}]);
reportApp.controller('reportCtrlAdmin', ['$scope','$http','$filter', function($scope,$http,$filter){
  $http.get("/getalltask").then(function(res){
    if(res.status===200){
  	   $scope.reportData=res.data;      
    }else{
       $scope.reportData=[{"date":"Auth Error"}];
    }
  },function(err){
  	console.log("Error");
     $scope.reportData=[{"date":"Auth Error"}];
  });
}]);

angular.element(function() {
  angular.bootstrap(document, ['reportApp']);
});