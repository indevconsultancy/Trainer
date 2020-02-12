const elements_ids = {
    $login_mobile_input: $("#login_mobile_input"),
    $login_password_input: $("#login_password_input"),
}


var clearInputs = {
    login: function() {
        elements_ids.$login_mobile_input.val("");
        elements_ids.$login_password_input.val("");
    },
}

$(function() {

    $(document).on("click", "#home", function(e) {
        getHomePage();
    });



    /*show password*/
    $(document).on("click", "#show_login_password", function(e) {
        $("#login_password_input").attr("type", "text");
        $("#show_login_password").hide();
        $("#hide_login_password").show();
    });

    /*hide password*/
    $(document).on("click", "#hide_login_password", function(e) {
        $("#login_password_input").attr("type", "password");
        $("#hide_login_password").hide();
        $("#show_login_password").show();
    });




    /*login submit*/
    $(document).on("click", "#login_submit", function(e) {
        var usrMobile = (elements_ids.$login_mobile_input.val()).trim();
        var usrPassword = (elements_ids.$login_password_input.val()).trim();
        var usrDevType = "ANDROID";
        var validationFlag = "";


        if (usrMobile === null || usrMobile === "" || usrMobile === " ") {
            validationFlag = "Username should not be empty!";
        } else if (usrPassword === null || usrPassword === "" || usrPassword === " ") {
            validationFlag = "Password should not be empty!";
        }
        /* else if (usrMobile !== null || usrMobile !== "" || usrMobile !== " ") {
                    validateMobile(usrMobile) ? validationFlag = "" : validationFlag = "Invalid MObile NUmber!";
                }
        */
        if (validationFlag === null || validationFlag === "" || validationFlag === " ") {
            logInService(usrMobile, usrPassword, usrDevType);
        } else {
            navigator.notification.alert(validationFlag);
            // SpinnerPlugin.activityStop();
        }

    });







})


var logInService = function(usrMobile, usrPassword, usrDevType) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var userdata = {
        "vUsername": usrMobile,
        "password": usrPassword,
        "device_type": usrDevType,
        "device_token": "123456",
    }

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
            window.localStorage.clear();
            //inputFieldsClear.loginClear();
            if (res.status === 0) {
                // localStorage.setItem("auth_key", res.auth_key);
                // localStorage.setItem("user_exist", "yes");
                // localStorage.setItem("userDesignation", res.data.designation);
                // localStorage.setItem("userDeviceToken", res.data.device_token);
                // localStorage.setItem("userDeviceType", res.data.device_type);
                // localStorage.setItem("userEmail", res.data.vEmail);
                // localStorage.setItem("userFullName", res.data.vName);
                // localStorage.setItem("userMobileNumber", res.data.vPhonenumber);
                // localStorage.setItem("userOrganization", res.data.vDepartmentName);
                // localStorage.setItem("userId", res.data.iAdminId);
                localStorage.setItem("auth_key", res.auth_key);
                localStorage.setItem("user_exist", "yes");
                var jsonV = {
                    "userDesignation":res.data.designation,
                    "userDeviceToken":res.data.device_token,
                    "userDeviceType":res.data.device_type,
                    "userEmail":res.data.vEmail,
                    "userFullName":res.data.vName,
                    "userMobileNumber":res.data.vPhonenumber,
                    "userOrganization":res.data.vDepartmentName,
                    "userId":res.data.iAdminId,
                   
                }
                
                
                var a = CryptoJS.AES.encrypt(JSON.stringify(jsonV),res.auth_key, 256);
                localStorage.setItem("d",a);
              
                var d = CryptoJS.AES.decrypt(localStorage.getItem("d"),localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
        var b = JSON.parse(d); 
        console.log(b);


                if (res.data.vProfile_image == null || res.data.vProfile_image == " " || res.data.profilepic == "") {
                    localStorage.setItem("userDP", "images/profile-img.png");
                } else {
                    var dp = dp_image + res.data.vProfile_image;
                    localStorage.setItem("userDP", dp);
                }
                 getHomePage();
                 getDesignationProfileEdit();
                getStatesEnroll();
                getCityLists();
            } else {
                //localStorage.setItem("user_exist", "yes");
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }


        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });

}


