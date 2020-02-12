$(function() {

    $(document)
        .on("click", "#home_side_click", function(e) {
            getHomePage();
        });

    $(document).on("click", "#attendance_back", function(e) {
        getHomePage();
    })

    $(document).on("click", ".schedule_click", function(e) {
        getUpcomingSchedulesList();
    });

    $(document).on("click", "#scheduled_training", function(e) {
        if (flag == false) {


            navigator.notification.alert("Cannot Connect To Internet.Please Check Your Connection Settings And Try Again");
        }

        getUpcomingSchedulesList();
    });

    $(document).on("click", ".completed_click", function(e) {
        getCompletedList();
    });

    $(document).on("click", "#completed_training", function(e) {
        if (flag == false) {


            navigator.notification.alert("Cannot Connect To Internet.Please Check Your Connection Settings And Try Again");
        } else {
            getCompletedList();
        }

    });

    $(document).on("click", "#completed_back", function(e) {
        getHomePage();
    });

    $(document).on("click", "#scheduled_back", function(e) {
        getHomePage();
    });
    $(document).on("click", "#offline_sync", function(e) {
        send_request_params();
    });

    $(document).on("click", "#start_training_home", function(e) {
        $("#training_id_popup").val($(this).data("training"));
        console.log(flag);
        if (flag == false) {


            navigator.notification.confirm("You are offline. Do you wish you to start the Training in Offline Mode?", confirmCallback)
            return true;
        } else {

            $("#online-offline").show();
        }
    });

    $(document).on("click", "#close_online_cross", function() {
        $("#online-offline").hide();
        $("#radio_1").prop('checked', false)
        $("#radio_2").prop('checked', false)
    });

    $(document).on("click", "#submit_course_mode", function(e) {
        var a = $("#radio_1").is(":checked");
        var b = $("#radio_2").is(":checked");
        var training_id = $("#training_id_popup").val();
        var data_sending = "";
        if (a) {
            data_sending = {
                "eTrainingMode": "Online",
                "iTrainingId": training_id
            }

        } else if (b) {
            data_sending = {
                "eTrainingMode": "Offline",
                "iTrainingId": training_id
            }
        }
        $("#online-offline").hide();
        startBatchProcess(data_sending);
    })

    /*$(document).on("click","#online-offline",function(e){
		$("#online-offline").hide();
	})*/

})
var res = "";
var getHomePage = function() {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    displayDOM(elements_divs, elements_divs.$homeScreen);
    window
        .plugins
        .nativepagetransitions
        .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
            function(msg) {
                console.log("error: " + msg)
            } // called in case you pass in weird values
        );

    if (flag == false) {
        console.log("ajlkdhasgkhkfsugjnhukj");
        offlineGetCurrentRunningBatch();
        // insertPostRequestDB()
        return true;
    }


    $.ajax({
        type: "GET",
        url: base_url + "getuserTraining",
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key")
        },

        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res);

