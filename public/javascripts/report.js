var reportApp=angular.module("reportApp",[]);
reportApp.controller('reportCtrl', ['$scope','$http','$filter', function($scope,$http,$filter){
  $http.get("/getmytasklist").then(function(res){
  	$scope.reportData=res.data;
  },function(err){
  	console.log("Error");
  });
  $scope.filterUser="";
  $scope.autocompleteLoad=false;
  $scope.$watch('filterUser', function (newValue, oldValue, scope) {
    if(newValue.length>1&&!$scope.autocompleteLoad){
      $('#unamefil').autocomplete({
          data:{}
        });
       $http.get("/getUserList?us="+newValue).then(function(res){
          $('#unamefil').autocomplete({
          data:res.data
        });
          $scope.autocompleteLoad=true;
       });
    }else{
      $('#unamefil').autocomplete({
          data:{}
        });
       $scope.autocompleteLoad=false;
    }
}, true);
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