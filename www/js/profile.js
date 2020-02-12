$(function(){
    $(document).on("click","#add_profile_image",function(e){
        $("#profile-popup").show();
    });

    $(document).on("click","#loadfrom_camera",function(e){
        $("#profile-popup").hide();
        capturePhoto();
    })

    $(document).on("click","#loadfrom_gallery",function(e){
        $("#profile-popup").hide();
        getPhoto();
    })

    

    $(document).on("click","#profile_details_submit",function(e){
       var register_name = $("#registration_name").val(); 
       var register_organization = $("#registration_desgination").val();
       var state = $("#listBox option:selected").val();
       var city = $("#secondlist option:selected").val();
       var validationFlag = "";

        console.log(state);
        console.log(city);

        if (register_name === null || register_name === "" || register_name === " ") {
            validationFlag = "Name should not be empty!";
        } else if (register_organization === null || register_organization === "" || register_organization === " ") {
            validationFlag = "Organization/Designation should not be empty!";
        } else if (state === null || state === "Select State") {
            validationFlag = "Please select your state!";
        } else if (city === null || state === "Select City") {
            validationFlag = "Please select your City!";
        }

        if (validationFlag === null || validationFlag === "" || validationFlag === " ") {
            profileUpdate(register_name, register_organization, state, city);
        } else {
            navigator.notification.alert(validationFlag);
           // SpinnerPlugin.activityStop();
        }


    })
})

var profileUpdate = function(register_name, register_organization, state, city){
    SpinnerPlugin.activityStart("Loading...", { dimBackground: true }); 
    var userDetails = {
        "name":register_name,
        "organization":register_organization,
        "state_id":state,
        "city_id":city,
    }

    $.ajax({
        type: "POST",
        url: base_url + "profileupdate",
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
             if(res.status === 0){
                 displayDOM(elements_divs,elements_divs.$enrollMent);
                 window.plugins.nativepagetransitions.slide(
                    pageTransoptions,
                    function (msg) {}, // called when the animation has finished
                    function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
                 );
                 SpinnerPlugin.activityStop();
             }else{
                SpinnerPlugin.activityStop();
                navigator.notification.alert(res.message);
             }
        },
        error: function(xhr, status, err) {
            ErrorHandler(xhr, status, err)
        }
    });

}



// Convert image
var updateProfilePicService = function(fileUri){
    console.log(fileUri);
    /*SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/')+1);
    options.mimeType = "text/plain";
    options.headers = {
        //"Connection": "close",
        "X-Api-Key":localStorage.getItem("auth_key"),
    };
    options.chunkedMode = true;
    var ft = new FileTransfer();
    ft.upload(fileUri,base_url+"profilepic", win, fail, options);*/
}

var win = function (r) {
    SpinnerPlugin.activityStop();
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    showProfilePic(r.response);
    getCurrentRunningBatch();

}

var fail = function (error) {
    SpinnerPlugin.activityStop();
    console.log(error);
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
       sourceType: navigator.camera.PictureSourceType.CAMERA
        // To upload a photo from the camera // quality: 50, destinationType: Camera.DestinationType.FILE_URI

    });
}
function getPhoto()
{
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        encodingType: navigator.camera.EncodingType.JPEG,
        sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
    });
}





var options = {
    allowEdit: true,
    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: navigator.camera.MediaType.ALLMEDIA,
    destinationType: navigator.camera.DestinationType.FILE_URI
}


function onPhotoDataSuccess(imageURI) {
    plugins.crop(function success (fileUri) {
        var a = fileUri.split('?');
        console.log(a[0]);
        updateProfilePicService(a[0]);
    }, function fail () { }, imageURI , options);
}


function onFail(message) {
  
}


function onSuccess(imageData) {
     plugins.crop(function success (fileUri) {
        var a = fileUri.split('?');
        console.log(a[0]);
        updateProfilePicService(a[0]);
    }, function fail () { }, imageData , options);  
}

var updateProfilePicService = function(fileUri){
    console.log(fileUri);
    /*SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
    var options = new FileUploadOptions();
    options.fileKey = "image";
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/')+1);
    options.mimeType = "text/plain";
    options.headers = {
        //"Connection": "close",
        "X-Api-Key":localStorage.getItem("auth_key"),
    };
    options.chunkedMode = true;
    var ft = new FileTransfer();
    ft.upload(fileUri,base_url+"profilepic", win, fail, options);*/
}

function showProfilePic(res){
    var res1 = JSON.parse(res)
    var image_disply = dp_image+res1.photo;
    console.log(image_disply);
    localStorage.setItem("userDP",image_disply);
    $("#dp_image_2").attr("src",image_disply);
    $("#dp_image_1").attr("src",image_disply);
    $(".dp_image_1").attr("src",image_disply);
}


