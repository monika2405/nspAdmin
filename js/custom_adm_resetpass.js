function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//firebase auth listener
firebase.auth().onAuthStateChanged(function(user) {
	//user signed in
	if (user) {
		window.location = "home.html";
	} else {
		if (getParameterByName('mode') != "resetPassword") {
			window.location = "index.html";
		} else {
			var actionCode = getParameterByName('oobCode');	
			firebase.auth().verifyPasswordResetCode(actionCode).then(function(email) {
				var accountEmail = email;
				$("#email1").html(accountEmail);
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			}).catch(function(error) {
				//stop loading icon
				$("#loadingGrp").fadeOut(300, function() {
					$(this).hide();
				});
				//add notification
				$.gritter.add({
					title: 'Error',
					text: "Invalid or expired action code. Please reset your password again.",
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				setTimeout(function(){
					window.location = "index.html";
				}, 4000);
			});
		}
	}
});

function showPass() {

	var x = document.getElementById("password1");
	var x2 = document.getElementById("password2");
    if (x.type === "password") {
        x.type = "text";
		x2.type = "text";
    } else {
        x.type = "password";
		x2.type = "password";
    }

}

function resetPass() {
	
	var actionCode = getParameterByName('oobCode');	
	var newPassword = sha256($("#password2").val());
	firebase.auth().confirmPasswordReset(actionCode, newPassword).then(function(resp) {
		//stop loading icon
		$("#loadingGrp").fadeOut(300, function() {
			$(this).hide();
		});
		//add notification
		$.gritter.add({
			title: 'Success',
			text: "You can now login with your new password.",
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		setTimeout(function(){
			window.location = "index.html";
		}, 4000);
	}).catch(function(error) {
		//unlock form
		$("input,button").prop("disabled",false);
		//stop loading icon
		$("#loadingGrp").fadeOut(300, function() {
			$(this).hide();
		});
		//add notification
		$.gritter.add({
			title: 'Error',
			text: "Password too weak or action code may be expired. Please reset your password again.",
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
	});
	
}

//jquery form validation
$().ready(function() {

	$("#loginForm").validate({
		submitHandler: function() {
			//start loading icon
			$("#loadingGrp").fadeIn(300, function() {
				$(this).removeClass("hide");
			})
			//lock form
			$("input,button").prop("disabled",true);
			//start login script
			resetPass();
		},
		rules: {
			password1: {
				required: true
			},
			password2: {
				required: true
			}
		},
		messages: {
			password1: {
				required: "Please enter password."
			},
			password2: {
				required: "Please enter password."
			}
		}
	});

});