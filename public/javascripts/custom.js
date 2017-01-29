$(function(){
$('#calendar').fullCalendar({
    events: '/getTaskList',
      eventClick: function(event) {
      	console.log(event.id);
        var scope = angular.element(document.getElementById("calenderView")).scope();
        scope.$apply(function () {
          scope.getTaskByID(event.id);
        });
      }
});
 $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%'
    }
  );
 $(".addforclose").click(function () {
   $('#modal1').modal('close');
 });

});
 
var formApp = angular.module('taskApp', []);
formApp.controller("formController",['$scope', '$http','$filter', function($scope, $http,$filter) {
   $scope.formData = {};
    $scope.updateData={};
   $scope.newForm=function(){
     $scope.formData = {};
     document.getElementById("taskdate").valueAsDate = new Date();
     $('#modal1').modal('open');
   };
   $scope.submit_task=function(){
    $scope.tmpDate=new Date(angular.element("#taskdate").val());
      $scope.formData.date=$filter('date')($scope.tmpDate, "MM/dd/yyyy");
      $http.post("/addNewTask",$scope.formData).then(function(res){
         Materialize.toast(res.data, 4000); 
       $('#modal1').modal('close');
       $('#calendar').fullCalendar( 'refetchEvents' );
      }, function(err){
         Materialize.toast(err, 4000); 
       $('#modal1').modal('close');
       $('#calendar').fullCalendar( 'refetchEvents' );
        console.log(err);
      });
   };
   $scope.deleteById=function(){
     $http.delete("/deleteById/"+$scope.updateData._id+"/remove").then(function(res){
       Materialize.toast(res.data, 4000); 
       $('#modal2').modal('close');
       $('#calendar').fullCalendar( 'refetchEvents' );
     }, function(err){
        Materialize.toast(err, 4000); 
       $('#modal2').modal('close');
        console.log(err);
     });
   };
   $scope.update_task=function(){
     console.log($scope.updateData);
      $scope.tmpDate=new Date(angular.element("#utaskdate").val());
      $scope.updateData.date=$filter('date')($scope.tmpDate, "MM/dd/yyyy");
     $http.post("/updateTask",$scope.updateData).then(function(res){
       Materialize.toast(res.data, 4000); 
       $('#modal2').modal('close');
       $('#calendar').fullCalendar( 'refetchEvents' );
     }, function(err){
        Materialize.toast(err, 4000); 
       $('#modal2').modal('close');
        console.log(err);
     });
   };
   $scope.getTaskByID=function(did){
     $http.get('/gettaskbyid?did='+did).then(function(res){
       console.log(res);
       $scope.updateData=res.data;
       var dafil=new Date($scope.updateData.date);
       var dateString=dafil.getFullYear()+"-"+(("0" + (dafil.getMonth() + 1)).slice(-2))+"-"+(("0" + dafil.getDate()).slice(-2));
       $(".updatefil").val(dateString);
        $('#modal2').modal('open');
        setTimeout(function(){
          Materialize.updateTextFields();          
        }, 100);
     }, function(err){
       console.log(err);
     });
   };
}]);
