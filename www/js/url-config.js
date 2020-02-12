//const base_url = "http://testingmadesimple.org/axisapp/api/Trainer/";
//const base_url = "http://10.9.5.107/axisapp/api/Service/";
//const base_url = "http://10.9.5.107/axisapp/api/Trainer/";
//const base_url = "http://190.168.0.23/axisapp/api/Service/";10.9.5.107
//const base_url_user = "http://instafix.hil.in/api/user/";

/*old version upto 23-10-2018*/
//const base_url = "http://sbmg1.cnkonline.com/krcdashboard/api/Trainer/";
//const dp_image = "";

/*new version from 23-10-2018*/
//const base_url = "http://testingmadesimple.org/axisapp/api/trainer/";
// const base_url = "http://sbmgkrc.in/api/Trainer/";
// const base_url = "http://krc.cnkonline.com/api/Trainer/";
 const base_url = "http://watersanitationlearning.gov.in/api/Trainer/";

//const base_url = "http://192.168.0.31/sbmgkrc/api/Trainer/";
const dp_image = "";

const elements_divs = {
    $userLoginDiv: $("#login"), 
    $homeScreen:$("#home_display"), 
    $CompletedPrograms:$("#Completed-Programs"),
    $ScheduledPrograms:$("#Scheduled-Programs"),                
    $CurrentProgram:$("#Current_Programme"),                            
    $Attendence:$("#Attendence"),
    $offlineEnroll:$("#enroll_offline"),
    $offlinePretest:$("#pretest_offline"),
    $offlinePosttest:$("#posttest_offline"),
}






var displayDOM = function(i, r) {
    for (var n in i)
        r.is(i[n]) ? i[n].show() : i[n].hide();
    return !1
};


function checkPassword(str)
  {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters that are letters, numbers or the underscore
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{5,}$/;
    return re.test(str);
  }


function checkForm(form)
  {
    if(form.username.value == "") {
      alert("Error: Username cannot be blank!");
      form.username.focus();
      return false;
    }
    re = /^\w+$/;
    if(!re.test(form.username.value)) {
      alert("Error: Username must contain only letters, numbers and underscores!");
      form.username.focus();
      return false;
    }

    if(form.pwd1.value != "" && form.pwd1.value == form.pwd2.value) {
      if(form.pwd1.value.length < 6) {
        alert("Error: Password must contain at least six characters!");
        form.pwd1.focus();
        return false;
      }
      if(form.pwd1.value == form.username.value) {
        alert("Error: Password must be different from Username!");
        form.pwd1.focus();
        return false;
      }
      re = /[0-9]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one number (0-9)!");
        form.pwd1.focus();
        return false;
      }
      re = /[a-z]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        form.pwd1.focus();
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        form.pwd1.focus();
        return false;
      }
    } else {
      alert("Error: Please check that you've entered and confirmed your password!");
      form.pwd1.focus();
      return false;
    }

    alert("You entered a valid password: " + form.pwd1.value);
    return true;
  }