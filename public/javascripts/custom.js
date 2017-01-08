$(function(){
$('#calendar').fullCalendar({
    weekends: false,
    events: '/getTaskList'
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
 $(".addnewform").submit(function(){
 	console.log("Subn");
 	var req_obj={

 	}
 	req_obj.subid=$("#subid").val();
 	req_obj.tasktype=$("#tasktype").val();
 	req_obj.date=$("#taskdate").val();
 	req_obj.notes=$("#notes").val();
 	req_obj.mins=$("#mins").val();
 	console.log(req_obj);
 	$.ajax({
	    type: 'POST',
	    url: '/addNewTask',
	    dataType: 'text',
	    data: JSON.stringify(req_obj),
	    success: function(data) { 
	     Materialize.toast('Added', 4000); 
	     $('#modal1').modal('close');
	     $('#calendar').fullCalendar( 'refetchEvents' );
	 	},
	    contentType: "application/json"
	});
 	return false;
 });

});