var backButtonLevel = 0; //default close level for app
var flag = true; // internet checking flag
var db = "";
var cacheFolderSubPath = "";
//page transfer animation effects
const pageTransoptions = {
    "direction": "up", // 'left|right|up|down', default 'left' (which is like 'next')
    "duration": 100, // in milliseconds (ms), default 400
    "slowdownfactor": 40, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
    "slidePixels": 10, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
    "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay": 200, // same as above but for Android, default 70
    "winphonedelay": 250, // same as above but for Windows Phone, default 200,
    "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    "fixedPixelsBottom": 100 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
};


var myVar = setInterval(flag_connection, 10000);

function flag_connection() {

    var user_exist = localStorage.getItem("user_exist");
    // console.log(user_exist);
    if (user_exist == "yes") {
        flag = checkConnection();

        if (flag == false) {
            //console.log("flag");
        } else {



            var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
            db.transaction(function(tx) {
                // tx.executeSql('DROP TABLE IF EXISTS insert_post_request');
                tx.executeSql('SELECT * FROM insert_post_request  where status=? ', ["0"], function(tx, results) {
                    var reslen = results.rows.length;


                    localStorage.setItem("req_parm_len", reslen);
                    if (reslen > 0) {
                        send_request_params();
                    }

                });

            })


        }
    }

}

$(document).ready(function() {
    //displayDOM(elements_divs,elements_divs.$userLoginDiv);//for web testing only
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", goBack, true);

        flag_connection();
       
        



        if (flag == false) {
            console.log(flag);

            // navigator.notification.alert( 'Cannot Connect To Internet.Please Check Your Connection Settings And Try Again',  // message
            // 		 closeActivity,     // callback
            // 		'No Network Connection',            // title
            // 		'OK'                  				// buttonName
            // );
            document.getElementsByTagName("body")[0].style.display = "block";
        } else {

            document.getElementsByTagName("body")[0].style.display = "block";
        }


        var user_exist = localStorage.getItem("user_exist");
        console.log(user_exist);
        if (user_exist == "yes") {
            getHomePage();
        } else {
            displayDOM(elements_divs, elements_divs.$userLoginDiv);
            window.plugins.nativepagetransitions.slide(
                pageTransoptions,
                function(msg) {}, // called when the animation has finished
                function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
            );
        }


    });

    /*side menu */

    $(document).on("click", '.menu-side-click', function(e) {
        $("#slidebar").show();

    });

    $(document).on("click", '#slidebar', function(e) {
        $("#slidebar").hide();
    })

    $(document).on("click", "#logout_profile", function(e) {
        $("#slidebar").hide();
        navigator.notification.confirm('Are you sure do you want to logout?', onConfirmLogout, 'Logout');
        //localStorage.clear();
    })
});


function onConfirmLogout(btnIndex) {
    if (btnIndex == 1) {
        localStorage.clear();
        displayDOM(elements_divs, elements_divs.$userLoginDiv);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    }
}




function error() { //error call back for permissions
    console.warn('Camera or Accounts permission is not turned on');
}
/**side menu home click**/





function closeActivity() {
    navigator.app.exitApp();
}

/**application exit function for final back event*/
function doExit() {
    navigator.notification.confirm('Are you sure?', onConfirm, 'Exit');
}

function onConfirm(btnIndex) {
    if (btnIndex == 1) {
        navigator.app.exitApp();
    }
}


/** internet connection checking function*/
function checkConnection() {
    //console.log("checkConnection");
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    if (states[networkState] == 'No network connection') {
        return false;
    }
}


/**android back button functionality*/
function goBack() {
    switch (backButtonLevel) {
        case 0:
            doExit();
            break;
    }
}





/**VALIDATION FUNCTIONS**/
function validateEmail(email) {
    var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var valid = emailReg.test(email);
    if (!valid) {
        return false;
    } else {
        return true;
    }
}

function validateMobile(mobile) {
    var pattern = /^[6789]\d{9}$/;
    //var pattern = /^([0|\+[0-9]{5,16})$/
    //var pattern =  /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    var mobileReg = new RegExp(pattern);
    var valid = mobileReg.test(mobile);
    if (!valid) {
        return false;
    } else {
        return true;
    }
}

function getFormattedDate(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)\ (.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3, p4, p5, p6) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var time = "";
        if (p4 >= 12) {
            if (p4 == 12) {
                time = p4 + ":" + p5 + " PM";
            } else {
                time = (p4 - 12) + ":" + p5 + " PM";
            }

        } else {
            time = p4 + ":" + p5 + " AM";
        }
        date_string = months[(p2 - 1)] + " " + (p3) + ", " + p1;
    });
    return date_string;
}

function getFormattedTime(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)\ (.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3, p4, p5, p6) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var time = "";
        if (p4 >= 12) {
            if (p4 == 12) {
                time = p4 + ":" + p5 + " PM";
            } else {
                time = (p4 - 12) + ":" + p5 + " PM";
            }

        } else {
            time = p4 + ":" + p5 + " AM";
        }
        date_string = time;
    });
    return date_string;
}

function getFormattedDateAndTime(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)\ (.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3, p4, p5, p6) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var time = "";
        if (p4 >= 12) {
            if (p4 == 12) {
                time = p4 + ":" + p5 + " PM";
            } else {
                time = (p4 - 12) + ":" + p5 + " PM";
            }

        } else {
            time = p4 + ":" + p5 + " AM";
        }
        date_string = months[(p2 - 1)] + " " + (p3) + " " + p1 + ". " + time;
    });
    return date_string;
}

function getFormattedTime_one(input) {
    var date_string;
    var pattern = /(.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p4, p5, p6) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var time = "";
        if (p4 >= 12) {
            if (p4 == 12) {
                time = p4 + ":" + p5 + " PM";
            } else {
                time = (p4 - 12) + ":" + p5 + " PM";
            }

        } else {
            time = p4 + ":" + p5 + " AM";
        }
        date_string = time;
    });
    return date_string;
}


var errormessage = {
    timeout: "Connection timeout, Please try again later.",
    noNetwork: "Internet Connection is too slow or not available. Please check your connetion settings!",
    unAuthorized: "Authentication failed",
    serverError: "some thing went wrong, Please try after some time"

}


function ErrorHandler(xhr, status, err) {
    SpinnerPlugin.activityStop();
    if (status == "timeout") {
        navigator.notification.alert(errormessage.timeout);
    }
    // else if (xhr.status == 0) {
    //     navigator.notification.alert(errormessage.noNetwork);
    // } 
    else if (err == "Unauthorized") {
        unAuthorized();
    }
    //  else {
    //     navigator.notification.alert(errormessage.serverError);
    // }
}

function unAuthorized() {
    navigator.notification.alert(errormessage.unAuthorized);
    SpinnerPlugin.activityStop();
    localStorage.clear();
    displayDOM(elements_divs, elements_divs.$userLoginDiv);
    window.plugins.nativepagetransitions.slide(
        pageTransoptions,
        function(msg) {}, // called when the animation has finished
        function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
    );
}





// <!--Calling onDeviceReady method-->
// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {

// // <!--window.sqlitePlugin.openDatabase creates/open a non existing/existing database-->

// }