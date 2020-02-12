$(function(){
	
});


var getHomePage = function(){
	$.ajax({
        type: "POST",
        url: base_url + "login",
        data: userdata,
        timeout: 60000, 
        dataType: "json",
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
           console.log(res);
            //inputFieldsClear.loginClear();
           if (res.status === 0) {
                
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