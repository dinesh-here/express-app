var reportApp=angular.module("reportApp",['ngResource']);
reportApp.factory("Task", function($resource) {
  return $resource("/api/admin/task/:docId",{docId:'@_docId'},{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'update':{method:'PUT'},
  'query':  {method:'GET', isArray:false},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} });
});
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
reportApp.controller('reportCtrlAdmin', ['$scope','$http','$filter',"Task", function($scope,$http,$filter,Task){
  /*$http.get("/api/admin/task").then(function(res){
    if(res.status===200){
  	   $scope.reportData=res.data;      
    }else{
       $scope.reportData=[{"date":"Auth Error"}];
    }
  },function(err){
  	console.log("Error");
     $scope.reportData=[{"date":"Auth Error"}];
  });*/
  Task.query({pageno:0},function(data){
    $scope.reportData=data.doc;
     $scope.total_res=data.total;
     $scope.page_list=[];
     for (var i = 0; i < Math.ceil(data.total/20); i++) {
        $scope.page_list.push({page:i});
     }

  });
  $scope.getPage=function(pageno){
    Task.query({pageno:pageno},function(data){
    $scope.reportData=data.doc;
    $scope.page_list=[];
    $scope.total_res=data.total;
     for (var i = 0; i < Math.ceil(data.total/20); i++) {
        $scope.page_list.push({page:i});
     }
  })
  };
}]);
reportApp.controller('efgEditor', ['$scope','$http','Task', function($scope,$http,Task){
    $scope.searchByDate=function(){
      if($("#searchDate").val()){
         var searchDate=new Date($("#searchDate").val());
         var mm=("0" + (searchDate.getMonth() + 1)).slice(-2);
         var dd=("0" + searchDate.getDate()).slice(-2);
         
        var yyyy=searchDate.getFullYear();
        $http.get("/api/admin/searchbydate/"+mm+"/"+dd+"/"+yyyy).then(function(res){
          $scope.reportData=res.data;
        });
      }
    };
    $scope.updateEFG=function(ids,efg){
      console.log(ids,efg);
      $http.put("/api/admin/task/"+ids+"/updateefg/"+efg).then(function(res){
        Materialize.toast(res.data, 4000); 
      });
    };
    $scope.deleteTask=function(id){
      $http.delete("/api/admin/task/"+id).then(function(res){
          Materialize.toast(res.data, 4000); 
      });
    };

}]);

angular.element(function() {
  angular.bootstrap(document, ['reportApp']);
});
$(function(){
  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 15 
  });
});