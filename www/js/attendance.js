$(function() {
    var allVals = []; //for global check boxes
    $(document).on("click", ".click-action-for-event", function(e) {

        var thisid = $(this).attr("id");
        if (thisid == "ongoing_markattenedance") {
            $("#itrainid_for_current_program").val($("#iTrainingId_currentprogramme").val());
            $("#itrainid_date_current_program").val($("#iTrainingDate_currentprogramme").val());
            var sendingData = {
                "iTrainingId": $("#iTrainingId_currentprogramme").val(),
            }
            markAttendance(sendingData);

        } else if (thisid == "ongoing_take_selfi_one") {

            if (flag == false) {

                offlineUploadPicOne();
            } else {

                uploadPicOne();

            }

        } else if (thisid == "ongoing_take_selfi_two") {
            if (flag == false) {

                offlineUploadPicTwo();
            } else {

                uploadPicTwo();

            }

        }
    });

    $(document).on("click", "#check_all", function(e) {
        var as = $("#check_all").is(":checked");
        var check;
        if (as) {
            allVals = [];
            $(".check_all_boxes").prop('checked', true);
            $('input[name=check_all_boxes]:checked').each(function() {
                allVals.push($(this).val());
            });
            //$("#attendence_marked").text(""+allVals.length+" Selected");

        } else {
            $(".check_all_boxes").prop('checked', false);
            // $("#attendence_marked").text("0 Selected");
        }
    });



    $(document).on("click", "#mark_attendence", function(e) {
        var ipart = [];
        $('input[name=check_all_boxes]:checked').each(function() {
            ipart.push({ "iParticipantId": $(this).val(), "mobileNumber": $(this).data("mobile"), });
        });



        var dataSending = {
            "iTrainingId": $("#itrainid_for_current_program").val(),
            "iParticipantId": JSON.stringify(ipart),
            "session_date": $("#itrainid_date_current_program").val(),
        }
        console.log(dataSending);
        //sendMarkAttendance(dataSending);

        if (flag == false) {

            offlineSendMarkAttendance(dataSending);

        } else {

            sendMarkAttendance(dataSending);

        }
    });
})

var markAttendance = function(userDetails) {


    if (flag == false) {
        offlineMarkAttendance(userDetails);
        return true;
    }


    console.log(userDetails);
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    $.ajax({
        type: "POST",
        url: base_url + "getTraineelist",
        data: userDetails,
        timeout: 60000,
        dataType: "json",
        headers: {
            "X-Api-Key": localStorage.getItem("auth_key"),
        },
        Complete: function(xhr) {
            xhr.getResponseHeader("Accept", "json");
        },
        success: function(res) {
            var a = CryptoJS.AES.encrypt(JSON.stringify(res), localStorage.getItem("auth_key"), 256);
            localStorage.setItem("markAttendance", a);

            var d = CryptoJS.AES.decrypt(localStorage.getItem("markAttendance"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
            var res = JSON.parse(d);
            console.log(res);


            // localStorage.setItem('res', JSON.stringify(res));
            // var res = JSON.parse(localStorage.getItem('res'));
            // console.log(res);
            var html = "";
            if (res.status == 0) {
                html += "<div class='selectall-row'>" +
                    " <label class='container'>Check All<input type='checkbox' id='check_all'>" +
                    "   <span class='checkmark'></span>" +
                    " </label>" +
                    "</div>";
                res.data.forEach(function(data, index) {
                    var dp = "";
                    if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                        dp = "images/profile-img.png";
                    } else {
                        dp = "images/profile-img.png";
                    }


                    if (data.present == null) {

                        html += "<div class='attendence-row'>" +
                            "  <span><label class='container'><input value='" + data.iParticipantId + "' data-mobile='" + data.vPhonenumber + "' name='check_all_boxes'  class='check_all_boxes' type='checkbox'>" +
                            "  <span class='checkmark'></span>" +
                            "  </label> <img src='" + dp + "'></span>" + data.vName + "" +
                            "</div>";
                    } else {
                        html += "<div class='attendence-row'>" +
                            "  <span><label class='container'><input value='" + data.iParticipantId + "' data-mobile='" + data.vPhonenumber + "' name='check_all_boxes' class='check_all_boxes' type='checkbox' checked>" +
                            "  <span class='checkmark'></span>" +
                            "  </label> <img src='" + dp + "'></span>" + data.vName + "" +
                            "</div>";
                    }


                });
                $("#attendance_body").html(html);
                displayDOM(elements_divs, elements_divs.$Attendence);
                window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function(msg) {}, // called when the animation has finished
                    function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
                );
                SpinnerPlugin.activityStop();

            } else {
                navigator.notification.alert(res.message);
                SpinnerPlugin.activityStop();
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }

    });
}


var sendMarkAttendance = function(userDetails) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    $.ajax({
        type: "POST",
        url: base_url + "markattendence",
        data: userDetails,
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
                getCurrentRunningBatch();
            } else {
                SpinnerPlugin.activityStop();
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });
}

