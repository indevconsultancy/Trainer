$(function() {

    $(document).on("click", "#enrollemt_click_offline", function(e) {
       
        $("#enroll_itrainingid").val($("#iTrainingId_currentprogramme").val());
        // var html = "";
        // if (flag === false) {
        //     html = ' <div class="form-group bg-field"> <span><img src="images/profle-designation-icon.png"></span> <span class="input-field"> <input id="enroll_user_organization" type="name" class="form-control" placeholder="Organization/Designation"> </span> </div> <div class="form-group bg-field"> <span><img src="images/profile-state-icon.png"></span> <span class="input-field"> <input id="listBox_state" type="name" class="form-control " placeholder="STATE"> </span> </div> <div class="form-group bg-field"> <span><img src="images/profile-district-icon.png"></span> <span class="input-field"> <input id="listBox_city" type="name" class="form-control" placeholder="CITY"> </span> </div>';

        // } else {
        //     html = '<div class="form-group bg-field"> <span><img src="images/profle-designation-icon.png"></span> <span class="input-field"> <select id="enroll_user_organization"> <option value="SELECT DESIGNATION">Designation</option> </select> </span> </div> <div class="form-group bg-field"> <span><img src="images/profile-state-icon.png"></span> <span class="input-field"> <select id="listBox_state" class="listBox_state_list"> <option value="SELECT STATE">State</option> </select> </span> </div> <div class="form-group bg-field"> <span><img src="images/profile-district-icon.png"></span> <span class="input-field"> <select id="listBox_city"> <option value="SELECT CITY">District</option> </select> </span> </div>';

        // }
        // $("#offline_enroll_user_organization").html(html);

        getStatesEnroll();
        getDesignationProfileEdit();
        displayDOM(elements_divs, elements_divs.$offlineEnroll);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    });


    $(document).on("click", "#pre-test-back,#post-test-back", function(e) {
        getHomePage();
    });

    $(document).on("click", "#enrollment_back", function(e) {
        displayDOM(elements_divs, elements_divs.$CurrentProgram);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    });



    //submit_enroll_user

    $(document).on("click", "#submit_enroll_user", function(e) {
        var register_name = $("#enroll_user_name").val();
        var register_mobile = $("#enroll_user_mobile").val();
        var register_email = $("#enroll_user_email").val();
        if (flag == false) {

            var register_organization = $("#enroll_user_organization").val();
            var state = $("#listBox_state").val();
            var city = $("#listBox_city").val();
        } else {

            var register_organization = $("#enroll_user_organization option:selected").val();
            var state = $("#listBox_state option:selected").val();
            var city = $("#listBox_city option:selected").val();

        }

        var iTrainingId = $("#enroll_itrainingid").val();
        var validationFlag = "";
        var emptyFields = "";

        if (register_name === null || register_name === "" || register_name === " ") {
            emptyFields = "Participants Name should not be empty!";
        } else if (register_mobile === null || register_mobile === "" || register_mobile === " ") {
            emptyFields = "Participants mobile number should not be empty!";
        } else if (register_email === null || register_email === "" || register_email === " ") {
            emptyFields = "";
        } else if (register_organization === null || register_organization === "" || register_organization === " ") {
            emptyFields = "Participants Organization/Designation should not be empty!";
        } else if (state === null || state === "Select State") {
            emptyFields = "Please select Participants state!";
        } else if (city === null || city === "Select City") {
            emptyFields = "Please select Participants City!";
        }



        if (emptyFields === null || emptyFields === "" || emptyFields === " ") {
            var mobile = validateMobile(register_mobile);
            var email = true;
            if (register_email.length > 1) {
                email = validateEmail(register_email);
                console.log(email);
                console.log(register_email.length);
            }


            if (mobile == false || mobile == "false") {
                navigator.notification.alert("Invalid Mobile Number!");
            } else if (email == false || email == "false") {
                SpinnerPlugin.activityStop();
                navigator.notification.alert("Invalid Email!");
            } else if (mobile && email) {
                if (flag == false) {
                    console.log(flag + "offline");
                    offlineEnrollParticipants(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId);

                } else {
                    console.log(flag + "online");
                    enrollParticipants(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId);
                    offlineEnrollParticipants(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId);

                }
            }
        } else {
            navigator.notification.alert(emptyFields);
        }

        /*
        if (validationFlag === null || validationFlag === "" || validationFlag === " ") {
            enrollParticipants(register_name,register_mobile,register_email,register_organization,state,city,iTrainingId);
        } else {
            navigator.notification.alert(validationFlag);
        }
*/

    })


    $(document).on("click", "#pretest_click_offline", function(e) {
        $("#pretest_itrainingid").val($("#iTrainingId_currentprogramme").val());
        var sendingData = {
            "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        }
        if (flag == false) {

            offlineGetUsersListPretest(sendingData);
        } else {

            getUsersListPretest(sendingData);


        }

    });

    $(document).on("click", "#submit_pretest_score", function(e) {
        var pretestscores = [];

        $('.pretest-scores-class').each(function() {
            pretestscores.push({
                "fFinalScore": $(this).val(),
                "iParticipantId": $(this).data("id"),
                "mobileNumber": $(this).data("mobile"),
            });
        });
        // console.log(JSON.stringify(pretestscores));
        var datasending = {
            "iTrainingId": $("#iTrainingId_currentprogramme").val(),
            "eTestType": "Pre-Test",
            "score_info": JSON.stringify(pretestscores),
            //"score_info": pretestscores,
        }

        var validation = "";
        pretestscores.forEach(function(data, index) {

            if (data.fFinalScore == "" || data.fFinalScore == " ") {
                validation = "Please make sure to submit all Scores";
                return false;
            } else {
                return true;
            }
        });

        if (validation == "") {
            if (flag == false) {

                offlineSubmitPretestScore(datasending);
            } else {

                submitPretestScore(datasending);


            }

        } else {
            navigator.notification.alert(validation);
        }

        //submitPretestScore(datasending);
    });

    $(document).on("click", "#posttest_click_offline,#feedback_click_offline", function(e) {
        $("#posttest_itrainingid").val($("#iTrainingId_currentprogramme").val());
        var sendingData = {
            "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        }
        if (flag == false) {

            console.log("offline");
            offlineGetUsersListPosttest(sendingData);

        } else {
            console.log("online");

            getUsersListPosttest(sendingData);
            // offlineGetUsersListPosttest(sendingData);

        }

    });


    $(document).on("click", "#submit_posttest_score", function(e) {
        var posttestscores = [];
        $('.posttest-scores-class').each(function() {
            posttestscores.push({
                "fFinalScore": $(this).val(),
                "iParticipantId": $(this).data("id"),
                "Feedbackone": $("#postfeedbackone" + $(this).data("id") + "").val(),
                "Feedbacktwo": $("#postfeedbackone" + $(this).data("id") + "").val(),
                "traineename": $(this).data("name"),
                "mobileNumber": $(this).data("mobile"),
            });
        });
        console.log(JSON.stringify(posttestscores));

        var datasending = {
            "iTrainingId": $("#iTrainingId_currentprogramme").val(),
            "eTestType": "Post-Test",
            "score_info": JSON.stringify(posttestscores),
            // "score_info": posttestscores,
        }


        var validation = "";
        posttestscores.forEach(function(data, index) {


            if (data.fFinalScore == "" || data.fFinalScore == " ") {
                validation = "Please make sure to submit all Scores";
                return false;
            }
            if (data.Feedbackone == 0 || data.Feedbacktwo == 0 || data.Feedbackone == undefined || data.Feedbacktwo == undefined) {
                validation = "" + data.traineename + " has not given his feedback.";
                return false;
            } else {
                return true;
            }
        });


        if (validation == "") {
            // submitPretestScore(datasending);
            if (flag == false) {

                offlineSubmitPosttestScore(datasending);
            } else {

                submitPretestScore(datasending);

            }
        } else {
            navigator.notification.alert(validation);
        }


    });




    $(document).on("click", ".feedback", function(e) {
        var traineeid = $(this).data("id");
        var feedbackOne = $("#postfeedbackone" + traineeid + "").val();
        var feedbackTwo = $("#postfeedbacktwo" + traineeid + "").val();

        generateFeedback(feedbackOne, feedbackTwo);

        localStorage.setItem("feedback-1", feedbackOne);
        localStorage.setItem("feedback-2", feedbackTwo);
        localStorage.setItem("feedback-3", traineeid);

        //removing old class
        /* $("#lp1").removeClass("fa-star").addClass("fa-star-o");
         $("#lp2").removeClass("fa-star").addClass("fa-star-o");
         $("#lp3").removeClass("fa-star").addClass("fa-star-o");
         $("#lp4").removeClass("fa-star").addClass("fa-star-o");
         $("#lp5").removeClass("fa-star").addClass("fa-star-o");
         //removing old class
         $("#rt1").removeClass("fa-star").addClass("fa-star-o");
         $("#rt2").removeClass("fa-star").addClass("fa-star-o");
         $("#rt3").removeClass("fa-star").addClass("fa-star-o");
         $("#rt4").removeClass("fa-star").addClass("fa-star-o");
         $("#rt5").removeClass("fa-star").addClass("fa-star-o");*/



    });


    $(document).on("click", "#close_feedback_cross", function() {
        $("#feedback_popup").hide();
        localStorage.setItem("feedback-1", "0");
        localStorage.setItem("feedback-2", "0");

        $("#lp1").removeClass("fa-star").addClass("fa-star-o");
        $("#lp2").removeClass("fa-star").addClass("fa-star-o");
        $("#lp3").removeClass("fa-star").addClass("fa-star-o");
        $("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $("#lp5").removeClass("fa-star").addClass("fa-star-o");
        //removing old class
        $("#rt1").removeClass("fa-star").addClass("fa-star-o");
        $("#rt2").removeClass("fa-star").addClass("fa-star-o");
        $("#rt3").removeClass("fa-star").addClass("fa-star-o");
        $("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $("#rt5").removeClass("fa-star").addClass("fa-star-o");
    });

    $(document).on("click", "#close_feedback_button", function() {
        $("#feedback_popup").hide();
        localStorage.setItem("feedback-1", "0");
        localStorage.setItem("feedback-2", "0");

        $("#lp1").removeClass("fa-star").addClass("fa-star-o");
        $("#lp2").removeClass("fa-star").addClass("fa-star-o");
        $("#lp3").removeClass("fa-star").addClass("fa-star-o");
        $("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $("#lp5").removeClass("fa-star").addClass("fa-star-o");
        //removing old class
        $("#rt1").removeClass("fa-star").addClass("fa-star-o");
        $("#rt2").removeClass("fa-star").addClass("fa-star-o");
        $("#rt3").removeClass("fa-star").addClass("fa-star-o");
        $("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $("#rt5").removeClass("fa-star").addClass("fa-star-o");
    });


    $(document).on("click", "#submit_feedback", function(e) {
        var traineeid = localStorage.getItem("feedback-3");
        var fb1 = localStorage.getItem("feedback-1");
        var fb2 = localStorage.getItem("feedback-2");
        console.log(fb1);
        console.log(fb2);

        $("#feedback_popup").hide();
        $("#lp1").removeClass("fa-star").addClass("fa-star-o");
        $("#lp2").removeClass("fa-star").addClass("fa-star-o");
        $("#lp3").removeClass("fa-star").addClass("fa-star-o");
        $("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $("#lp5").removeClass("fa-star").addClass("fa-star-o");
        //removing old class
        $("#rt1").removeClass("fa-star").addClass("fa-star-o");
        $("#rt2").removeClass("fa-star").addClass("fa-star-o");
        $("#rt3").removeClass("fa-star").addClass("fa-star-o");
        $("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $("#rt5").removeClass("fa-star").addClass("fa-star-o");


        if (fb1 === "0" || fb1 === 0 || fb2 === "0" || fb2 === 0) {
            navigator.notification.alert("Please rate your feedback on a scale from 1 - 5.");
        } else {
            $("#postfeedbackone" + traineeid + "").val(fb1);
            $("#postfeedbacktwo" + traineeid + "").val(fb2);
            localStorage.setItem("feedback-1", "0");
            localStorage.setItem("feedback-2", "0");
            localStorage.setItem("feedback-3", "0");
        }
    });

    $(document).on("click", ".lpstar", function() {
        var val = $(this).attr("id");
        if (val == "lp1") {
            $("#lp1").removeClass("fa-star-o").addClass("fa-star");
            $("#lp2").removeClass("fa-star").addClass("fa-star-o");
            $("#lp3").removeClass("fa-star").addClass("fa-star-o");
            $("#lp4").removeClass("fa-star").addClass("fa-star-o");
            $("#lp5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-1", "1");
        } else if (val == "lp2") {
            $("#lp1").removeClass("fa-star-o").addClass("fa-star");
            $("#lp2").removeClass("fa-star-o").addClass("fa-star");
            $("#lp3").removeClass("fa-star").addClass("fa-star-o");
            $("#lp4").removeClass("fa-star").addClass("fa-star-o");
            $("#lp5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-1", "2");
        } else if (val == "lp3") {
            $("#lp1").removeClass("fa-star-o").addClass("fa-star");
            $("#lp2").removeClass("fa-star-o").addClass("fa-star");
            $("#lp3").removeClass("fa-star-o").addClass("fa-star");
            $("#lp4").removeClass("fa-star").addClass("fa-star-o");
            $("#lp5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-1", "3");
        } else if (val == "lp4") {
            $("#lp1").removeClass("fa-star-o").addClass("fa-star");
            $("#lp2").removeClass("fa-star-o").addClass("fa-star");
            $("#lp3").removeClass("fa-star-o").addClass("fa-star");
            $("#lp4").removeClass("fa-star-o").addClass("fa-star");
            $("#lp5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-1", "4");
        } else if (val == "lp5") {
            $("#lp1").removeClass("fa-star-o").addClass("fa-star");
            $("#lp2").removeClass("fa-star-o").addClass("fa-star");
            $("#lp3").removeClass("fa-star-o").addClass("fa-star");
            $("#lp4").removeClass("fa-star-o").addClass("fa-star");
            $("#lp5").removeClass("fa-star-o").addClass("fa-star");
            localStorage.setItem("feedback-1", "5");
        }

    });


    $(document).on("click", ".rtstar", function() {
        var val = $(this).attr("id");
        if (val == "rt1") {
            $("#rt1").removeClass("fa-star-o").addClass("fa-star");
            $("#rt2").removeClass("fa-star").addClass("fa-star-o");
            $("#rt3").removeClass("fa-star").addClass("fa-star-o");
            $("#rt4").removeClass("fa-star").addClass("fa-star-o");
            $("#rt5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-2", "1");
        } else if (val == "rt2") {
            $("#rt1").removeClass("fa-star-o").addClass("fa-star");
            $("#rt2").removeClass("fa-star-o").addClass("fa-star");
            $("#rt3").removeClass("fa-star").addClass("fa-star-o");
            $("#rt4").removeClass("fa-star").addClass("fa-star-o");
            $("#rt5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-2", "2");
        } else if (val == "rt3") {
            $("#rt1").removeClass("fa-star-o").addClass("fa-star");
            $("#rt2").removeClass("fa-star-o").addClass("fa-star");
            $("#rt3").removeClass("fa-star-o").addClass("fa-star");
            $("#rt4").removeClass("fa-star").addClass("fa-star-o");
            $("#rt5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-2", "3");
        } else if (val == "rt4") {
            $("#rt1").removeClass("fa-star-o").addClass("fa-star");
            $("#rt2").removeClass("fa-star-o").addClass("fa-star");
            $("#rt3").removeClass("fa-star-o").addClass("fa-star");
            $("#rt4").removeClass("fa-star-o").addClass("fa-star");
            $("#rt5").removeClass("fa-star").addClass("fa-star-o");
            localStorage.setItem("feedback-2", "4");
        } else if (val == "rt5") {
            $("#rt1").removeClass("fa-star-o").addClass("fa-star");
            $("#rt2").removeClass("fa-star-o").addClass("fa-star");
            $("#rt3").removeClass("fa-star-o").addClass("fa-star");
            $("#rt4").removeClass("fa-star-o").addClass("fa-star");
            $("#rt5").removeClass("fa-star-o").addClass("fa-star");
            localStorage.setItem("feedback-2", "5");
        }

    });

});


//add user details
var offlineEnrollParticipants = function(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId) {
    var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
    var res_dStartdate = JSON.parse(d);

    console.log(res_dStartdate.data[0].dStartdate);
    var dStartdate = res_dStartdate.data[0].dStartdate;
    var dEnddate = res_dStartdate.data[0].dEnddate;
    console.log(dStartdate);
    console.log(dEnddate);
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        //tx.executeSql('ALTER TABLE test_table RENAME TO participant');
        // tx.executeSql('DROP TABLE IF EXISTS participant');
        tx.executeSql('CREATE TABLE IF NOT EXISTS participant (iParticipantId integer primary key AUTOINCREMENT, name text,mobile_number integer,email text,organization text,state_id text,city_id text,iTrainingId text,pretest text DEFAULT NULL ,present text DEFAULT NULL ,posttest text DEFAULT NULL ,Feedbackone text,Feedbacktwo text,dStartdate date ,dEnddate date ,device_type text,device_token text)');
        console.log("INSERT INTO participant (name,mobile_number,email,organization,state_id,city_id,iTrainingId,dStartdate,dEnddate) VALUES (?,?,?,?,?,?,?,?,?)", [register_name, register_mobile, register_email, register_organization, state, city, iTrainingId, dStartdate, dEnddate]);
        tx.executeSql("INSERT INTO participant (name,mobile_number,email,organization,state_id,city_id,iTrainingId,dStartdate,dEnddate) VALUES (?,?,?,?,?,?,?,?,?)", [register_name, register_mobile, register_email, register_organization, state, city, iTrainingId, dStartdate, dEnddate], function(tx, res) {
            console.log(res);
            $("#enroll_user_name").val("");
            $("#enroll_user_mobile").val("");
            $("#enroll_user_email").val("");
            $("#enroll_user_organization").val($("#enroll_user_organization option:first").val());
            $("#listBox_state").val($("#listBox_state option:first").val());
            $("#listBox_city").val($("#listBox_city option:first").val());

            var dataSending = {
                "data": {
                    "name": register_name,
                    "mobile_number": register_mobile,
                    "email": register_email,
                    "organization": register_organization,
                    "state_id": state,
                    "city_id": city,
                    "iTrainingId": iTrainingId,
                    "device_type": "Android",
                    "device_token": "default device"
                },
                "url": base_url + "signup",
                "type": "POST",
                "ordertype": "1",
                "headers": {
                    "X-Api-Key": localStorage.getItem("auth_key"),
                }
            }
            insertPostRequestDB(dataSending);
            /*$("#enroll_user_organization").removeAttr("selected");
              $("#listBox_state").removeAttr("selected");
              $("#listBox_city").removeAttr("selected");*/
            if (flag == false) {
                navigator.notification.alert("Participant added successfully.");
            }

            SpinnerPlugin.activityStop();
        }, function(e) {
            SpinnerPlugin.activityStop();
            navigator.notification.alert(e.message);
            // console.log("ERROR: " + e.message);
        });
    });


}


//add user details
var enrollParticipants = function(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId) {


    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var dataSending = {
        "name": register_name,
        "mobile_number": register_mobile,
        "email": register_email,
        "organization": register_organization,
        "state_id": state,
        "city_id": city,
        "iTrainingId": iTrainingId,
        "device_type": "Android",
        "device_token": "default device",

    }

    if (flag == false) {
        alert("offline");
        offlineEnrollParticipants(register_name, register_mobile, register_email, register_organization, state, city, iTrainingId);

        return true;
    }
    console.log(dataSending);
    $.ajax({
        type: "POST",
        url: base_url + "signup",
        data: dataSending,
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
            if (res.status === 0) {
                $("#enroll_user_name").val("");
                $("#enroll_user_mobile").val("");
                $("#enroll_user_email").val("");
                $("#enroll_user_organization").val($("#enroll_user_organization option:first").val());
                $("#listBox_state").val($("#listBox_state option:first").val());
                $("#listBox_city").val($("#listBox_city option:first").val());
                /*$("#enroll_user_organization").removeAttr("selected");
                $("#listBox_state").removeAttr("selected");
                $("#listBox_city").removeAttr("selected");*/
                navigator.notification.alert("Participant added successfully.");
                SpinnerPlugin.activityStop();
            } else {
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });

}
var offlineGetUsersListPretest = function(sendingData) {
    var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
    var res_dStartdate = JSON.parse(d);

    console.log(res_dStartdate.data[0].dStartdate);
    var dStartdate = res_dStartdate.data[0].dStartdate;
    var dEnddate = res_dStartdate.data[0].dEnddate;
    // SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {

        tx.executeSql('SELECT * FROM participant where iTrainingId=? and dStartdate=?', [sendingData.iTrainingId, dStartdate], offlinePretestSuccess, errorCB);

        // var dataSending = {
        //         "data": sendingData,
        //         "url": base_url + "getTraineelist",
        //         "type": "POST",
        //         "headers": {
        //             "X-Api-Key": localStorage.getItem("auth_key"),
        //         }
        //     }
        //     insertPostRequestDB(dataSending);

    })

}

function offlinePretestSuccess(tx, results) {
    var len = results.rows.length;
    if (len > 0) {
        var dp = "";
        var html = "";
        for (var i = 0; i < len; i++) {
            var data = results.rows.item(i);
            console.log("Row = " + i + " ID = " + data.id + " Data =  " + data.data);

            var data = results.rows.item(i);
            if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                dp = "images/profile-img.png";
            } else {
                dp = "images/profile-img.png";
            }

            html += "<div class='pretest-row'>" +
                "  <img src='" + dp + "'>" + data.name + "";
            console.log(data.pretest);
            if (data.pretest !== null || data.pretest !== "undefined") {
                console.log(data.pretest);
                var score = parseInt(data.pretest);
                html += "  <span> <input class='pretest-scores-class' value='" + score + "' data-name = '" + data.name + "' data-id='" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' type='number' placeholder='Score'></span>";
            } else {
                console.log(data.pretest);
                html += "  <span> <input class='pretest-scores-class' data-name = '" + data.name + "' data-id='" + data.iParticipantId + "'  data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' type='number' placeholder='Score'></span>";
            }

            html += "</div>";
        }
        $("#pretest_listdisplay").html(html);
        displayDOM(elements_divs, elements_divs.$offlinePretest);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    } else {
        navigator.notification.alert("No records");
        SpinnerPlugin.activityStop();
    }
}



var offlineGetUsersListPosttest = function(sendingData) {
    // SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
    var res_dStartdate = JSON.parse(d);

    console.log(res_dStartdate.data[0].dStartdate);
    var dStartdate = res_dStartdate.data[0].dStartdate;
    var dEnddate = res_dStartdate.data[0].dEnddate;
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {

        tx.executeSql('SELECT * FROM participant where iTrainingId=? and dStartdate=?', [sendingData.iTrainingId, dStartdate], offlinePosttestSuccess, errorCB);

        // var dataSending = {
        //         "data": sendingData,
        //         "url": base_url + "getTraineelist",
        //         "type": "POST",
        //         "headers": {
        //             "X-Api-Key": localStorage.getItem("auth_key"),
        //         }
        //     }
        //     insertPostRequestDB(dataSending);

    })

}

function offlinePosttestSuccess(tx, results) {
    var len = results.rows.length;
    if (len > 0) {
        var dp = "";
        var html = "";
        for (var i = 0; i < len; i++) {
            var data = results.rows.item(i);
            console.log("Row = " + i + " ID = " + data.id + " Data =  " + data.data);
            var dp = "";
            if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                dp = "images/profile-img.png";
            } else {
                dp = "images/profile-img.png";
            }

            html += "<div class='protest-row'>" +
                "  <img src='" + dp + "'>" + data.name + "";

            if (data.posttest !== null) {
                var score = parseInt(data.posttest);
                html += "<span> <input id='post" + data.iParticipantId + "' value='" + score + "' class='posttest-scores-class' type='number' data-name = '" + data.name + "' data-id='" + data.iParticipantId + "'  data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' placeholder='Score'>";
            } else {
                html += "<span> <input id='post" + data.iParticipantId + "' class='posttest-scores-class' type='number' data-name = '" + data.name + "' data-id='" + data.iParticipantId + "'  data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' placeholder='Score'>";
            }

            if (data.Feedbackone !== null) {
                var score = parseInt(data.Feedbackone);
                html += "<input value='" + score + "' id='postfeedbackone" + data.iParticipantId + "'   data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' type='hidden'>";
            } else {
                html += "<input value='0' id='postfeedbackone" + data.iParticipantId + "'   data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' type='hidden'>";
            }

            if (data.Feedbacktwo !== null) {
                var score = parseInt(data.Feedbacktwo);
                html += "<input value='" + score + "' id='postfeedbacktwo" + data.iParticipantId + "'  data-email='" + data.email + "' data-mobile='" + data.mobile_number + "' type='hidden'>";
            } else {
                html += "<input value='0' id='postfeedbacktwo" + data.iParticipantId + "'  data-email='" + data.email + "' data-mobile='" + data.mobile_number + "'  type='hidden'>";
            }


            html += "  <span  data-id='" + data.iParticipantId + "' class='feedback'><img src='images/feedback-icon.png'><br> Feedback</span>" +
                "  </span>" +
                "</div>"


        };
        $("#posttest_listdisplay").html(html);
        displayDOM(elements_divs, elements_divs.$offlinePosttest);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    } else {
        navigator.notification.alert("No records");
        SpinnerPlugin.activityStop();
    }

}


function errorCB(err) {
    alert("No records. ");
}
var getUsersListPretest = function(sendingData) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    console.log(sendingData);
    $.ajax({
        type: "POST",
        url: base_url + "getTraineelist",
        data: sendingData,
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
            if (res.status == 0) {

                res.data.forEach(function(data, index) {
                    var dp = "";
                    if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                        dp = "images/profile-img.png";
                    } else {
                        dp = "images/profile-img.png";
                    }

                    html += "<div class='pretest-row'>" +
                        "  <img src='" + dp + "'>" + data.vName + "";
                    if (data.pretest !== null) {
                        var score = parseInt(data.pretest);
                        console.log(score);
                        html += "  <span> <input class='pretest-scores-class' value='" + score + "' data-name = '" + data.vName + "' data-id='" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "' type='number' placeholder='Score'></span>";
                    } else {
                        html += "  <span> <input class='pretest-scores-class' data-name = '" + data.vName + "' data-id='" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "' type='number' placeholder='Score'></span>";
                    }

                    html += "</div>";
                });
                $("#pretest_listdisplay").html(html);
                displayDOM(elements_divs, elements_divs.$offlinePretest);
                window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function(msg) {}, // called when the animation has finished
                    function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
                );
                SpinnerPlugin.activityStop();

            } else {
                SpinnerPlugin.activityStop();
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });

}