if (res.status === 7) {
var html = "<div class='col-xs-12 main-area'>   <div class='no-traing-block'>        <p clas" +
                        "s='no-traing-block-icon'>            <img src='images/no-training-icon.png'><br>" +
                        " No ongoing training available        </p>    </div></div>";
                    $("#home_page_content").html(html);
                     SpinnerPlugin.activityStop();

}else if (res.status === 0) {
                console.log(res);
                var a = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
                localStorage.setItem("res", a);

                var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
                var res = JSON.parse(d);
                console.log(res);
                console.log(res.data[0].dStartdate);

                var iTrainingId = res.data[0].iTrainingId;
                // localStorage.setItem("dStartdate", res.data[0].dStartdate);
                // localStorage.setItem("dEnddate", res.data[0].dEnddate);
                console.log(res.data[0].eTrainingMode);

                if (res.status === 0) {
                    insertDB(res);
                    var html = "";
                    if (res.data[0].eTrainingMode == "Pending") {
                        html += "<div class='col-xs-12 main-area' >     <div class='index-data'>        <div clas" +
                            "s='index-data-row'>           <h1><img src='images/current-training-icon.png'>Cu" +
                            "rrent Training</h1>           <p><img src='images/programname-icon.png'>Enrollme" +
                            "nt ID</p>           <h2 id='program_name_homepage'>" + res.data[0].vUniqueCode + "</h2>           <p><img src='images/programname-icon.png'>Program Name</p>      " +
                            "     <h2 id='program_name_homepage'>" + res.data[0].vTrainingName + "</h2>           <p><img src='images/krc-name-icon.png'>KRC Name</p>           <h" +
                            "3 id='program_address_homepage'>" + res.data[0].KRC_name + "</h3>           <p><img src='images/map-1.png'>Location</p>           <h3 id='pr" +
                            "ogram_address_homepage'>" + res.data[0].vDistrict + "," + res.data[0].vState + "</h3>           <p><img src='images/date-icon.png'>From Date</p>           <h4 i" +
                            "d='program_start_homepage'>" + getFormattedDate(res.data[0].dStartdate) + "</h4>           <p><img src='images/date-icon.png'>To Date</p>           <h4 id=" +
                            "'program_end_homepage'>" + getFormattedDate(res.data[0].dEnddate) + "</h4>        </div>        <p class='trainer-font'><img src='images/master-train" +
                            "er-icon.png'>Master Trainer</p>        <div class='trainer-row' id='master_train" +
                            "er'><img src='images/profile-img.png'>" + res.data[0].vName + "<span id='start_training_home' data-training='" + res.data[0].iTrainingId + "'>START</span></div>        <div id='otherTrainers'></div>    </div></div>";
                        $("#home_page_content").html(html);
                        SpinnerPlugin.activityStop();
                        SpinnerPlugin.activityStop();
                    } else if (res.data[0].eTrainingMode == "Online") {
                        SpinnerPlugin.activityStop();
                        getCurrentRunningBatch();
                    } else if (res.data[0].eTrainingMode == "Offline") {
                        SpinnerPlugin.activityStop();
                        getCurrentRunningBatch();
                    }

                } else {
                    var html = "<div class='col-xs-12 main-area'>   <div class='no-traing-block'>        <p clas" +
                        "s='no-traing-block-icon'>            <img src='images/no-training-icon.png'><br>" +
                        " No ongoing training available        </p>    </div></div>";
                    $("#home_page_content").html(html);

                    SpinnerPlugin.activityStop();
                    //navigator.notification.alert(res.message); console.log(res.message);
                }
            } else {
                SpinnerPlugin.activityStop();
                //navigator.notification.alert(res.message);
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

var startBatchProcess = function(data_sending) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });



    $.ajax({
        type: "POST",
        url: base_url + "startTraing",
        timeout: 60000,
        data: data_sending,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key")
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            console.log(res);
            if (res.status === 0) {
                getCurrentRunningBatch();
                //SpinnerPlugin.activityStop();
            } else {
                localStorage.setItem("user_exist", "no");
                SpinnerPlugin.activityStop();
                navigator
                    .notification
                    .alert(res.message);
            }

        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

var getCurrentRunningBatch = function() {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });

    if (flag == false) {
        offlineGetCurrentRunningBatch();
        return true;
    }

    $.ajax({
        type: "GET",
        url: base_url + "getuserTraining",
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key")
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {


            var a = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
            localStorage.setItem("res", a);

            var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
            var res = JSON.parse(d);
            console.log(res);
            // console.log(res.data[0].dStartdate);

            //     localStorage.setItem('res', JSON.stringify(res));
            //     var res = JSON.parse(localStorage.getItem('res'));
            //     localStorage.setItem("dStartdate", res.data[0].dStartdate);
            //     localStorage.setItem("dEnddate", res.data[0].dEnddate);

            // console.log(localStorage.getItem('dStartdate'));
            // console.log(res.data[0].eTrainingMode);

            insertDB(res);

            $("#ongoing_batch_status").hide();
            if (res.status === 0) {
                $("#current_program_trainingid").text(res.data[0].vUniqueCode);
                $("#current_program_trainingname").text(res.data[0].vTrainingName);
                $("#current_program_loction").text(res.data[0].vDistrict + ", " + res.data[0].vState);
                $("#current_program_startdate").text(getFormattedDateSchedule(res.data[0].dStartdate));
                $("#current_program_enddate").text(getFormattedDateSchedule(res.data[0].dEnddate));
                $("#iTrainingId_currentprogramme").val(res.data[0].iTrainingId);
                console.log(res);
                if (res.data[0].eTrainingMode == "Offline") {
                    insertDB(res);
                    // console.log(res.data[0].eTrainingMode);
                    // localStorage.setItem('Offline', res.data[0].eTrainingMode);
                    // var Offline = localStorage.getItem('Offline');

                    //console.log(Offline );



                    generateOfflineClicks(res.list, res.days);
                    /* var html = "";
                    if(res.list.length == 1){
                        html += "<div class='programme-nav'>"+
                                "   <span id='enrollemt_click_offline' class='active'><img src='images/date.png'><br>Enroll</span>"+
                                "   <span id='pretest_click_offline'   class='active'><img src='images/date.png'><br>Pre-Test</span>"+
                                "   <span id='posttest_click_offline'  class='active'><img src='images/date.png'><br>Post-Test</span>"+
                                "   <span id='feedback_click_offline'  class='active'><img src='images/date.png'><br>Feedback</span>"+
                                "</div>";
                        $("#current_batch_setup_for_offline").html(html);
                    }else if(res.list.length > 1 && res.list.length <=2 ){

                    }else if(res.list.length >= 3){

                    }*/

                } else if (res.data[0].eTrainingMode == "Online") {}

                res
                    .list
                    .forEach(function(data, index) {
                        var GivenDate = data.date;
                        var newGivenDate = new Date("" + GivenDate + "");
                        var currentdate = new Date();
                        if (newGivenDate.getDate() == currentdate.getDate()) {
                            if (index === (res.list.length - 1)) {
                                $("#current_program_last").html("Take a picture of the batch and submit to end training.");
                                $("#current_program_last").data("check", "endday");
                            } else {
                                $("#current_program_last").html("Take a Picture of the batch including you during the program.");
                                $("#current_program_last").data("check", "not endday");
                            }
                            $("#ongoing_batch_status").show();
                            $("#ongoing_day_count").html("Day " + (index + 1) + " of " + res.list.length);
                            $("#ongoing_date_display").html(getFormattedDateSchedule_onlytoday1(GivenDate));
                            $("#iTrainingDate_currentprogramme").val(GivenDate);
                            if (data.status == null) {
                                //attendnc activate attendnc
                                $("#attendance_whiteform").removeClass("white-transformbg");
                                $("#ongoing_markattenedance").addClass("click-action-for-event");
                            } else if (data.status == "B1") {
                                // selfi one activate attendnc
                                // $("#attendance_whiteform").addClass("white-transformbg");
                                // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                                // activate
                                $("#attendance_whiteform").removeClass("white-transformbg");
                                $("#ongoing_markattenedance").addClass("click-action-for-event");
                                //selfione
                                $("#selfi_one_whiteform").removeClass("white-transformbg");
                                $("#ongoing_take_selfi_one").addClass("click-action-for-event");

                            } else if (data.status == "B2") {
                                // selfi two activate attendnc
                                // $("#attendance_whiteform").addClass("white-transformbg");
                                // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                                // activate
                                $("#attendance_whiteform").removeClass("white-transformbg");
                                $("#ongoing_markattenedance").addClass("click-action-for-event");
                                //selfione
                                $("#selfi_one_whiteform").addClass("white-transformbg");
                                $("#ongoing_take_selfi_one").removeClass("click-action-for-event");
                                //selfitwo
                                $("#selfi_two_whiteform").removeClass("white-transformbg");
                                $("#ongoing_take_selfi_two").addClass("click-action-for-event");
                            } else if (data.status == "B3") {
                                // all status completed
                                // $("#attendance_whiteform").addClass("white-transformbg");
                                // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                                // activate
                                $("#attendance_whiteform").removeClass("white-transformbg");
                                $("#ongoing_markattenedance").addClass("click-action-for-event");
                                //selfione
                                $("#selfi_one_whiteform").addClass("white-transformbg");
                                $("#ongoing_take_selfi_one").removeClass("click-action-for-event");
                                //selfitwo
                                $("#selfi_two_whiteform").addClass("white-transformbg");
                                $("#ongoing_take_selfi_two").removeClass("click-action-for-event");
                            }
                        }
                    });

                displayDOM(elements_divs, elements_divs.$CurrentProgram);
                window
                    .plugins
                    .nativepagetransitions
                    .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
                        function(msg) {
                            console.log("error: " + msg)
                        } // called in case you pass in weird values
                    );
                SpinnerPlugin.activityStop();
            } else {


                localStorage.setItem("user_exist", "no");
                SpinnerPlugin.activityStop();
                // navigator
                //     .notification
                //     .alert(res.message);
            }

        },
        error: function(xhr, status, err) {


            ErrorHandler(xhr, status, err)
        }
    });
}

