function colorForm(eId){
    
    //for easier to use jquery
    var eId = "#"+eId; 

    $(eId).blur( ()=>{
        $(eId).val()=="" ? $(eId).css("borderColor","red") : $(eId).css("borderColor","black");
    });    

    $(eId).focus( ()=>{
        $(eId).val()=="" ? $(eId).css("borderColor","black") : $(eId).css("borderColor","black");
    });   
}

colorForm("name");
colorForm("password");
colorForm("confirm");
colorForm("class");
colorForm("email");
colorForm("phone");

function validateForm() {
    if (!$("#name").val() || !$("#password").val() || !$("#confirm").val() || !$("#class").val() || !$("#email").val() || !$("#phone").val()) {
        alert("Looks that there was one of the following problems: "+"\n"
        + "-Please enter name." + "\n"
        + "-Please enter password." + "\n"
        + "-Please enter class." + "\n"
        + "-Please enter email." + "\n"
        + "-Please enter phone." + "\n");
        return false;
    }
    else if($("#password").val()!=$("#confirm").val()){
        alert("passwords must match.");
        return false;
    }
    else if (!validateEmail( $("#email").val() )){
        alert("Please input valid email.")
        return false;
    }
    return true;
}

function validateEmail(email){
    var re = /^[A-Za-z0-9\._+]+@[A-Za-z]+\.(com|org|edu|net)$/;
    return re.test(String(email).toLowerCase());
}