var registrationService = function(usrMobile, usrPassword, usrEmail) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var userdata = {
        "mobile_number": usrMobile,
        "password": usrPassword,
        "email": usrEmail,
        "device_type": "ANDROID",
        "device_token": "STATIC123"
    }

    $.ajax({
        type: "POST",
        url: base_url + "signup",
        data: userdata,
        timeout: 60000,
        dataType: "json",
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res);
            if (res.status === 0) {
                 localStorage.setItem("auth_key", res.auth_key);
                localStorage.setItem("user_exist", "yes");
                var jsonV = {
                    "userDesignation":res.data.designation,
                    "userDeviceToken":res.data.device_token,
                    "userDeviceType":res.data.device_type,
                    "userEmail":res.data.vEmail,
                    "userFullName":res.data.vName,
                    "userMobileNumber":res.data.vPhonenumber,
                    "userOrganization":res.data.vDepartmentName,
                    "userId":res.data.iAdminId,
                   
                }
                
                var a = CryptoJS.AES.encrypt(JSON.stringify(jsonV),res.auth_key, 256);
                localStorage.setItem("d",a);

               
                // localStorage.setItem("userDesignation", res.data.designation);
                // localStorage.setItem("userDeviceToken", res.data.device_token);
                // localStorage.setItem("userDeviceType", res.data.device_type);
                // localStorage.setItem("userEmail", res.data.vEmail);
                // localStorage.setItem("userFullName", res.data.vName);
                // localStorage.setItem("userMobileNumber", res.data.vPhonenumber);
                // localStorage.setItem("userOrganization", res.data.vDepartmentName);
                // localStorage.setItem("userId", res.data.iAdminId);
                if (res.data.vProfile_image == null || res.data.vProfile_image == " " || res.data.profilepic == "") {
                    localStorage.setItem("userDP", "images/profile-img.png");
                } else {
                    var dp = dp_image + res.data.vProfile_image;
                    localStorage.setItem("userDP", dp);
                }

                displayDOM(elements_divs, elements_divs.$otpDiv);
                window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function(msg) {}, // called when the animation has finished
                    function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
                );
                SpinnerPlugin.activityStop();
            } else {
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }


        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });

}

var verifyOTPService = function(completeOTP) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
     var d = CryptoJS.AES.decrypt(localStorage.getItem("d"),localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
        var b = JSON.parse(d); 
       // console.log(b);

    var userdata = {
        "mobile_number": b.userMobileNumber,
        "otp": completeOTP,
    }

    $.ajax({
        type: "POST",
        url: base_url + "verifyotp",
        data: userdata,
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key"),
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res.status)
            if (res.status === 0) {
                displayDOM(elements_divs, elements_divs.$profileEdit);
                window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function(msg) {}, // called when the animation has finished
                    function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
                );
                SpinnerPlugin.activityStop();
                getStates();
            } else {
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }


        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });

}


$("#listBox").change(function(e) {
    console.log(this);
    console.log(e);
    var a = $(this).val();
    getCity(a);
});

var getStates = function() {
    $.ajax({
        type: "GET",
        url: base_url + "statelist",
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key"),
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res);
            var html = "";
            if (res.status === 0) {
                html = "<option value='SELECT STATE'>Select State</option>";
                res.data.forEach(function(res1, index) {
                    html += "<option value='" + res1.iStateId + "'>" + res1.vState + "</option>";
                });
                $("#listBox").html(html);
            } else {
                html = "<option value='SELECT STATE'>Select State</option>";
                $("#listBox").html(html);
            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });
}

var getCity = function(cityId) {
    console.log(cityId);
    var userdetails = {
        "state_id": cityId
    }
    $.ajax({
        type: "POST",
        url: base_url + "districtlist",
        timeout: 60000,
        dataType: "json",
        data: userdetails,
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key"),
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res);
            var html = "";
            if (res.status === 0) {
                html = "<option value='SELECT CITY'>Select District</option>";
                res.data.forEach(function(res1, index) {
                    html += "<option value='" + res1.city_id + "'>" + res1.name + "</option>";
                });
                $("#secondlist").html(html);
            } else {
                html = "<option value='SELECT CITY'>Select District</option>";
                $("#secondlist").html(html);
            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });
}