var getUpcomingSchedulesList = function() {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var datasending = {
        "limit": 15,
        "offset": 0
    }
    $.ajax({
        type: "POST",
        url: base_url + "getuserTrainingUpcoming",
        timeout: 60000,
        data: datasending,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key")
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            var html = "";
            if (res.status === 0) {
                if (res.data.length > 0) {
                    res
                        .data
                        .forEach(function(data, index) {
                            console.log(data);
                            html += "<div class='completed-scheduled-row'><h1>" + data.vUniqueCode + "</h1><h2>" + data.vTrainingName + "</h2><h3><img src='images/location-map.png'>" + res.data[0].vDistrict + "," + res.data[0].vState + "</h3><h3><img src='images/calender-icon.png'>" + getFormattedDateSchedule_onlytoday(data.dStartdate) + " - " + getFormattedDateSchedule_onlytoday(data.dEnddate) + "</h3></div>";
                        });
                    $("#scheduled_records").html(html);
                    displayDOM(elements_divs, elements_divs.$ScheduledPrograms);
                    window
                        .plugins
                        .nativepagetransitions
                        .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
                            function(msg) {
                                console.log("error: " + msg)
                            } // called in case you pass in weird values
                        );
                    SpinnerPlugin.activityStop();
                } else {
                    SpinnerPlugin.activityStop();
                }
            } else {
                SpinnerPlugin.activityStop();
                navigator
                    .notification
                    .alert(res.message);
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

var getCompletedList = function() {

    if (flag == false) {
        offlineGetCompletedList();

        return true;
    }
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var datasending = {
        "limit": 15,
        "offset": 0
    }
    $.ajax({
        type: "POST",
        url: base_url + "getuserTrainingCompleted",
        timeout: 60000,
        data: datasending,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key")
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
           console.log(res);
                var a = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
                localStorage.setItem("res", a);

                var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
                var res = JSON.parse(d);
                console.log(res);
            var html = "";
            if (res.status === 0) {
                var html = ""
                if (res.data.length > 0) {
                    res
                        .data
                        .forEach(function(data, index) {
                            console.log(data);
                            html += "<div class='completed-scheduled-row'><h1>" + data.vUniqueCode + "</h1><h2>" + data.vTrainingName + "</h2><h3><img src='images/location-map.png'>" + data.vDistrict + "," + data.vState + "</h3><h3><img src='images/calender-icon.png'>" + getFormattedDateSchedule_onlytoday(data.dStartdate) + " - " + getFormattedDateSchedule_onlytoday(data.dEnddate) + "</h3></div>";
                        });
                    if (localStorage.getItem("req_parm_len") > 0) {

                        html += "<div class='offline_sync-row' id='offline_sync'><span  >Sync</span></div>";

                    } else {
                        html += "<div class='offline_sync-row disabledbutton'  disabled><span  >synchronized</span></div>";


                    }

                    $("#completed_records").html(html);
                    displayDOM(elements_divs, elements_divs.$CompletedPrograms);
                    window
                        .plugins
                        .nativepagetransitions
                        .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
                            function(msg) {
                                console.log("error: " + msg)
                            } // called in case you pass in weird values
                        );
                } else {}

                SpinnerPlugin.activityStop();
            } else {
                SpinnerPlugin.activityStop();
                navigator
                    .notification
                    .alert(res.message);
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });
}

function getFormattedDateSchedule(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)\ (.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3, p4, p5, p6) {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
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
        date_string = p3 + " " + months[(p2 - 1)] + " " + p1;
    });
    return date_string;
}

function getFormattedDateSchedule_onlytoday(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)\ (.*?)\:(.*?)\:(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3) {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        var time = "";
        date_string = p3 + " " + months[(p2 - 1)] + " " + p1;
    });
    return date_string;
}