var uploadPicOne = function() {
    navigator.camera.getPicture(updateProfilePicService_one, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
        sourceType: navigator.camera.PictureSourceType.CAMERA
    });
}

var uploadPicTwo = function() {
    navigator.camera.getPicture(updateProfilePicService_two, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
        sourceType: navigator.camera.PictureSourceType.CAMERA
    });
}

var offlineUploadPicOne = function() {
    navigator.camera.getPicture(offlineUpdateProfilePicService_one, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
        sourceType: navigator.camera.PictureSourceType.CAMERA
    });
}

var offlineUploadPicTwo = function() {
    navigator.camera.getPicture(offlineUpdateProfilePicService_two, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
        sourceType: navigator.camera.PictureSourceType.CAMERA
    });
}

var offlineUpdateProfilePicService_one = function(fileUri) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        "status": "B2",
        "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        "session_date": $("#iTrainingDate_currentprogramme").val(),
    };
    options.headers = {
        "X-Api-Key": localStorage.getItem("auth_key"),
    };
    options.chunkedMode = true;
    var ft = new FileTransfer();
    // ft.upload(fileUri, base_url + "uploadpic", win, fail, options);

    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
    // var data = {

    //     "iTrainingId": options.params.iTrainingId,
    //      "status": options.params.status,
    //       "session_date": options.params.session_date,
    //       "image": fileUri,

    // }
    var data = {
        "iTrainingId": options.params.iTrainingId,
        "status": options.params.status,
        "session_date": options.params.session_date,
        "options": options,
        "fileUri": fileUri
    }
    console.log(data);
    console.log(options);

    var dataSending = {
        "data": data,
        "url": base_url + "uploadpic",
        "type": "POST",
        "ordertype": "4",
        "headers": {
            "X-Api-Key": localStorage.getItem("auth_key"),
        }
    }

    insertPostRequestDB(dataSending);

    var status = "B2";
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        console.log("UPDATE training_activity SET status=? ,take_selfie=? WHERE participant_dates=?", [status, fileUri, dateString]);
        tx.executeSql("UPDATE training_activity SET status=?,take_selfie=? WHERE participant_dates=?", [status, fileUri, dateString], function(tx, result) {
                alert('Updated successfully');
                offlineGetCurrentRunningBatch();

            },
            function(e) {
                console.log("ERROR: " + e.message);
            });

    })



}