var getUsersListPosttest = function(sendingData) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    $.ajax({
        type: "POST",
        url: base_url + "getTraineelist",
        data: sendingData,
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key"),
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            var html = "";
            if (res.status == 0) {

                res.data.forEach(function(data, index) {
                    var dp = "";
                    if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                        dp = "images/profile-img.png";
                    } else {
                        dp = "images/profile-img.png";
                    }

                    html += "<div class='protest-row'>" +
                        "  <img src='" + dp + "'>" + data.vName + "";

                    if (data.posttest !== null) {
                        var score = parseInt(data.posttest);
                        html += "<span> <input id='post" + data.iParticipantId + "' value='" + score + "' class='posttest-scores-class' type='number' data-name = '" + data.vName + "' data-id='" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "' placeholder='Score'>";
                    } else {
                        html += "<span> <input id='post" + data.iParticipantId + "' class='posttest-scores-class' type='number' data-name = '" + data.vName + "' data-id='" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "' placeholder='Score'>";
                    }

                    if (data.Feedbackone !== null) {
                        var score = parseInt(data.Feedbackone);
                        html += "<input value='" + score + "' id='postfeedbackone" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "' type='hidden'>";
                    } else {
                        html += "<input value='0' id='postfeedbackone" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "'  type='hidden'>";
                    }

                    if (data.Feedbacktwo !== null) {
                        var score = parseInt(data.Feedbacktwo);
                        html += "<input value='" + score + "' id='postfeedbacktwo" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "'  type='hidden'>";
                    } else {
                        html += "<input value='0' id='postfeedbacktwo" + data.iParticipantId + "' data-email='" + data.email + "' data-mobile='" + data.vPhonenumber + "'  type='hidden'>";
                    }


                    html += "  <span  data-id='" + data.iParticipantId + "' class='feedback'><img src='images/feedback-icon.png'><br> Feedback</span>" +
                        "  </span>" +
                        "</div>"


                });
                $("#posttest_listdisplay").html(html);
                displayDOM(elements_divs, elements_divs.$offlinePosttest);
                window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function(msg) {}, // called when the animation has finished
                    function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
                );
                SpinnerPlugin.activityStop();

            } else {
                SpinnerPlugin.activityStop();
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });

}