function getFormattedDateSchedule_onlytoday1(input) {
    var date_string;
    var pattern = /(.*?)\-(.*?)\-(.*?)$/;
    var result = input.replace(pattern, function(match, p1, p2, p3) {
        var months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        var time = "";
        date_string = p3 + " " + months[(p2 - 1)] + " " + p1;
    });
    return date_string;
}

function generateOfflineClicks(res, days) {
    console.log(res.length);

    if (res.length == 1) {
        $("#current_batch_setup_for_offline").html("");
        var html = "";
        html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
            "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
            "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span id='post" +
            "test_click_offline'  class='active'><img src='images/date.png'><br>Post-Test</sp" +
            "an>   <span id='feedback_click_offline'  class='active'><img src='images/date.pn" +
            "g'><br>Feedback</span></div>";
        $("#current_batch_setup_for_offline").html(html);
    } else if ((res.length == 2)) {
        var html = "";
        if (flag == false) {



            for (var index = 0; index < res.length; index++) {

                if (days == 1) {
                    $("#current_batch_setup_for_offline").html("");
                    console.log("2day1 " + days)
                    html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                        "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                        "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span style='o" +
                        "pacity:0.2'  class='active'><img src='images/date.png'><br>Post-Test</span>   <s" +
                        "pan style='opacity:0.2'  class='active'><img src='images/date.png'><br>Feedback<" +
                        "/span></div>";
                    $("#current_batch_setup_for_offline").html(html);
                } else if (days == 2) {
                    $("#current_batch_setup_for_offline").html("");
                    console.log("2day2 " + days)
                    html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                        "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                        "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span id='post" +
                        "test_click_offline'  class='active'><img src='images/date.png'><br>Post-Test</sp" +
                        "an>   <span id='feedback_click_offline'  class='active'><img src='images/date.pn" +
                        "g'><br>Feedback</span></div>";
                    $("#current_batch_setup_for_offline").html(html);
                }
            };
        } else {
            res.forEach(function(data, index) {

                if (days == 1) {
                    $("#current_batch_setup_for_offline").html("");
                    console.log("2day1 " + days)
                    html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                        "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                        "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span style='o" +
                        "pacity:0.2'  class='active'><img src='images/date.png'><br>Post-Test</span>   <s" +
                        "pan style='opacity:0.2'  class='active'><img src='images/date.png'><br>Feedback<" +
                        "/span></div>";
                    $("#current_batch_setup_for_offline").html(html);
                } else if (days == 2) {
                    $("#current_batch_setup_for_offline").html("");
                    console.log("2day2 " + days)
                    html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                        "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                        "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span id='post" +
                        "test_click_offline'  class='active'><img src='images/date.png'><br>Post-Test</sp" +
                        "an>   <span id='feedback_click_offline'  class='active'><img src='images/date.pn" +
                        "g'><br>Feedback</span></div>";
                    $("#current_batch_setup_for_offline").html(html);
                }
            });
        }
    } else if (res.length >= 3) {
        console.log(res.length);
        console.log(days);
        var html = "";
        if (days == 1) {
            $("#current_batch_setup_for_offline").html("");
            html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span style='o" +
                "pacity:0.2'  class='active'><img src='images/date.png'><br>Post-Test</span>   <s" +
                "pan style='opacity:0.2'  class='active'><img src='images/date.png'><br>Feedback<" +
                "/span></div>";
            $("#current_batch_setup_for_offline").html(html);
        } else if (days == 2) {
            $("#current_batch_setup_for_offline").html("");
            html = "<div class='programme-nav'>   <span id='enrollemt_click_offline' class='active'>" +
                "<img src='images/date.png'><br>Enroll</span>   <span id='pretest_click_offline' " +
                "  class='active'><img src='images/date.png'><br>Pre-Test</span>   <span style='o" +
                "pacity:0.2'  class='active'><img src='images/date.png'><br>Post-Test</span>   <s" +
                "pan style='opacity:0.2'  class='active'><img src='images/date.png'><br>Feedback<" +
                "/span></div>";
            $("#current_batch_setup_for_offline").html(html);
        } else if (res.length == days) {
            $("#current_batch_setup_for_offline").html("");
            html = "<div class='programme-nav'>   <span style='opacity:0.2' class='active'><img src=" +
                "'images/date.png'><br>Enroll</span>   <span style='opacity:0.2' class='active'><" +
                "img src='images/date.png'><br>Pre-Test</span>   <span id='posttest_click_offline" +
                "'  class='active'><img src='images/date.png'><br>Post-Test</span>   <span id='fe" +
                "edback_click_offline'  class='active'><img src='images/date.png'><br>Feedback</s" +
                "pan></div>";
            $("#current_batch_setup_for_offline").html(html);
        } else {
            $("#current_batch_setup_for_offline").html("");
            html = "<div class='programme-nav'>   <span style='opacity:0.2' class='active'><img src=" +
                "'images/date.png'><br>Enroll</span>   <span style='opacity:0.2' class='active'><" +
                "img src='images/date.png'><br>Pre-Test</span>   <span style='opacity:0.2'  class" +
                "='active'><img src='images/date.png'><br>Post-Test</span>   <span style='opacity" +
                ":0.2'  class='active'><img src='images/date.png'><br>Feedback</span></div>";
            $("#current_batch_setup_for_offline").html(html);
        }
    }

}

