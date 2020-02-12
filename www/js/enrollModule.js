$(function(){
	/*$("input[name*=cin]").keyup(function(e) {
      if($(this).val().length == 1) {
        var input_fields = $(this).closest('tr').find('input[name*=cin]');
        console.log(input_fields);
        console.log(input_fields.index(this));
        input_fields.eq(input_fields.index(this) + 1).focus();
      }
      if (e.keyCode==8 && e.currentTarget.name !== 'cin01') {
        $(this).attr('type', 'text');
        var input_fields = $(this).closest('tr').find('input[name*=cin]');
        input_fields.eq( input_fields.index(this) - 1 ).attr('type', 'text').focus(); 
      }
     });
*/

	$(document).on("click","#enroll_submit",function(e){
		SpinnerPlugin.activityStart("Loading...", { dimBackground: true });	
		var enrolementId = "TR"+""+$("#e1").val()+""+$("#e2").val()+""+$("#e3").val()+""+$("#e4").val()+""+$("#e5").val()+""+$("#e6").val()+""+$("#e7").val()+""+$("#e8").val()+""+$("#e9").val();
		var validationFlag = "";
		var userDetails = {
			"training_id":enrolementId,
		}
		
		$.ajax({
        type: "POST",
        url: base_url + "enrollment",
        data: userDetails,
        timeout: 60000, 
        dataType: "json",
        headers:{
			"X-Api-Key":localStorage.getItem("auth_key"),
		},
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
        	console.log(res);
            //inputFieldsClear.loginClear();
           if (res.status === 0) {
               var htm =    "<div class='enroll-data-row'>"+
							"  <span class='enroll-id'>"+res.data[0].vUniqueCode+"</span>"+
						    "</div>"+
						    "<h1>"+res.data[0].vTrainingName+"</h1>"+
							"   <div class='enroll-data-row address'>"+
							"	  <span class='icon'><img src='images/location-address.png'></span>Aga Khan Rural Support Programme, Gujarat"+
							"   </div>"+
							"   <div class='enroll-data-row time'>"+
							"	  <span class='icon'><img src='images/timings.png'></span>"+getFormattedDate(res.data[0].dStartdate)+"<span class='small-time'>"+getFormattedTime_one(res.data[0].tStarTime)+"</span> <span class='to'>To</span>"+getFormattedDate(res.data[0].dEnddate)+"<span class='small-time'>"+getFormattedTime_one(res.data[0].tEndTime)+"</span>"+
							"   </div>"+
							"   <div class='map-row'>"+
							"	  <div class='head'><span><img src='images/location-map-white.png' class='pull-left'></span>Map</div>"+
							"	  <div class='mapdata'>"+
							"		 <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487295.02532044525!2d78.12785129924684!3d17.41215307568293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C+Telangana!5e0!3m2!1sen!2sin!4v1536326343689' width='100%' height='100%' frameborder='0' style='border:0' allowfullscreen></iframe>"+
							"	  </div>"+
							"   </div>"+
							"   <div class='btn-row'>"+
							"	  <div class='btn-blue registerbtn m-t-20 align-center' id='enroll-user' data-enrollmentid='"+res.data[0].vUniqueCode+"'>"+
							"		 <span><img src='images/otp-lock.png' class='pull-left'></span>Enroll"+
							"	  </div>"+
							"   </div>";
	            $("#enroll-suggest-list").html(htm);	
                SpinnerPlugin.activityStop();
            } else {
            	localStorage.setItem("user_exist", "no");
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }


        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
		
});


	$(document).on("click","#enroll-user",function(e){
		$("#enrollment-confirm-popup").show();
		var id = $(this).data("enrollmentid");
		$("#confirm-enrollment-yes").attr("data-enrollment",id);
		$("#confirm-enrollment-no").attr("data-enrollment",id);
		
	});



	$(document).on("click","#confirm-enrollment-yes",function(e){
		$("#enrollment-confirm-popup").hide();
		var enrollmentId = $(this).data("enrollment");
		requestEnrollment(enrollmentId,"Accept");
		/*displayDOM(elements_divs,elements_divs.$homepage);
	    window.plugins.nativepagetransitions.slide(
			pageTransoptions,
			function (msg) {}, // called when the animation has finished
			function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
		);*/
	});

	$(document).on("click","#confirm-enrollment-no",function(e){
		$("#enrollment-confirm-popup").hide();
		var enrollmentId = $(this).data("enrollment");
		requestEnrollment(enrollmentId,"Decline");

	})
});

var requestEnrollment = function(enrollmentId,type){
	var userDetails = {
		"training_id":enrollmentId,
		"type":type
	}


	$.ajax({
        type: "POST",
        url: base_url + "requestenrollment",
        data: userDetails,
        timeout: 60000, 
        dataType: "json",
        headers:{
			"X-Api-Key":localStorage.getItem("auth_key"),
		},
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
        	console.log(res.data[0]);
            //inputFieldsClear.loginClear();
           if (res.status === 0) {
           		$("#home-event-discription").html("");
            	var html =   "<div class='enroll-data-row' >"+
		                 "    <span class='enroll-id' id='home-enrollment-id'>"+res.data[0].vUniqueCode+"</span>"+
		                 "</div>"+
		                 "<h1 class='enroll-data-head' id='home-enrollment-title'>"+res.data[0].vTrainingName+"</h1>"+
		                 "<div class='enroll-data-row address'>"+
		                 "    <span class='icon'><img src='images/location-address.png'></span>Aga Khan Rural Support Programme, Gujarat"+
		                 "</div>"+
		                 "<div class='enroll-data-row time'>"+
		                 "    <span class='icon'><img src='images/timings.png'></span>"+getFormattedDate(res.data[0].dStartdate)+"<span class='small-time'>"+getFormattedTime_one(res.data[0].tStarTime)+"</span> <span class='to'> To </span id='home-eventend-date'>"+getFormattedDate(res.data[0].dEnddate)+"<span class='small-time' id='home-eventend-time'>"+getFormattedTime_one(res.data[0].tEndTime)+"</span>"+
		                 "</div>";
              $("#home-event-discription").html(html);
           	  var totalDays = parseInt(res.days) + 1;
              convertDays(totalDays,res.data[0].dStartdate,res.data[0].dEnddate);
			  displayDOM(elements_divs,elements_divs.$homepage);
		      window.plugins.nativepagetransitions.slide(
				 pageTransoptions,
				 function (msg) {}, // called when the animation has finished
				 function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
			 );


                SpinnerPlugin.activityStop();
            } else {
            	localStorage.setItem("user_exist", "no");
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }


        },
        error: function(xhr, status, err) {
           ErrorHandler(xhr, status, err)
        }
    });
}

var convertDays =  function(td,sd,ed){
	var respo = "";
	for (var i = 0; i < td; i++) { 
		if(i === 0){
      		respo += "<div class='schedule-row' id='home-activity-block'>"+
					"    <span class='day'><span class='active'>Day "+(i+1)+"</span><br>"+getFormattedDate(sd)+"</span>"+
					"    <span class='in active'>"+
					"        <div class='arrow_box'><img src='images/in-icon-normal.png'>In</div>"+
					"    </span>"+
					"    <span class='test'>"+
					"        <div class='arrow_box'>"+
					"            <img src='images/test-icon-normal.png'> Pre-Test"+
					"        </div>"+
					"    </span>"+
					"</div>";
      	}else if(i === (td-1)){
      		respo +=    "<div class='schedule-row' id='home-activity-block'>"+
						"    <span class='day'><span class='active'>Day "+(i+1)+"</span><br>"+getFormattedDate(ed)+"</span>"+
						"    <span class='in'>"+
						"        <div class='arrow_box'><img src='images/in-icon-normal.png'>In</div>"+
						"    </span>"+
						"    <span class='test'>"+
						"        <div class='arrow_box'>"+
						"            <img src='images/test-icon-normal.png'>Post-Test"+
						"        </div>"+
						"    </span>"+
						"    <span class='feedback'>"+
						"        <div class='arrow_box'>"+
						"            <img src='images/feedback-icon-normal.png'>Feedback"+
						"        </div>"+
						"    </span>"+
						"</div>";
      	}else{
      		respo +=    "<div class='schedule-row' id='home-activity-block'>"+
						"    <span class='day'><span class='active'>Day "+(i+1)+"</span><br>"+getFormattedDate(ed)+"</span>"+
						"    <span class='in'>"+
						"        <div class='arrow_box'><img src='images/in-icon-normal.png'>In</div>"+
						"    </span>"+
						"</div>";
      	}
	}
	$("#days-list").html(respo);
}

$(function(){
	$(document).on("click","#home-schedule-click",function(e){
		$("#days-list").show();
		$("#resource-list").hide();
	});

	$(document).on("click","#home-resource-click",function(e){
		$("#days-list").hide();
		$("#resource-list").show();
	});
})