function offlineSubmitPretestScore(dataSending) {
    console.log(dataSending);
    var iTrainingId = dataSending.iTrainingId;
    var iScore_info = JSON.parse(dataSending.score_info)
    console.log(JSON.parse(dataSending.score_info));
    var len = iScore_info.length;

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS participant_scores');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS participant_scores (iParticipant_scoreId integer primary key AUTOINCREMENT, iParticipantId integer , iTrainingId integer , eTestType  text, fFinalScore text,fAverage integer , eStatus text,score_info text )');

        tx.executeSql('CREATE TABLE IF NOT EXISTS participant (iParticipantId integer primary key AUTOINCREMENT, name text,mobile_number integer,email text,organization text,state_id text,city_id text,iTrainingId text,pretest text DEFAULT NULL ,present text DEFAULT NULL ,posttest text DEFAULT NULL ,Feedbackone text,Feedbacktwo text,device_type text,device_token text)');



        if (len && len > 0) {
            for (var i = 0; i < len; i++) {
                console.log(dataSending);

                console.log("UPDATE participant SET pretest=? where iParticipantId=?", [iScore_info[i].fFinalScore, iScore_info[i].iParticipantId]);

                tx.executeSql("UPDATE participant SET pretest=? where iParticipantId=?", [iScore_info[i].fFinalScore, iScore_info[i].iParticipantId], function(tx, res) {



                    //getHomePage();

                    // offlineGetCurrentRunningBatch();
                }, function(e) {
                    SpinnerPlugin.activityStop();
                    navigator.notification.alert(e.message);
                    console.log("ERROR: " + e.message);
                });


            }
            navigator.notification.alert("Score submited successfully.");
        }


        var dataSending1 = {
            "data": dataSending,
            "url": base_url + "submitscores",
            "type": "POST",
            "ordertype": "3",
            "headers": {
                "X-Api-Key": localStorage.getItem("auth_key"),
            }
        }
        insertPostRequestDB(dataSending1);
    });
}