function insertDB(res) {


    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);



    db.transaction(function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS training_activity');

        // tx.executeSql('CREATE TABLE IF NOT EXISTS participant_dates (iParticipantId integer primary key' +
        //     ' AUTOINCREMENT, participant_dates date DEFAULT NULL,fee text,invalue text,status' +
        //     ' text,test text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS training_activity (tAttendanceId integer primary key AUTOINCREMENT,iTrainingId integer ,iMtrainerId integer,session_date date  ,dAddedOn date  ,take_selfie BLOB ,batch_picture BLOB , participant_dates date ,fee text,invalue text,status text ,test text ,vUniqueCode text ,vTrainingName text ,dStartdate date ,dEnddate date ,vState text,vDistrict text,days integer,eTrainingMode text)');

        tx.executeSql('SELECT * FROM training_activity where iTrainingId=?', [res.data[0].iTrainingId], function(tx, results) {
            var reslen = results.rows.length;
            var len = res.list.length;
            console.log(results.rows.length);

            if (reslen > 0) {
                console.log("updated");

                for (var i = 0; i < len; i++) {



                    tx.executeSql("UPDATE training_activity SET dStartdate=? ,dEnddate=?,vTrainingName=?,days=?,status=?,test=?,vState=?,vDistrict=? ,eTrainingMode=? where iTrainingId=?", [res.data[0].dStartdate, res.data[0].dEnddate, res.data[0].vTrainingName, res.days, res.list[i].status, res.list[i].test, res.data[0].vState, res.data[0].vDistrict, res.data[0].eTrainingMode, res.data[0].iTrainingId], function(tx, res) {

                            // console.log("insertId: " + res + " -- probably 1");

                        },
                        function(e) {
                            console.log("ERROR: " + e.message);
                        });
                }
            } else {
                console.log("inserted");


                for (var i = 0; i < len; i++) {



                    tx.executeSql("INSERT INTO training_activity (iTrainingId,dAddedOn,participant_dates,fee,invalue,status,test,vUniqueCode,vTrainingName ,dStartdate ,dEnddate,vState,vDistrict,days,eTrainingMode) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [res.data[0].iTrainingId, res.data[0].dAddedDate, res.list[i].date, res.list[i].fee, res.list[i].in, res.list[i].status, res.list[i].test, res.data[0].vUniqueCode, res.data[0].vTrainingName, res.data[0].dStartdate, res.data[0].dEnddate, res.data[0].vState, res.data[0].vDistrict, res.days, res.data[0].eTrainingMode], function(tx, result) {

                            console.log("insertId: " + res.insertId + " -- probably 1");

                        },
                        function(e) {
                            console.log("ERROR: " + e.message);
                        });
                }
            }

        });

    })
}