var updateProfilePicService_one = function(fileUri) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        "status": "B2",
        "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        "session_date": $("#iTrainingDate_currentprogramme").val(),
    };
    options.headers = {
        "X-Api-Key": localStorage.getItem("auth_key"),
    };
    options.chunkedMode = false;
    var ft = new FileTransfer();
    console.log(options);
    ft.upload(fileUri, base_url + "uploadpic", win, fail, options);

    // $("#ongoing_day_count").html(html);

}
var offlineUpdateProfilePicService_two = function(fileUri) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        "status": "B3",
        "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        "session_date": $("#iTrainingDate_currentprogramme").val(),
    };
    options.headers = {
        "X-Api-Key": localStorage.getItem("auth_key"),
    };
    options.chunkedMode = true;
    var ft = new FileTransfer();
    // ft.upload(fileUri, base_url + "uploadpic", win, fail, options);

    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];

    // console.log(dateString);
    //  console.log(options);
    var data = {

            "iTrainingId": options.params.iTrainingId,
            "status": options.params.status,
            "session_date": options.params.session_date,
            "options": options,
            "fileUri": fileUri

        }
        // console.log(data);
    var dataSending = {
        "data": data,
        "url": base_url + "uploadpic",
        "type": "POST",
        "filestatus": "1",
        "ordertype": "5",
        "headers": {
            "X-Api-Key": localStorage.getItem("auth_key"),
        }
    }

    insertPostRequestDB(dataSending);

    var status = "B3";
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        console.log("UPDATE training_activity SET status=?,batch_picture=? WHERE participant_dates=?", [status, fileUri, dateString]);
        tx.executeSql("UPDATE training_activity SET status=?,batch_picture=? WHERE participant_dates=?", [status, fileUri, dateString], function(tx, result) {
                alert('Updated successfully');
                offlineGetCurrentRunningBatch();

            },
            function(e) {
                console.log("ERROR: " + e.message);
            });

    })

}


var updateProfilePicService_two = function(fileUri) {
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        "status": "B3",
        "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        "session_date": $("#iTrainingDate_currentprogramme").val(),
    };
    options.headers = {
        "X-Api-Key": localStorage.getItem("auth_key"),
    };
    options.chunkedMode = false;
    var ft = new FileTransfer();
    console.log(options);
    ft.upload(fileUri, base_url + "uploadpic", win2, fail, options);




}


function onFail(message) {

}


var win = function(r) {
    SpinnerPlugin.activityStop();
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    getCurrentRunningBatch();
}



var win2 = function(r) {
    SpinnerPlugin.activityStop();
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    if ($("#current_program_last").data("check") == "endday") {
        var dataSending = {
            "iTrainingId": $("#iTrainingId_currentprogramme").val(),
        }
        endingBatch(dataSending);
    } else {
        getCurrentRunningBatch();
    }
}

var fail = function(error) {
    SpinnerPlugin.activityStop();
    navigator.notification.alert("Not updated please check and try again!");
    console.log(error);
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
    getCurrentRunningBatch();
}


var endingBatch = function(dataSending) {
    SpinnerPlugin.activityStart("Ending your ongoing training,please wait.", { dimBackground: true });
    $.ajax({
        type: "POST",
        url: base_url + "endtraining",
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
                getCompletedList();
            } else {
                SpinnerPlugin.activityStop();
            }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err);
        }
    });
}

var offlineMarkAttendance = function(sendingData) {
    var d = CryptoJS.AES.decrypt(localStorage.getItem("res"), localStorage.getItem("auth_key")).toString(CryptoJS.enc.Utf8);
    var res_dStartdate = JSON.parse(d);
    console.log(res_dStartdate.data[0].dStartdate);

    var dStartdate = res_dStartdate.data[0].dStartdate;
    // var dEnddate = localStorage.getItem('dEnddate');

    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {

        tx.executeSql('SELECT * FROM participant where iTrainingId=? and dStartdate=?', [sendingData.iTrainingId, dStartdate], offlineMarkAttendanceSuccess, markAttendanceErrorCB);


    })

}

function markAttendanceErrorCB(err) {
    alert("No enrollment users. ");
}