function offlineSubmitPosttestScore(dataSending) {
    console.log(dataSending);
    var iTrainingId = dataSending.iTrainingId;

    var iScore_info = JSON.parse(dataSending.score_info)
    console.log(JSON.parse(dataSending.score_info));
    var len = iScore_info.length;
    console.log(len);
    //var participant_id = dataSending.score_info.iParticipantId;
    //     console.log(participant_id);
    //console.log(localStorage.getItem(res.data[0].dStartdate));

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS participant_scores');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS participant_scores (iParticipant_scoreId integer primary key AUTOINCREMENT, iParticipantId integer , iTrainingId integer , eTestType  text, fFinalScore text,fAverage integer , eStatus text,score_info text )');

        tx.executeSql('CREATE TABLE IF NOT EXISTS participant (iParticipantId integer primary key AUTOINCREMENT, name text,mobile_number integer,email text,organization text,state_id text,city_id text,iTrainingId text,pretest text DEFAULT NULL ,present text DEFAULT NULL ,posttest text DEFAULT NULL ,Feedbackone text,Feedbacktwo text,device_type text,device_token text)');



        if (len && len > 0) {
            for (var i = 0; i < len; i++) {
                console.log(dataSending);

                //console.log("INSERT INTO participant_scores (iTrainingId,eTestType,score_info ,iParticipantId) VALUES (?,?,?,?)", [dataSending.iTrainingId, dataSending.eTestType, dataSending.score_info[i].fFinalScore, dataSending.score_info[i].iParticipantId]);

                tx.executeSql("UPDATE participant SET posttest=?,Feedbackone=?,Feedbacktwo=? where iParticipantId=?", [iScore_info[i].fFinalScore, iScore_info[i].Feedbackone, iScore_info[i].Feedbacktwo, iScore_info[i].iParticipantId], function(tx, res) {



                    //getHomePage();

                    // offlineGetCurrentRunningBatch();
                }, function(e) {
                    SpinnerPlugin.activityStop();
                    navigator.notification.alert(e.message);
                    //console.log("ERROR: " + e.message);
                });
            }
            navigator.notification.alert("Score submited successfully.");
        }
        var dataSending1 = {
            "data": dataSending,
            "url": base_url + "submitscores",
            "type": "POST",
            "ordertype": "6",
            "headers": {
                "X-Api-Key": localStorage.getItem("auth_key"),
            }
        }
        insertPostRequestDB(dataSending1);
    });
}