function insertPostRequestDB(dataSending) {

    var iTrainingId = dataSending.data.iTrainingId;
    var data1 = JSON.stringify(dataSending.data);

    var headers1 = JSON.stringify(dataSending.headers);
    var authKey = localStorage.getItem("auth_key"); // Object { id: "007", name: "James Bond" }
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        // tx.executeSql('DROP TABLE IF EXISTS insert_post_request');
        tx.executeSql('CREATE TABLE IF NOT EXISTS insert_post_request (requestId integer primary key AUTOINCREMENT,iTrainingId integer ,url text ,parameters text , header text,status text ,dStartdate date ,eTrainingMode text,type text,authKey text ,ordertype text)');
        tx.executeSql("INSERT INTO insert_post_request (iTrainingId,url,parameters,header,type,status,authKey,ordertype) VALUES(?,?,?,?,?,?,?,?)", [dataSending.data.iTrainingId, dataSending.url, data1, headers1, dataSending.type, "0", authKey, dataSending.ordertype], function(tx, result) {
                console.log("insertId: " + result.insertId + " -- probably 1");
                if (flag == false) {
                    offlineGetCurrentRunningBatch();

                } else {
                    getCurrentRunningBatch();
                }



            },

            function(e) {
                console.log("ERROR: " + e.message);
            });
    })
}
var offlineGetCurrentRunningBatch = function() {
    var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
    var dStartdate = JSON.parse(d);
    console.log(dStartdate);
    // console.log(res.data[0].dStartdate);

    var date = new Date(dStartdate.data[0].dStartdate);

    var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();



    var dateFrom = new Date(dStartdate.data[0].dStartdate);
    var dateFrom1 = (dateFrom.getMonth() + 1) + '/' + dateFrom.getDate() + '/' + dateFrom.getFullYear();
    var dateTo = new Date(dStartdate.data[0].dEnddate);
    var dateTo1 = (dateTo.getMonth() + 1) + '/' + dateTo.getDate() + '/' + dateTo.getFullYear();
    var dateCheck = dateString;
    var d1 = dateFrom1.split("/");
    var d2 = dateTo1.split("/");
    var c = dateCheck.split("/");
    var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);
    var check_currentdate = (check >= from && check <= to);
    console.log(check_currentdate);
    // localStorage.setItem("check_currentdate", check_currentdate);
    // var check_currentday = localStorage.getItem("check_currentdate");

    // console.log(check_currentday);

    if (check_currentdate == true) {

        var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
        db.transaction(function(tx) {

            tx.executeSql('SELECT * FROM training_activity where iTrainingId=?', [dStartdate.data[0].iTrainingId], function(tx, res) {
                // tx.executeSql('SELECT * FROM training_activity where participant_dates=?', [dateString])

                console.log(res.rows[0]);

                $("#ongoing_batch_status").hide();

                $("#current_program_trainingid").text(res.rows[0].vUniqueCode);
                $("#current_program_trainingname").text(res.rows[0].vTrainingName);
                $("#current_program_loction").text(res.rows[0].vDistrict + ", " + res.rows[0].vState);
                $("#current_program_startdate").text(getFormattedDateSchedule(res.rows[0].dStartdate));
                $("#current_program_enddate").text(getFormattedDateSchedule(res.rows[0].dEnddate));
                $("#iTrainingId_currentprogramme").val(res.rows[0].iTrainingId);
                if (res.rows[0].eTrainingMode == "Offline") {
                    // insertDB(res);



                    generateOfflineClicks(res.rows, res.rows[0].days);


                }

                var len = res.rows.length;

                for (var index = 0; index < len; index++) {
                    var data = res.rows.item(index);
                    // console.log(data);
                    var GivenDate = data.participant_dates;
                    var newGivenDate = new Date("" + GivenDate + "");
                    var currentdate = new Date();
                    if (newGivenDate.getDate() == currentdate.getDate()) {
                        console.log(newGivenDate);
                        if (index === (res.rows.length - 1)) {


                            $("#current_program_last").html("Take a picture of the batch and submit to end training.");
                            $("#current_program_last").data("check", "endday");
                        } else {

                            $("#current_program_last").html("Take a Picture of the batch including you during the program.");
                            $("#current_program_last").data("check", "not endday");
                        }
                        $("#ongoing_batch_status").show();
                        $("#ongoing_day_count").html("Day " + (index + 1) + " of " + res.rows.length);
                        $("#ongoing_date_display").html(getFormattedDateSchedule_onlytoday1(GivenDate));
                        $("#iTrainingDate_currentprogramme").val(GivenDate);
                        if (data.status == null) {
                            //attendnc activate attendnc
                            $("#attendance_whiteform").removeClass("white-transformbg");
                            $("#ongoing_markattenedance").addClass("click-action-for-event");
                        } else if (data.status == "B1") {
                            // selfi one activate attendnc
                            // $("#attendance_whiteform").addClass("white-transformbg");
                            // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                            // activate
                            $("#attendance_whiteform").removeClass("white-transformbg");
                            $("#ongoing_markattenedance").addClass("click-action-for-event");
                            //selfione
                            $("#selfi_one_whiteform").removeClass("white-transformbg");
                            $("#ongoing_take_selfi_one").addClass("click-action-for-event");

                        } else if (data.status == "B2") {
                            // selfi two activate attendnc
                            // $("#attendance_whiteform").addClass("white-transformbg");
                            // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                            // activate
                            $("#attendance_whiteform").removeClass("white-transformbg");
                            $("#ongoing_markattenedance").addClass("click-action-for-event");
                            //selfione
                            $("#selfi_one_whiteform").addClass("white-transformbg");
                            $("#ongoing_take_selfi_one").removeClass("click-action-for-event");
                            //selfitwo
                            $("#selfi_two_whiteform").removeClass("white-transformbg");
                            $("#ongoing_take_selfi_two").addClass("click-action-for-event");
                        } else if (data.status == "B3") {
                            // all status completed
                            // $("#attendance_whiteform").addClass("white-transformbg");
                            // $("#ongoing_markattenedance").removeClass("click-action-for-event"); attendnc
                            // activate
                            $("#attendance_whiteform").removeClass("white-transformbg");
                            $("#ongoing_markattenedance").addClass("click-action-for-event");
                            //selfione
                            $("#selfi_one_whiteform").addClass("white-transformbg");
                            $("#ongoing_take_selfi_one").removeClass("click-action-for-event");
                            //selfitwo
                            $("#selfi_two_whiteform").addClass("white-transformbg");
                            $("#ongoing_take_selfi_two").removeClass("click-action-for-event");
                        }
                    }
                };

                displayDOM(elements_divs, elements_divs.$CurrentProgram);
                window
                    .plugins
                    .nativepagetransitions
                    .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
                        function(msg) {
                            console.log("error: " + msg)
                        } // called in case you pass in weird values
                    );
                SpinnerPlugin.activityStop();



            }, null);
        });
    } else {
        console.log("no trainer records");
        SpinnerPlugin.activityStop();
    }
}