function offlineMarkAttendanceSuccess(tx, results) {
    var len = results.rows.length;
    console.log(results);
    console.log(len);
    if (len > 0) {
        var dp = "";
        var html = "";
        html += "<div class='selectall-row'>" +
            " <label class='container'>Check All<input type='checkbox' id='check_all'>" +
            "   <span class='checkmark'></span>" +
            " </label>" +
            "</div>";
        for (var i = 0; i < len; i++) {
            var data = results.rows.item(i);
            //        console.log("Row = " + i + " ID = " + data.id + " Data =  " + data.data);

            var data = results.rows.item(i);
            if (data.vProfile_image == null || data.vProfile_image == "" || data.vProfile_image == " ") {
                dp = "images/profile-img.png";
            } else {
                dp = "images/profile-img.png";
            }


            if (data.present == null) {
                html += "<div class='attendence-row'>" +
                    "  <span><label class='container'><input value='" + data.iParticipantId + "' data-mobile='" + data.mobile_number + "'name='check_all_boxes' class='check_all_boxes' type='checkbox'>" +
                    "  <span class='checkmark'></span>" +
                    "  </label> <img src='" + dp + "'></span>" + data.name + "" +
                    "</div>";
            } else {
                html += "<div class='attendence-row'>" +
                    "  <span><label class='container'><input value='" + data.iParticipantId + "' data-mobile='" + data.mobile_number + "' name='check_all_boxes' class='check_all_boxes' type='checkbox' checked>" +
                    "  <span class='checkmark'></span>" +
                    "  </label> <img src='" + dp + "'></span>" + data.name + "" +
                    "</div>";
            }



        }
        $("#attendance_body").html(html);
        displayDOM(elements_divs, elements_divs.$Attendence);
        window.plugins.nativepagetransitions.slide(
            pageTransoptions,
            function(msg) {}, // called when the animation has finished
            function(msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    } else {
        navigator.notification.alert("No records");
    }
    SpinnerPlugin.activityStop();

}

var offlineSendMarkAttendance = function(userDetails) {
    var iParticipantAttendence = JSON.parse(userDetails.iParticipantId);
    // console.log(iParticipantAttendence);  
    var len = iParticipantAttendence.length;
    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];


    var dataSending = {
        "data": userDetails,
        "url": base_url + "markattendence",
        "type": "POST",
        "ordertype": "2",
        "headers": {
            "X-Api-Key": localStorage.getItem("auth_key"),
        }
    }
    insertPostRequestDB(dataSending);
    var status = "B1";
    var db = window.openDatabase("KRC", "1.0", "PhoneGap Demo", 200000);
    db.transaction(function(tx) {
        tx.executeSql("UPDATE training_activity SET status=? WHERE participant_dates=?", [status, dateString], function(tx, result) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS participant (iParticipantId integer primary key AUTOINCREMENT, name text,mobile_number integer,email text,organization text,state_id text,city_id text,iTrainingId text,pretest text DEFAULT NULL ,present text DEFAULT NULL ,posttest text DEFAULT NULL ,Feedbackone text,Feedbacktwo text,device_type text,device_token text)');


                if (len && len > 0) {
                    tx.executeSql("UPDATE participant SET present=? where iTrainingId=? ", [null, userDetails.iTrainingId], function(tx, res) {
                        for (var i = 0; i < len; i++) {

                            // console.log(userDetails);


                            // console.log("INSERT INTO participant_scores (iTrainingId,eTestType,score_info ,iParticipantId) VALUES (?,?,?,?)", [dataSending.iTrainingId, dataSending.eTestType, dataSending.score_info[i].fFinalScore, dataSending.score_info[i].iParticipantId]);
                            // console.log("UPDATE participant SET present=? where iTrainingId=? and iParticipantId=? ", ["present", userDetails.iTrainingId,iParticipantAttendence[i].iParticipantId]);

                            tx.executeSql("UPDATE participant SET present=? where iTrainingId=? and iParticipantId=? ", ["present", userDetails.iTrainingId, iParticipantAttendence[i].iParticipantId], function(tx, res) {



                                //getHomePage();

                                // offlineGetCurrentRunningBatch();
                            }, function(e) {
                                SpinnerPlugin.activityStop();
                                navigator.notification.alert(e.message);

                            });
                        }
                        navigator.notification.alert("submited successfully.");

                    });
                }

                offlineGetCurrentRunningBatch();
            },
            function(e) {
                //console.log("No enrollment users.");
            });

    })

}


function insertImageRequestDB(dataSending) {
    console.log(dataSending);
    // alert(dataSending.options.params.status);
    var ft = new FileTransfer();
    ft.upload(dataSending.fileUri, base_url + "uploadpic", win, fail, dataSending.options);

}