function submitPretestScore(dataSending) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    console.log(dataSending);
    $.ajax({
        type: "POST",
        url: base_url + "submitscores",
        timeout: 60000,
        data: dataSending,
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
                getHomePage();
                navigator.notification.alert("Score submited successfully.");
            } else {
                navigator.notification.alert("Error");
            }
            SpinnerPlugin.activityStop();
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

function getStatesEnroll() {
    if (flag == false) {
        var d = CryptoJS.AES.decrypt(localStorage.getItem("getStates"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
        var res = JSON.parse(d);

        var html = "";
        if (res.status === 0) {
            html = "<option value='SELECT STATE'>Select State</option>";
            res.data.forEach(function(res1, index) {
                if (res1.vState == localStorage.getItem("userState")) {
                    html += "<option value='" + res1.iStateId + "' selected>" + res1.vState + "</option>";
                } else {
                    html += "<option value='" + res1.iStateId + "'>" + res1.vState + "</option>";
                }

            });
            $("#listBox_state").html(html);
        } else {
            html = "<option value='SELECT STATE'>Select State</option>";
            $("#listBox_state").html(html);
        }
        return true;
    }
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
            var design = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
            localStorage.setItem("getStates", design);
            var html = "";
            if (res.status === 0) {
                html = "<option value='SELECT STATE'>Select State</option>";
                res.data.forEach(function(res1, index) {
                    if (res1.vState == localStorage.getItem("userState")) {
                        html += "<option value='" + res1.iStateId + "' selected>" + res1.vState + "</option>";
                    } else {
                        html += "<option value='" + res1.iStateId + "'>" + res1.vState + "</option>";
                    }

                });
                $("#listBox_state").html(html);
            } else {
                html = "<option value='SELECT STATE'>Select State</option>";
                $("#listBox_state").html(html);
            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

var getCityEnroll = function(cityId) {
    var userdetails = {
        "state_id": cityId
    }
    if (flag == false) {
        offlineGetCityList(userdetails);
        return true;
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
                $("#listBox_city").html(html);
                //  $("#secondlist_inside").html(html);
            } else {
                html = "<option value='SELECT CITY'>Select District</option>";
                $("#listBox_city").html(html);
                //  $("#secondlist_inside").html(html);
            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}
var getCityLists = function() {


    $.ajax({
        type: "GET",
        url: base_url + "cities",
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
                offlineGetCityListInsert(res);
            } else {

            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

$("#listBox_state").change(function(e) {
    console.log(this);
    console.log(e);
    var a = $(this).val();
    getCityEnroll(a);
});

$(".listBox_state_list").change(function(e) {
    console.log(this);
    console.log(e);
    var a = $(this).val();
    getCityEnroll(a);
});

function getDesignationProfileEdit() {
    if (flag == false) {
        var d = CryptoJS.AES.decrypt(localStorage.getItem("getDesign"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
        var res = JSON.parse(d);

        var html = "";
        if (res.status === 0) {
            html = "<option value='Select Designation'>Select Organization/Designation</option>";
            res.data.forEach(function(res1, index) {
                /* html += "<option value='"+res1.vName+"'>"+res1.vName+"</option>";*/
                html += "<option value='" + res1.vName + "'>" + res1.vName + "</option>";
            });
            $("#enroll_user_organization").html(html);
            //  $("#secondlist_inside").html(html);
        } else {
            html = "<option value='Select Designation'>Select Organization/Designation</option>";
            $("#enroll_user_organization").html(html);
            //  $("#secondlist_inside").html(html);
        }
        return true;
    }
    $.ajax({
        type: "GET",
        url: "http://sbmgkrc.in/api/service/getdepartments",
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
            var design = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
            localStorage.setItem("getDesign", design);

            //insertDesignation(res);
            var html = "";
            if (res.status === 0) {
                html = "<option value='Select Designation'>Select Organization/Designation</option>";
                res.data.forEach(function(res1, index) {
                    /* html += "<option value='"+res1.vName+"'>"+res1.vName+"</option>";*/
                    html += "<option value='" + res1.vName + "'>" + res1.vName + "</option>";
                });
                $("#enroll_user_organization").html(html);
                //  $("#secondlist_inside").html(html);
            } else {
                html = "<option value='Select Designation'>Select Organization/Designation</option>";
                $("#enroll_user_organization").html(html);
                //  $("#secondlist_inside").html(html);
            }

        },
        error: function(xhr, status, err) {
            errorHandler(xhr, status, err);
        }
    });
}


function generateFeedback(fb1, fb2) {
    if (fb1 == 1) {
        $(document).find("#lp1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp2").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp3").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-1", "1");

    } else if (fb1 == 2) {
        $(document).find("#lp1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp3").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-1", "2");
    } else if (fb1 == 3) {
        $(document).find("#lp1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#lp5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-1", "3");
    } else if (fb1 == 4) {
        $(document).find("#lp1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp4").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-1", "4");
    } else if (fb1 == 5) {
        $(document).find("#lp1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp4").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#lp5").removeClass("fa-star-o").addClass("fa-star");
        localStorage.setItem("feedback-1", "5");
    }
    if (fb2 == 1) {
        $(document).find("#rt1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt2").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt3").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-2", "1");
    } else if (fb2 == 2) {
        $(document).find("#rt1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt3").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-2", "2");
    } else if (fb2 == 3) {
        $(document).find("#rt1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt4").removeClass("fa-star").addClass("fa-star-o");
        $(document).find("#rt5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-2", "3");
    } else if (fb2 == 4) {
        $(document).find("#rt1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt4").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt5").removeClass("fa-star").addClass("fa-star-o");
        localStorage.setItem("feedback-2", "4");
    } else if (fb2 == 5) {
        $(document).find("#rt1").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt2").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt3").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt4").removeClass("fa-star-o").addClass("fa-star");
        $(document).find("#rt5").removeClass("fa-star-o").addClass("fa-star");
        localStorage.setItem("feedback-2", "5");
    }


    $("#feedback_popup").show();
}

function insertDesignation(res) {

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS insert_post_request');
        tx.executeSql('CREATE TABLE IF NOT EXISTS insert_post_request (designation_id integer primary key AUTOINCREMENT,iRef_org_deptId integer ,eStatus text ,vName text )');
        tx.executeSql("INSERT INTO insert_post_request (iRef_org_deptId,eStatus,vName) VALUES(?,?,?)", [res.iRef_org_deptId, res.eStatus, res.vName], function(tx, result) {
                console.log("insertId: " + result.insertId + " -- probably 1");




            },

            function(e) {
                console.log("ERROR: " + e.message);
            });
    })
}

function offlineGetCityListInsert(res) {

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);

    console.log(res.data.length);

    db.transaction(function(tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS state_distict_subdistict (districtId integer primary key AUTOINCREMENT,iStateDistictSubdistictId integer,vName text ,iParantId text,vPinCode text)');


        if (res.data.length > 0) {


            for (var i = 0; i < res.data.length; i++) {
                // console.log("INSERT INTO state_distict_subdistict (iStateDistictSubdistictId,vName,iParantId,vPinCode) VALUES(?,?,?,?)", [res.data[i].city_id, res.data[i].name, res.data[i].iParantId, res.data[i].vPinCode]);



                tx.executeSql("INSERT INTO state_distict_subdistict (iStateDistictSubdistictId,vName,iParantId,vPinCode) VALUES(?,?,?,?)", [res.data[i].city_id, res.data[i].name, res.data[i].iParantId, res.data[i].vPinCode], function(tx, result) {

                        //console.log("updated: " + res.insertId + " -- probably 1");



                    },
                    function(e) {
                        console.log("ERROR: " + e.message);
                    });
            }

        } else {
            return true;
        }


    })


}

function offlineGetCityList(userdetails) {
    console.log(userdetails);


    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);



    db.transaction(function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS training_activity');

        // tx.executeSql('CREATE TABLE IF NOT EXISTS participant_dates (iParticipantId integer primary key' +
        //     ' AUTOINCREMENT, participant_dates date DEFAULT NULL,fee text,invalue text,status' +
        //     ' text,test text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS state_distict_subdistict (districtId integer primary key AUTOINCREMENT,iStateDistictSubdistictId integer,vName text ,iParantId text,vPinCode text)');
        //console.log('SELECT * FROM state_distict_subdistict where iParantId=?', [userdetails.state_id]);
        tx.executeSql('SELECT * FROM state_distict_subdistict where iParantId=?', [userdetails.state_id], function(tx, results) {


            var len = results.rows.length;
            console.log(results);
            console.log(len);

            if (len > 0) {
                html = "<option value='SELECT CITY'>Select District</option>";
                for (var i = 0; i < len; i++) {
                    var res1 = results.rows.item(i);


                    html += "<option value='" + res1.iStateDistictSubdistictId + "'>" + res1.vName + "</option>";

                }
                $("#listBox_city").html(html);
                //  $("#secondlist_inside").html(html);
            } else {
                html = "<option value='SELECT CITY'>Select District</option>";
                $("#listBox_city").html(html);
                //  $("#secondlist_inside").html(html);
            }

        });

    })
}