var updateProfilePicService_two = function(fileUri, params) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        "status": params.status,
        "iTrainingId": params.iTrainingId,
        "session_date": params.session_date,
    };
    options.headers = {
        "X-Api-Key": localStorage.getItem("auth_key"),
    };
    options.chunkedMode = false;
    var ft = new FileTransfer();
    console.log(options);
    ft.upload(fileUri, base_url + "uploadpic", win2, fail, options);

}

function send_request_params() {
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM insert_post_request where status=? ORDER BY ordertype=?', ["0", "ASC"], function(tx, results) {
            var reslen = results.rows.length;
            //console.log(results.rows.length);
            // console.log(results);

            if (reslen > 0) {


                for (var i = 0; i < reslen; i++) {
                    var req_data = results.rows.item(i);

                    // var object1 = req_data.header;
                    var data1 = JSON.parse(req_data.parameters);
                    // console.log(data1);


                    if (data1.fileUri) {
                        console.log(data1.fileUri);

                        insertImageRequestDB(data1);

                        db.transaction(function(tx) {
                                tx.executeSql("UPDATE insert_post_request SET status=?", ["1"], function(tx, result) {
                                        // alert('Updated successfully');


                                    },
                                    function(e) {
                                        console.log("ERROR: " + e.message);
                                    });

                            })
                            // updateProfilePicService_two(data1.image,data1);

                    } else {
                        // console.log(req_data.authKey);
                        //  console.log(req_data);
                        $.ajax({
                            type: "POST",
                            url: req_data.url,
                            data: data1,
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
                                db.transaction(function(tx) {
                                    tx.executeSql("UPDATE insert_post_request SET status=?", ["1"], function(tx, result) {
                                            // alert('Updated successfully');


                                        },
                                        function(e) {
                                            console.log("ERROR: " + e.message);
                                        });

                                })
                            },
                            error: function(xhr, status, err) {
                                ErrorHandler(xhr, status, err)
                            }
                        });
                    }
                    // console.log(ajaxSending);
                }
                //alert('Updated successfully');
            } else {
                //alert('Updated successfully');

            }

        });

    })
}

