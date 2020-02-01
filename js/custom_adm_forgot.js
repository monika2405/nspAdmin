//firebase auth listener
firebase.auth().onAuthStateChanged(function(user) {
	//user signed in
	if (user) {
		window.location = "home.html";
	} else {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}
});

function forgot() {
	
	var userEmail = $("#email1").val();
	
	firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
		//stop loading icon
		$("#loadingGrp").fadeOut(300, function() {
			$(this).hide();
		});
		//add notification
		$.gritter.add({
			title: 'Success',
			text: "Please open your email to reset your password.",
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		setTimeout(function(){
			window.location = "index.html";
		}, 4000);
	}).catch(function(error) {
		//stop loading icon
		$("#loadingGrp").fadeOut(300, function() {
			$(this).hide();
		});
		//unlock form
		$("input,button").prop("disabled",false);
		//error notification
		$.gritter.add({
			title: 'Error',
			text: "Your email doesn't exist or something happened.",
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
			});
			//lock form
			$("input,button").prop("disabled",true);
			//start forgot password script
			forgot();
		},
		rules: {
			email1: {
				required: true,
				email: true
			}
		},
		messages: {
			email1: {
				required: "Please enter email address.",
				email: "Please enter a valid email address."
			}
		}
	});

});