function stopRecModal(due_numb){
	$('#confirmStop').val(due_numb);
	$("#modalConfirmStop").modal();
}

function startRecModal(due_numb){
	$('#confirmStart').val(due_numb);
	$("#modalConfirmStart").modal();
}

//select table to work with jquery datatables
var table = $('#data-table1').DataTable({
	"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
	"iDisplayLength": 10,
	"sPaginationType": "full_numbers",
	"columnDefs": [
	{
		targets: 0,
		width: "20%"
	},
	{
		targets: 1,
		width: "15%"
	},
	{
		targets: 2,
		width: "15%"
	},
	{
		targets: 3,
		width: "15%"
	},
	{
		targets: 4,
		width: "20%"
	},
	{ 
		targets: -1,
		width: "15%",
		orderable: false
	}
	]
})

function reformatDate(inputDate) {
	if (inputDate!="Ongoing"){
		months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		inputBroke=inputDate.split("/");
		inputDay=parseInt(inputBroke[1]);
		inputMonth=parseInt(inputBroke[0]);
		inputYear=inputBroke[2];
		outputDay=inputDay;
		outputMonth=months[inputMonth-1];
		outputYear=inputYear.split("")[2]+inputYear.split("")[3];
		return (outputDay+"-"+outputMonth+"-"+outputYear);
	}else{
		return "Ongoing"
	}
	
	
}

function get_fmoney(money) {

	var rev     = parseInt(money, 10).toString().split('').reverse().join('');
	var rev2    = '';
	for(var i = 0; i < rev.length; i++){
		rev2  += rev[i];
		if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
			rev2 += '.';
		}
	}
	return ("Rp. "+rev2.split('').reverse().join('') + ',-')
	
}

function stopRec(){
	console.log("stop")
	var due_child = $("#confirmStop").val()
	id = window.location.href.split('=')[1];
	recurringRef = firebase.database().ref("recurringPay/"+id)
	recurringRef.child(due_child).update({
		"status": "deactived"
	})

	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	})

	//success notification
	$.gritter.add({
		title: 'Recurring has been deactivated',
		text: 'Recurring was successfuly be deactivated',
		image: './img/bell.png',
		sticky: false,
		time: 3500,
		class_name: 'gritter-custom'
	})
	setTimeout(function(){
		window.location="tenant_recurring.html?id="+id+"";
	}, 1000);

}

function startRec(){
	console.log("start")
	var due_child = $("#confirmStart").val()
	id = window.location.href.split('=')[1];
	recurringRef = firebase.database().ref("recurringPay/"+id)
	recurringRef.child(due_child).update({
		"status": "active"
	})
	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	})

	//success notification
	$.gritter.add({
		title: 'Recurring has been activated',
		text: 'Recurring was successfuly be activated',
		image: './img/bell.png',
		sticky: false,
		time: 3500,
		class_name: 'gritter-custom'
	})

	setTimeout(function(){
		window.location="tenant_recurring.html?id="+id+"";
	}, 1000);
	
}


$(document).ready(function() {

	id = window.location.href.split('=')[1];
	
	tenant=firebase.database().ref().child("tenant/"+id);
	tenantroom=firebase.database().ref().child("tenant-room/"+id);
	contractRef = firebase.database().ref().child("newContract/"+id)
	recurringRef = firebase.database().ref("recurringPay/"+id)
	

	tenantroom.on("child_added", function(snapshot){
		refNumb=snapshot.child("ref_number").val()
		$("#tenant_id").html(refNumb)
	})

	tenant.on("value", function(snapshot){
		full_name=snapshot.child("full_name").val()
		$("#tenant_name").html(full_name)
	})

	contractRef.on('child_added', function(snapshot){
		var room_id = snapshot.key
		var key_id = snapshot.child("historyperiod").val().toString()
		contractRef.child(room_id+"/"+key_id).on('value', function(snapshot){
			var rent = snapshot.child("rent").val()
			var payPlan = snapshot.child("payPlan").val()
			var startDate = snapshot.child("start_date").val()
			var endDate = snapshot.child("end_date").val()
			recurringRef.child("rental").on("value", function(snapshot){
				var status = snapshot.child("status").val()
				var button = ""
				if (status=="active"){
					button = "<button id='removebutt' class='btn btn-xs btn-danger' title='Stop' onclick=stopRecModal('rental')><i class='fa fa-stop'></i></button>"
				}else if(status=="deactived"){
					
					button = "<button id='removebutt' class='btn btn-xs btn-danger' title='Start' onclick=startRecModal('rental')><i class='fa fa-play'></i></button>"
				}
				
				table.row.add(["Rental Due",get_fmoney(rent),reformatDate(startDate),reformatDate(endDate),"Rental Due",payPlan,button]).node().id = 'booking:rental';
			})
		})
		setTimeout(() => {
			table.draw();
		}, 2000);
		
	})

	recurringRef.on('value', function(snapshot){
		var total_rec = snapshot.child("total_recurring").val().toString()
		recurringRef.child("due:"+total_rec).on("value", function(snapshot){
			var rent = snapshot.child("rent").val()
			var payPlan = snapshot.child("payPlan").val()
			var date = snapshot.child("date").val()
			var status = snapshot.child("status").val()
			var details = snapshot.child("details").val()
			var button =""
			if(status == "active"){
				button="<button id='removebutt' class='btn btn-xs btn-danger' title='Stop' onclick=stopRecModal('due:"+total_rec+"')><i class='fa fa-stop'></i></button>"
				
			}else if(status=="deactived"){
				button="<button id='removebutt' class='btn btn-xs btn-danger' title='Start' onclick=startRecModal('due:"+total_rec+"')><i class='fa fa-play'></i></button>"
			}
			table.row.add(["Other Due",get_fmoney(rent),reformatDate(date),"Ongoing",details,payPlan,button]).node().id = 'booking:due'+total_rec;
		})
		setTimeout(() => {
			table.draw();
		}, 2000);
		
	})

	$("#confirmYesStop").click(function(){
		$('#modalConfirmStop').modal('hide');
		$("#cover-spin").fadeIn(250, function() {
			$(this).show();
		})
		stopRec();

	})

	$("#confirmYesStart").click(function(){
		$('#modalConfirmStart').modal('hide');
		$("#cover-spin").fadeIn(250, function() {
			$(this).show();
		})
		startRec();

	})

	$("#modalConfirmStart").draggable({
		handle: ".modal-header"
	});
	$("#modalConfirmStop").draggable({
		handle: ".modal-header"
	});

	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}, 5000);
	//add tenant button listener
	$("#baddt").on('click', function() {
		window.location = "tenant_add.html";
	})
	
});