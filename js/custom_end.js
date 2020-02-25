var table;

function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
	
}

function reformatDate(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[1]);
	inputMonth=parseInt(inputBroke[0]);
	inputYear=inputBroke[2];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	outputYear=inputYear.split("")[2]+inputYear.split("")[3];
	return (outputDay+"-"+outputMonth+"-"+outputYear);
	
}

function reformatDate2(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	months2=["01","02","03","04","05","06","07","08","09","10","11","12"];
	inputBroke=inputDate.split("-");
	inputDay=inputBroke[0];
	inputMonth=inputBroke[1];
	inputYear=inputBroke[2];
	if (parseInt(inputDay) < 10) {
		outputDay = inputDay;
	} else {
		outputDay = inputDay;
	}
	for (var i=0;i<months.length;i++) {
		if (inputMonth == months[i]) {
			outputMonth = months2[i];
			break
		}
	}
	outputYear = "20"+inputYear;
	return (outputMonth+"/"+outputDay+"/"+outputYear);
	
}

function editColDate(tenantID, roomID, keyColDate) {
	
	$("#tenantRef").html(table.cell(table.row("#"+tenantID),0).data());
	$("#tenantName").html(table.cell(table.row("#"+tenantID),1).data());
	$("#keyColDate").val(keyColDate);
	$("#tenantID").val(tenantID);
	$("#tenantRoomID").val(roomID);
	
	$("#editKeyModal").modal();
	
}

function updateKeyCol() {
	
	var dbRef = firebase.database().ref("endingContract");
	var tenantID = $("#tenantID").val();
	var tenantRoomID = $("#tenantRoomID").val();
	var keyCollectDate = reformatDate2($("#keyColDate").val());
	
	dbRef.child(tenantID+"/"+tenantRoomID).update({
		"keyCollectDate": keyCollectDate,
	}).then(function onSuccess(res) {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
		//success notification
		$.gritter.add({
			title: 'Key Collection Date Updated',
			text: 'Key collection date was successfully updated',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
	}).catch(function onError(err) {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
		//error notification
		$.gritter.add({
			title: 'Error Updating Key Collection Date',
			text: err.code+" : "+err.message,
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
	});
	
	
}

$(document).ready(function() {
	
	table = $('#endingContractTable').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
		"fixedHeader": true,
		"order": [[2,"desc"]],
		"columnDefs": [
			{
				targets: -1,
				orderable:false,
				className: 'dt-body-center'
			},
			{
				targets: 0,
				width: "11%",
				orderable:false,
				className: 'dt-body-center'
			},
			{
				targets: 1,
				width: "25%",
				className: 'dt-body-left'
			},
			{
				targets: 2,
				width: "11%",
				className: 'dt-body-center'
			},
			{
				targets: 3,
				width: "11%",
				className: 'dt-body-center'
			},
			{
				targets: 4,
				width: "17%",
				className: 'dt-body-left'
			},
			{
				targets: 5,
				width: "5%",
				className: 'dt-body-center'
			},
			{
				targets: 6,
				width: "5%",
				className: 'dt-body-center'
			},
			{
                targets: 7,
                width: "5%",
				className: 'dt-body-center'
			}
			
		]
	});
	
	$("#editKeyModal").draggable({
		handle: ".modal-header"
	});
	
	$('#keyColDateDP').datepicker({
		format: "d-M-yy",
		autoclose: true
	});
	
	$("#editKeyForm").validate({
		submitHandler: function() {
			//start loading icon
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			updateKeyCol();
		}
	})
	
	$("#updateKeyDate").click(function(){
		$("#editKeyForm").submit();
	})
	
	var tempMem = [];
	var trRef = firebase.database().ref("endingContract");
	trRef.on('value', function(snapshot) {
		var count = snapshot.numChildren();
		
		trRef.on('child_added', function(snapshot2) {
			var tenantID = snapshot2.key;
			trRef.child(tenantID).on('child_added', function(snapshot3) {
				var tenant = JSON.parse(JSON.stringify(snapshot3));
				tenant.roomID = snapshot3.key;
				if (tenant.refNumber == undefined) {
					tenant.refNumber = null;
				}
				tenant.name = null;
				tenant.endContractDate = reformatDate(tenant.endContractDate);
				if (tenant.keyCollectDate == undefined) {
					tenant.keyCollectDate = tenant.endContractDate;
				} else {
					tenant.keyCollectDate = reformatDate(tenant.keyCollectDate);
				}
				tenant.buildAddr = null;
				tenant.bno = tenant.roomID.substring(1,3);
				tenant.fno = tenant.roomID.substring(3,5);
				tenant.rno = tenant.roomID.substring(5,7);
				tenant.tID = tenantID;
				
				firebase.database().ref("HistoryRoom/"+parseInt(tenant.bno)+"/"+tenant.roomID).child(tenant.tID+"/tenant").once('value', function(snapshot4) {
					tenant.name = snapshot4.child("full_name").val();
					
					firebase.database().ref("tenant").child(tenant.tID).once('value', function(snapshot6) {
						if (tenant.name == null) {
							tenant.name = snapshot6.child("full_name").val();
						}
						
						firebase.database().ref("property/residential").child("building_no:"+tenant.bno).once('value', function(snapshot5) {
							tenant.buildAddr = shortenString(snapshot5.child("address_street").val(), 20);
							tempMem.push(tenant);
							
							if (tempMem.length == count && tenant.buildAddr != null) {
								for (i=0; i<tempMem.length; i++) {
									table.row.add([tempMem[i].refNumber, tempMem[i].name, tempMem[i].endContractDate, "<span ondblclick=editColDate('"+tempMem[i].tID+"','"+tempMem[i].roomID+"','"+tempMem[i].keyCollectDate+"') style='cursor: pointer;'>"+tempMem[i].keyCollectDate+"</span>", tempMem[i].buildAddr, tempMem[i].bno, tempMem[i].fno, tempMem[i].rno, "<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey()><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey()><i class='fa fa-check'></i></button>"]).node().id = tempMem[i].tID;
								}
								table.draw();
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
							}
						});
					});
				});
			});
			trRef.child(tenantID).on('child_changed', function(snapshot3) {
				var keyColDate = reformatDate(snapshot3.child("keyCollectDate").val());
				if (table.cell(table.row("#"+tenantID),3).data() != keyColDate) {
					table.cell(table.row("#"+tenantID),3).data("<span ondblclick=editColDate('"+tenantID+"','"+snapshot3.key+"','"+keyColDate+"') style='cursor: pointer;'>"+keyColDate+"</span>");
					table.draw();
				}
			});
		});
	});
	
})