function offlineGetCompletedList() {
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM training_activity ', [], function(tx, results) {
            var reslen = results.rows.length;
            //console.log(results.rows.length);
            console.log(results);

            var html = "";

            if (reslen > 0) {


                for (var i = 0; i < reslen; i++) {
                    var data = results.rows.item(i);
                    var vDistrict = "";
                    var vState = "";
                    if (results.rows.item[0].vDistrict = null) {
                        vDistrict = "";
                    } else {
                        vDistrict = results.rows.item[0].vDistrict;

                    }
                    if (results.rows.item[0].vState = null) {
                        vState = "";
                    } else {
                        vState = results.rows.item[0].vState;

                    }


                    html += "<div class='completed-scheduled-row'><h1>" + data.vUniqueCode + "</h1><h2>" + data.vTrainingName + "</h2><h3><img src='images/location-map.png'>" + vDistrict + "," + vState + "</h3><h3><img src='images/calender-icon.png'>" + getFormattedDateSchedule_onlytoday(data.dStartdate) + " - " + getFormattedDateSchedule_onlytoday(data.dEnddate) + "</h3></div>";




                    //  var object1 = req_data.header;



                }
                $("#completed_records").html(html);

                displayDOM(elements_divs, elements_divs.$CompletedPrograms);
                window
                    .plugins
                    .nativepagetransitions
                    .slide(pageTransoptions, function(msg) {}, // called when the animation has finished
                        function(msg) {
                            console.log("error: " + msg)
                        } // called in case you pass in weird values
                    );
            } else {
                console.log("updated");

            }

        });

    })
}

function confirmCallback() {
    var training_id = $("#training_id_popup").val();
    data_sending = {
        "eTrainingMode": "Offline",
        "iTrainingId": training_id
    }

    $("#online-offline").hide();
    if (flag == false) {

        offlineStartBatchProcess(data_sending);
    } else {


        startBatchProcess(data_sending);

    }

}

function offlineStartBatchProcess(data_sending) {

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);

    console.log(data_sending);

    db.transaction(function(tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS training_activity (tAttendanceId integer primary key AUTOINCREMENT,iTrainingId integer ,iMtrainerId integer,session_date date  ,dAddedOn date  ,take_selfie BLOB ,batch_picture BLOB , participant_dates date ,fee text,invalue text,status text ,test text ,vUniqueCode text ,vTrainingName text ,dStartdate date ,dEnddate date ,vState text,vDistrict text,days integer,eTrainingMode text)');

        tx.executeSql('SELECT * FROM training_activity where iTrainingId=?', [data_sending.iTrainingId], function(tx, results) {
            var reslen = results.rows.length;

            if (reslen > 0) {


                for (var i = 0; i < reslen; i++) {



                    tx.executeSql("UPDATE training_activity SET eTrainingMode=? where iTrainingId=?", [data_sending.eTrainingMode, data_sending.iTrainingId], function(tx, result) {

                            //console.log("updated: " + res.insertId + " -- probably 1");
                            var dataSending = {
                                "data": data_sending,
                                "url": base_url + "startTraing",
                                "type": "POST",
                                "ordertype": "0",
                                "headers": {
                                    "X-Api-Key": localStorage.getItem("auth_key"),
                                }
                            }
                            insertPostRequestDB(dataSending);

                        },
                        function(e) {
                            console.log("ERROR: " + e.message);
                        });
                }

            } else {
                return true;
            }

        });

    })


}