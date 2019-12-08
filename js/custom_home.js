function removeOptions(selectbox) {
	
    //clear select options
    for(i=selectbox.options.length-1; i>=1; i--) {
        selectbox.remove(i);
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

function rem_fmoney(money) {
	
	return parseInt(money.substring(4,money.length-2).split(".").join(""))
	
}

function rem_moneydot(money) {
	
	return parseInt(money.split(".").join(""));
	
}

function get_moneydot(money) {
	
	if (isNaN(parseInt(money))) {
		var convertmoney = "";
	} else {
		money = rem_moneydot(money);
		var convertmoney = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	}
	return convertmoney;
	
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

function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function dateToday_diff(d1) {
	var today =  new Date();
	var diff = Date.parse(today) - Date.parse(d1);
	if (Math.floor(diff / 86400000)<0){
		return true;
	} else {
		return false;
	}
}

function sumMonth(date,month) {
  var d = new Date(date);
  d.setMonth(d.getMonth()+month);
  newDate = String(d).split(" ")
  var endMonth = newDate[1];
  var endDay = newDate[2];
  var endYear = newDate[3];
  return reformatDate2(endDay+"-"+endMonth+"-"+endYear);
}
function addInvoice() {
	var invoiceAmount = parseInt(rem_moneydot($("#invoiceAmount").val()))
		console.log($("#invoiceAmount").val())
		var refNumberHtml = $("#invoiceTenantRef").val();
		var id = $("#invoiceTenantID").val();
		var building_id = refNumberHtml.substring(1,3);
		var invoiceDetails = $("#invoiceDetails").val();
		var invoiceDetailsOther = $("#invoiceDetailsOtherBlock").val();
		var invoiceDate = reformatDate2($("#invoiceDate").val());
		var dueDate = $("#invoiceDate").val();

		if (invoiceDetails == "rentdue") {
			var invoiceDetailsFull = "Rental Due";
		} else if (invoiceDetails == "finedue") {
			var invoiceDetailsFull = "Fine Due";
		} else {
			var invoiceDetailsFull = "Other Payment - "+invoiceDetailsOther;
		}

		reportRef = firebase.database().ref().child("reportAccount");
		paymentRef = firebase.database().ref().child("payment/"+id);

		overdueRef.once('value', function(snapshot){
			prevDue = snapshot.child("balance").val()
			if (prevDue== null){
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=parseInt(snapshot.child("rent_bond").val());
					var rent = parseInt(snapshot.child("rent_price").val());
					overdueRef.set({
						"balance": -bondPrice-rent-parseInt(invoiceAmount),
						"date_due": invoiceDate
					})
			})
			}else{
				if (prevDue>0){
					overdueRef.update({
						"balance": parseInt(prevDue) - parseInt(invoiceAmount),
						"date_due": invoiceDate
					})
				}else{
					overdueRef.update({
						"balance": parseInt(prevDue) - parseInt(invoiceAmount)
					})
				}			
			}
		})

		paymentRef.once('value', function(snapshot){
			var prevBalance = parseInt(snapshot.child("balance").val())
			var prevInvoice = snapshot.child("due").val()
			if (prevInvoice==null){
				paymentRef.update({
					"balance": (prevBalance - invoiceAmount).toString(),
					"due":parseInt(invoiceAmount)
				})
			}
			else{
				paymentRef.update({
					"balance": (prevBalance - invoiceAmount).toString(),
					"due":parseInt(invoiceAmount)+prevInvoice
				})
			}
			
			
				
			
		
		})
		paymentRef.push({
			"date":invoiceDate,
			"desc":invoiceDetailsFull,
			"invoice":invoiceAmount,
			"payment":null,
			"refnumber":refNumberHtml,
			"list":"ledgerList"
		});
		
		var d = new Date();
		var thisDay = d.getDate();
		if (parseInt(thisDay) < 10) {
			thisDay = "0"+thisDay;
		}
		var thisMonth = d.getMonth() + 1;
		if (parseInt(thisMonth) < 10) {
			thisMonth = "0"+thisMonth;
		}
		var thisYear = d.getFullYear();
		var thisDate = thisMonth+"/"+thisDay+"/"+thisYear;
		
		reportRef.child(building_id).push({
			"due":invoiceAmount,
			"receive": 0,
			"date":invoiceDate,
			"inputDate": thisDate
		})
		
		
	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		//reset invoice form
		$('#addInvoiceForm').trigger("reset");
		$("#invoiceDetailsOtherBlock").hide();
		$("#invoiceRecurrentBlock").show();
		
		removeOptions(document.getElementById("invoiceDetails"));
		var optionElement1 = document.createElement("option");
		var optionElement2 = document.createElement("option");
		var optionElement3 = document.createElement("option");
		optionElement1.value = "rentdue";
		optionElement1.innerHTML = "Rental Due";
		optionElement2.value = "finedue";
		optionElement2.innerHTML = "Fine Due";
		optionElement3.value = "otherdue";
		optionElement3.innerHTML = "Other Due";
		document.getElementById("invoiceDetails").appendChild(optionElement1);
		document.getElementById("invoiceDetails").appendChild(optionElement2);
		document.getElementById("invoiceDetails").appendChild(optionElement3);
		
		
		//success notification
		$.gritter.add({
			title: 'Invoice Added',
			text: 'Invoice was successfully added to the database.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
		setTimeout(function(){
			window.location='tenant_details.html?id='+id+"#ledger";
		}, 1000);
	}, 1000);
	
	
}
var bondList = [];
var ledgerList = [];
var bondWaitDue = 0;
var historyperiod = 1;

function addPayment() {
	// get id , refnum
	var refNumberHtml = $("#paymentTenantRef").val();
	var id = $("#paymentTenantID").val();
	var building_id = refNumberHtml.substring(1,3);
	//init firebase
	paymentRef = firebase.database().ref().child("payment/"+id);
	overdueRef = firebase.database().ref().child("overdue/"+id);
	reportRef = firebase.database().ref().child("reportAccount");
	//collect data from payment form
	var paymentDate = reformatDate2($("#paymentDate").val());
	var paymentAmount = parseInt($("#paymentAmountCond").val()+rem_moneydot($("#paymentAmount").val()));
	var paymentDetails = $("#paymentDetails").val();
	var paymentDetailsOther = $("#paymentDetailsOther").val();
	if (paymentDetails == "rentpay") {
		var paymentDetailsFull = "Rental Payment";
	} else if (paymentDetails == "finepay") {
		var paymentDetailsFull = "Fine Payment";
	} else if (paymentDetails == "bondpay") {
		var paymentDetailsFull = "Bond Money Payment";
	} else if (paymentDetails == "transfer") {
		var paymentDetailsFull = "Bond Money Transfer";
	} else if (paymentDetails == "refund") {
		var paymentDetailsFull = "Bond Money Refund";
	} else {
		var paymentDetailsFull = "Other Payment - "+paymentDetailsOther;
	}

	if (id!=" " && refNumberHtml!=" "){
		overdueRef.once('value', function(snapshot){
			console.log("in")
			prevDue = snapshot.child("balance").val()
			if (prevDue==null){
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
				var bondPrice=snapshot.child("rent_bond").val();
				var rent = snapshot.child("rent_price").val();
				var startDate = snapshot.child("start_date").val();
				overdueRef.set({
					"balance":(paymentAmount-bondPrice-rent),
					"date_due": startDate
				})
			})
			}else{
				overdueRef.update({
					"balance": parseInt(prevDue) + paymentAmount,
				})
			}
		})
		
		paymentRef.once('value', function(snapshot){
			if (snapshot.child("balance").val()==null){
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=snapshot.child("rent_bond").val();
					var rent = snapshot.child("rent_price").val()
					
					
					paymentRef.set({
						"balance": (paymentAmount-bondPrice-rent).toString(),
						"receive": paymentAmount
					})
					
				
				
				})
			}
			else{
			prevBalance = parseInt(snapshot.child("balance").val())
			prevRec =parseInt(snapshot.child("receive").val())
				console.log("in")
				paymentRef.update({
					"balance": (prevBalance + paymentAmount).toString(),
					"receive": paymentAmount+prevRec
				})
			
			}
		})
		
		var d = new Date();
		var thisDay = d.getDate();
		if (parseInt(thisDay) < 10) {
			thisDay = "0"+thisDay;
		}
		var thisMonth = d.getMonth() + 1;
		if (parseInt(thisMonth) < 10) {
			thisMonth = "0"+thisMonth;
		}
		var thisYear = d.getFullYear();
		var thisDate = thisMonth+"/"+thisDay+"/"+thisYear;
		
		reportRef.child(building_id).push({
			"receive":paymentAmount,
			"due": 0,
			"date": paymentDate,
			"inputDate": thisDate
		})
	

		//start set payment
	var trRef1 = firebase.database().ref().child("tenant-room/"+id);
	trRef1.once('child_added', function(snapshot) {
		//mengambil bond price
		var bondPrice=snapshot.child("rent_bond").val();
		
		paymentRef.once('value', function(snapshot) {
			//mengambil bondWaitDue
			var bondWaitDue=snapshot.child("bondWaitDue").val();
			//jika belum selesai pembayaran bondwaitdue
			if (bondWaitDue==null){
				bondWaitDue = bondPrice;
			} else {
				bondWaitDue = bondWaitDue;
			}
			
			if (paymentDetails == "bondpay") { //bond money payment
				if (bondWaitDue-paymentAmount < 0) {
					if (bondWaitDue != 0) {
						var bondLeft = paymentAmount-bondWaitDue;
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":bondWaitDue,
							"refnumber":refNumberHtml,
							"list":"bondList"
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":bondWaitDue,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						});
						if (bondLeft != 0) {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":bondLeft,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
						}
						bondWaitDue = 0;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						});
					} else {
						paymentRef.push({
							"date":paymentDate,
							"desc":"Rental Payment",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						});
					}
				} else {
					bondWaitDue -= paymentAmount;
					//set bond wait due
					paymentRef.update({
						"bondWaitDue" : bondWaitDue
					});
					paymentRef.push({
						"date":paymentDate,
						"desc":"Bond Money Deposit",
						"invoice":null,
						"payment":paymentAmount,
						"refnumber":refNumberHtml,
						"list":"bondList"
					});
					paymentRef.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount,
						"refnumber":refNumberHtml,
						"list":"ledgerList"
					});
				}
			} else if (paymentDetails == "transfer") { //bond money transfer
				if (bondWaitDue > 0) {
					if (bondWaitDue-paymentAmount < 0) {
						if (bondWaitDue != 0) {
							var bondLeft = paymentAmount-bondWaitDue;
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"bondList"
							});
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Payment",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
							if (bondLeft != 0) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":bondLeft,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								});
							}
							bondWaitDue = 0;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							});
						} else {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
						}
					} else {
						bondWaitDue -= paymentAmount;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"bondList"
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Payment",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						});
					}
				} else {
					paymentRef.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":paymentAmount,
						"payment":null,
						"refnumber":refNumberHtml,
						"list":"bondList"
					});
					paymentRef.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount,
						"refnumber":refNumberHtml,
						"list":"ledgerList"
					});
				}
			} else if (paymentDetails == "refund") { //bond money refund
				if (bondWaitDue > 0) {
					if (bondWaitDue-paymentAmount < 0) {
						if (bondWaitDue != 0) {
							var bondLeft = paymentAmount-bondWaitDue;
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"bondList"
							});
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Payment",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
							if (bondLeft != 0) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":bondLeft,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								});
							}
							bondWaitDue = 0;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							});
						} else {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
						}
					} else {
						bondWaitDue -= paymentAmount;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"bondList"
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Payment",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						});
					}
				} else {
				paymentRef.push({
					"date":paymentDate,
					"desc":paymentDetailsFull,
					"invoice":paymentAmount,
					"payment":null,
					"refnumber":refNumberHtml,
					"list":"bondList"
				});
					paymentRef.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount,
						"refnumber":refNumberHtml,
						"list":"ledgerList"
					});
					paymentRef.push({
						"date":paymentDate,
						"desc":"Bond Money Withdraw",
						"invoice":paymentAmount,
						"payment":null,
						"refnumber":refNumberHtml,
						"list":"ledgerList"
					});
				}
			} else { //other payment
				if (bondWaitDue > 0) {
					if (bondWaitDue-paymentAmount < 0) {
						if (bondWaitDue != 0) {
							var bondLeft = paymentAmount-bondWaitDue;
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"bondList"
							});
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Payment",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
							if (bondLeft != 0) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":bondLeft,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								});
							}
							bondWaitDue = 0;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							});
						} else {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							});
						}
					} else {
						bondWaitDue -= paymentAmount;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"bondList"
						});
						paymentRef.push({
							"date":paymentDate,
							"desc":"Bond Money Payment",
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						});
					}
				} else {
					paymentRef.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount,
						"refnumber":refNumberHtml,
						"list":"ledgerList"
					});
				}
			}
			setTimeout(function(){
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				})
				//reset payment form
				$('#addPaymentForm').trigger("reset");
				$("#paymentDetailsOtherBlock").hide();
				removeOptions(document.getElementById("paymentDetails"));
				var optionElement1 = document.createElement("option");
				var optionElement2 = document.createElement("option");
				var optionElement3 = document.createElement("option");
				var optionElement4 = document.createElement("option");
				optionElement1.value = "rentpay";
				optionElement1.innerHTML = "Rental Payment";
				optionElement2.value = "finepay";
				optionElement2.innerHTML = "Fine Payment";
				optionElement3.value = "bondpay";
				optionElement3.innerHTML = "Bond Money Payment";
				optionElement4.value = "otherpay";
				optionElement4.innerHTML = "Other Payment";
				document.getElementById("paymentDetails").appendChild(optionElement1);
				document.getElementById("paymentDetails").appendChild(optionElement2);
				document.getElementById("paymentDetails").appendChild(optionElement3);
				document.getElementById("paymentDetails").appendChild(optionElement4);
				//success notification
				$.gritter.add({
					title: 'Payment Added',
					text: 'Payment was successfully added to the database.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				})
			}, 1000);
			setTimeout(function(){
				window.location='tenant_details.html?id='+id+"#ledger";
			}, 1000);
		});
	});
	}else{
		alert("Harap isi semua kolom")
	}	
			
}

//approve booking in table
function approveBooking(refNumber){
	$('#approveM').html("Are you sure to approve "+refNumber+" ?");
	$('#approveM').val(refNumber);
	$("#approveModal").modal();
}

//delete booking in table
function deleteBooking(refNumber,tenantID){
	$('#approveD').html("Are you sure delete "+refNumber+" ?");
	$('#approveD').val(refNumber);
	$('#approveD2').val(tenantID);
	$("#rApproveModal").modal();
}

//sort list by status approve or booking
function sortByStatOccupy(listApproveT){
	newArray=[]
	
	//jika statusnya booking
	for (i=0;i<listApproveT.length;i++) {
		if (listApproveT[i].statOccupy=="booking"){
			newObj = {
				"statOccupy":listApproveT[i].statOccupy,
				"refNum":listApproveT[i].refNum,
				"content":listApproveT[i].content,
				"tenant_id":listApproveT[i].tenant_id
			}
			newArray.push(newObj);
		}
	}
		
	//jika statusnya approved
	for (i=0;i<listApproveT.length;i++) {
		if (listApproveT[i].statOccupy=="approved"){
			
			newObj = {
				"statOccupy":listApproveT[i].statOccupy,
				"refNum":listApproveT[i].refNum,
				"content":listApproveT[i].content,
				"tenant_id":listApproveT[i].tenant_id
			}
			newArray.push(newObj);
		}
	}
	return newArray
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

//menjumlahkan hari dengan tanggal yang diminta
function sumDate(hari,date){
	var intend = parseInt(hari);
	//set date yang ditentukan
	var someDate = new Date(date);
	//menjumlahkan tanggal
	someDate.setDate(someDate.getDate() + intend); 
	newDate = String(someDate).split(" ")
	var endMonth = newDate[1];
	var endDay = newDate[2];
	var endYear = newDate[3];

	var endDate = endDay+"-"+endMonth+"-"+endYear;

	return endDate;
}

//send email from key collection
function mailTenantKey(tenantID,roomID){
	//start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).removeClass("hide");
	})
	/*
	//get tenant mail from firebase
	trRef1=firebase.database().ref().child("tenant-room/"+tenantID);
	trRef1.on('child_added', function(snapshot) {
		//get starting date , status occupy , ref id , alamat
		var propAddr=snapshot.child("prop_addr").val();
		var statingDate=snapshot.child("start_date").val();
		var statOccupy=snapshot.child("stat_occupy").val();
		// mengambil data tenant yang status nya approved atau active
		if ((statOccupy=="approved") ||(statOccupy=="active")){
			var getEmail = firebase.database().ref().child("tenant/"+tenantID);
			getEmail.once('value', function(snapshot) {
				// membaca target , subject , pesan, no kamar
				var to=snapshot.child("email").val();
				var name=snapshot.child("full_name").val();
				var noKamar = String(roomID.charAt(5))+String(roomID.charAt(6));
				var noLantai = String(roomID.charAt(3))+String(roomID.charAt(4));
				var idKamar = String(roomID.charAt(1))+String(roomID.charAt(2));
				var subject = "Remainder Pengambilan Kunci"
				var message = "Selamat datang "+name+",\n\nPesanan saudara/i pada :<br>Alamat : "+propAddr+"<br>Lantai : "+noLantai+"<br>No. Kamar : "+noKamar+"\n\ntelah kami terima, silahkan melakukan pengambilan kunci kamar pada tanggal "+reformatDate(statingDate)+". Untuk pengambilan kunci pada tanggal lain bisa langsung datang ke kantor NSP pada : <br>"+"Senin-Jumat : 08:00-17:00<br>Sabtu : 08:00-12:00\n\n\nCP: 08xxxx";

				//set to firebase
				var sendEmail = firebase.database().ref().child("sendEmail");
				sendEmail.set({
					'subject' : subject,
					'to' : to,
					'message' : message,
				});
				//membangunkan heroku
				var xhr0 = new XMLHttpRequest();
				xhr0.open('GET', "https://sendemailgokost.herokuapp.com/", true);
				xhr0.send();
				xhr0.onreadystatechange = processRequest;
				 //kondisi ketika webhook selesai di buka
				function processRequest(e) {
					if (xhr0.readyState == 4) {
						//mengirim email
						var xhr = new XMLHttpRequest();
						xhr.open('GET', "https://sendemailgokost.herokuapp.com/webhook", true);
						xhr.send();
					 
						xhr.onreadystatechange = processRequest;
						 //kondisi ketika webhook selesai di buka
						function processRequest(e) {
							if (xhr.readyState == 4) {
								//stop loading
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								})
								
							}
						}
					}
				}
			});
		}
	});
	*/
	//stop loading
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	})
	return false;
}

// send email
function sendEmail(tenantID,roomID,total,propAddr1){
	//start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).removeClass("hide");
	})
	/*
	//get tenant mail from firebase
	var getEmail = firebase.database().ref().child("tenant/"+tenantID);
	getEmail.once('value', function(snapshot) {
		// membaca target , subject , pesan, no kamar
		var to=snapshot.child("email").val();
		var name=snapshot.child("full_name").val();
		var noKamar = String(roomID.charAt(5))+String(roomID.charAt(6));
		var noLantai = String(roomID.charAt(3))+String(roomID.charAt(4));
		var idKamar = String(roomID.charAt(1))+String(roomID.charAt(2));
		var today = new Date();
		var subject = "Selamat, pesanan anda sudah disetujui"
		var message = "Selamat datang "+name+",\n\nPesanan saudara/i pada :<br>Alamat : "+propAddr1+"<br>Lantai : "+noLantai+"<br>No. Kamar : "+noKamar+"\n\ntelah disetujui, silahkan melakukan pembayaran bond money dan rental money sebesar "+get_fmoney(total)+" ke No. Rek dibawah ini: <br>No. Rek : 323232323<br>Atas Nama : Monica\n\nPaling lambat "+sumDate(7,today)+". Jika sudah transfer , harap menghubungi no WA 08xxxxx"

		//set to firebase
		var sendEmail = firebase.database().ref().child("sendEmail");
		sendEmail.set({
			'subject' : subject,
			'to' : to,
			'message' : message,
		});
		//membangunkan heroku
		var xhr0 = new XMLHttpRequest();
		xhr0.open('GET', "https://sendemailgokost.herokuapp.com/", true);
		xhr0.send();
		xhr0.onreadystatechange = processRequest;
		 //kondisi ketika webhook selesai di buka
		function processRequest(e) {
			if (xhr0.readyState == 4) {
				//mengirim email
				var xhr = new XMLHttpRequest();
				xhr.open('GET', "https://sendemailgokost.herokuapp.com/webhook", true);
				xhr.send();
			 
				xhr.onreadystatechange = processRequest;
				 //kondisi ketika webhook selesai di buka
				function processRequest(e) {
					if (xhr.readyState == 4) {
						//stop loading
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						})
						
					}
				}
			}
		}
	});
	*/
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	})
	return false;
}

function editKeyCollectDateModal(keyDate,tenantID,tenantRef,notes) {

	$("#editKeyDateModal").modal();
	$("#keyDate").val(keyDate);
	var year = keyDate.split("/")[2]
	var month = keyDate.split("/")[0]
	var day = keyDate.split("/")[1]
	
	var ddd = new Date(year,month,day);
	$('#keyDatePicker').datepicker('setStartDate', ddd);
	$('#keyDatePicker').datepicker('setDate', ddd);
	$("#notes").val(notes);
	$("#keyTenantID").val(tenantID);
	$("#keyTenantRef").val(tenantRef);

}


function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
}

//fungsi untuk Non-Active Tenant
function nonactiveModal(){
	var refNumber = $("#tenant_id").html()
	$('#nonactiveM').html("Are you sure to Non-Active "+refNumber+" ?");
	$('#nonactiveM').val(refNumber);
	$("#nonActiveModal").modal();
}

$("#submitNonActive").click(function(){
	$('#nonActiveModal').modal('hide');
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	nonActive();

})

function nonActive(id){
	
	newfirebase=firebase.database().ref().child("tenantendContract/"+id);
	contract=firebase.database().ref().child("contract/"+id+"/"+room_id);
	contract.on("child_added", function(snapshot){
		if (snapshot.key!="historyperiod" && snapshot.key!="status"){
			var bond = snapshot.child("bond").val();
			var ctrt_length = snapshot.child("ctrt_length").val();
			var ctrt_type = snapshot.child("ctrt_type").val();
			var end_date = snapshot.child("end_date").val();
			var payPlan = snapshot.child("payPlan").val();
			var refNumb = snapshot.child("refNumb").val();
			var rent = snapshot.child("rent").val();
			var start_date = snapshot.child("start_date").val();
			newfirebase.child("contract").push({
				"bond":bond,
				"ctrt_length":ctrt_length,
				"ctrt_type":ctrt_type,
				"end_date":end_date,
				"payPlan":payPlan,
				"refNumb":refNumb,
				"rent":rent,
				"start_date":start_date
			})
		}
		else if (snapshot.key=="historyperiod"){
			historyperiod = snapshot.val();	
			newfirebase.child("contract").update({
				"historyperiod":historyperiod
			})
		}
	})
	
	payment = firebase.database().ref().child("payment/"+id);
	payment.on("child_added", function(snapshot){
		if (snapshot.key!="balance"&&snapshot.key!= "bondWaitDue"&&snapshot.key!="recurring"){
			var date = snapshot.child("date").val();
			var desc = snapshot.child("desc").val();
			var invoice = snapshot.child("invoice").val();
			var payment= snapshot.child("payment").val();
			var list = snapshot.child("list").val();
			var refnumber = snapshot.child("refnumber").val();
			newfirebase.child("payment").push({
				"date": date,
				"desc":desc,
				"invoice":invoice,
				"payment":payment,
				"list":list,
				"refnumber":refnumber
			})
		}
		else if(snapshot.key == "balance"){
			var balance = snapshot.val();
			newfirebase.child("payment").update({
				"balance":balance
			})
		}
		else if (snapshot.key == "bondWaitDue"){
			var bondWaitDue = snapshot.val();
			newfirebase.child("payment").update({
				"bondWaitDue":bondWaitDue
			})
		}
		else if (snapshot.key == "recurring"){
			var recurring = snapshot.val();
			newfirebase.child("payment").update({
				"recurring":recurring
			})
		}
	 })
	

	setTimeout(function(){
		firebase.database().ref().child("payment/"+id).remove();
		firebase.database().ref().child("contract/"+id).remove();
		firebase.database().ref().child("tenant/"+id).remove();
		firebase.database().ref().child("tenant-room/"+id).remove();
		firebase.database().ref().child("overdue/"+id).remove();
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	
		//success notification
		$.gritter.add({
			title: 'Tenant has been deactivated',
			text: 'Tenant was successfuly be deactivated',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
		setTimeout(function(){
			window.location='home.html';
		}, 1000);
		
	}, 2000);

}

//Fungsi untuk End-Contract Tenant
function endContractModal(){
	var refNumber = $("#tenant_id").html()
	$('#endM').html("Are you sure to end contract "+refNumber+" ?");
	$('#endM').val(refNumber);
	$("#endModal").modal();
}

$("#submitEnd").click(function(){
	$('#endModal').modal('hide');
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	endContract();

})

function endContract(){
	var refNumber = $("#tenant_id").html()
	refNumb=refNumber.split(" ")
	refNumb2=refNumb[0]+refNumb[1]+refNumb[2]
	var room_id=refNumb2.substring(0,7)
	id2 = window.location.href.split('=')[1];
	id = id2.split("#")[0];
	var historyperiod=0
	newfirebase=firebase.database().ref().child("tenantendContract/"+id);
	
	
	tenant =  firebase.database().ref().child("tenant/"+id);
	tenant.once("value", function(snapshot){
		var full_name=snapshot.child("full_name").val();
		var birth_date=snapshot.child("birth_date").val();
		var cont_home=snapshot.child("cont_home").val();
		var cont_mobile=snapshot.child("cont_mobile").val();
		var email=snapshot.child("email").val();
		var id_number1=snapshot.child("id_number1").val();
		var id_number2=snapshot.child("id_number2").val();
		var id_photo1=snapshot.child("id_photo1").val();
		var id_photo2=snapshot.child("id_photo2").val();
		var id_type1=snapshot.child("id_type1").val();
		var id_type2=snapshot.child("id_type2").val();
		var kk_photo=snapshot.child("kk_photo").val();
		var los_prev=snapshot.child("los_prev").val();
		var occupation=snapshot.child("occupation").val();
		var perm_addr=snapshot.child("perm_addr").val();
		var prev_addr=snapshot.child("prev_addr").val();
		var rfl_prev=snapshot.child("rfl_prev").val();
		var tn_photo = snapshot.child("tn_photo").val();
		var addressR1=snapshot.child("references/reference_1/address").val();
		var contactR1=snapshot.child("references/reference_1/contact").val();
		var full_nameR1=snapshot.child("references/reference_1/full_name").val();
		var relationR1=snapshot.child("references/reference_1/relation").val();
		var addressR2=snapshot.child("references/reference_2/address").val();
		var contactR2=snapshot.child("references/reference_2/contact").val();
		var full_nameR2=snapshot.child("references/reference_2/full_name").val();
		var relationR2=snapshot.child("references/reference_2/relation").val();
		
		newfirebase.child("tenant").update({
			"full_name":full_name,
			"birth_date":birth_date,
			"cont_home":cont_home,
			"cont_mobile":cont_mobile,
			"email":email,
			"id_number1":id_number1,
			"id_number2":id_number2,
			"id_photo1":id_photo1,
			"id_photo2":id_photo2,
			"id_type1":id_type1,
			"id_type2":id_type2,
			"kk_photo":kk_photo,
			"los_prev":los_prev,
			"occupation":occupation,
			"perm_addr":perm_addr,
			"prev_addr":prev_addr,
			"rfl_prev":rfl_prev,
			"tn_photo":tn_photo,
			"references":{
				"reference_1":{
					"address":addressR1,
					"contact":contactR1,
					"full_name":full_nameR1,
					"relation":relationR1
				},
				"reference_2":{
					"address":addressR2,
					"contact":contactR2,
					"full_name":full_nameR2,
					"relation":relationR2
				}
			}
		})
	})
	tenantroom = firebase.database().ref().child("tenant-room/"+id);
	tenantroom.on("child_added", function(snapshot){
		var apply_date = snapshot.child("apply_date").val();
		var adjst_bond = snapshot.child("adjst_bond").val();
		var adjst_pay = snapshot.child("adjst_pay").val();
		var build_no = snapshot.child("build_no").val();
		var ctrt_opt = snapshot.child("ctrt_opt").val();
		var key_rtrn = snapshot.child("key_collection/key_rtrn").val();
		var pick_act = snapshot.child("key_collection/pick_act").val();
		var pick_est = snapshot.child("key_collection/pick_est").val();
		var key_date = snapshot.child("key_date").val();
		var pay_plan = snapshot.child("pay_plan").val();
		var prop_addr = snapshot.child("prop_addr").val();
		var ref_number = snapshot.child("ref_number").val();
		var rent_bond = snapshot.child("rent_bond").val();
		var rent_price = snapshot.child("rent_price").val();
		var start_date = snapshot.child("start_date").val();
		var stat_approve = snapshot.child("stat_approve").val();
		var stat_process = snapshot.child("stat_process").val();
		var stat_chrg_f = snapshot.child("stat_chrg_f").val();
		var stat_chrg_n = snapshot.child("stat_chrg_n").val();
		var stat_occupy = snapshot.child("stat_occupy").val();

		newfirebase.child("tenant-room").update({
			ref_number : ref_number,
			build_no : build_no,
			prop_addr : prop_addr,
			apply_date : apply_date,
			start_date : start_date,
			key_date : key_date,
			ctrt_opt : ctrt_opt,
			pay_plan : pay_plan,
			adjst_pay : adjst_pay,
			adjst_bond : adjst_bond,
			stat_approve : stat_approve,
			stat_process : stat_process,
			key_collection : {
				pick_est : pick_est,
				pick_act : pick_act,
				key_rtrn : key_rtrn
			},
			stat_occupy : stat_occupy,
			stat_chrg_f : stat_chrg_f,
			stat_chrg_n : stat_chrg_n,
			rent_price	: rent_price,
			rent_bond	: rent_bond
		})
	})
	setTimeout(function(){
		$("#contract_details").append(" Contract Ended")
		$("#end").hide()
		startDate = Date.today().toString("MM/dd/yyyy")
		endDate = Date.today().addDays(1).toString("MM/dd/yyyy")
		var refNumber = $("#tenant_id").html();
		tenantid2=$("#tenant_id").html().substring(0,9)
		tenantid3=tenantid2.split(" ")
		tenantid4=tenantid3[0]+tenantid3[1]+tenantid3[2]
		contract=firebase.database().ref().child("contract/"+id+"/"+tenantid4);
		var enddate = $("#period1").text()
		enddate2=enddate.split(" - ")[1]
		var bond=$("#bond1").text()
		var rent=$("#payment1").text()
		bond2=bond.split("to")[0]
		rent2=rent.split("paid")[0]
		payplan=rent.split("paid ")[1]
		payplan2=payplan.split(" Electricity")[0]
		bond =rem_fmoney(bond2).toString()
		rent = rem_fmoney(rent2).toString()
		if(enddate2=="Ongoing"){
			contract.push({
				"ctrt_length": "-",
				"refNumb":refNumber,
				"ctrt_type":"-",
				"bond": bond,
				"end_date":endDate,
				"start_date":startDate,
				"payPlan":payplan2,
				"rent":rent
			})
			contract.update({
				"status":"inactive"
			})
			contract.update({
				"historyperiod":++historyperiod
			})
		}else{
			contract.update({
				"status":"inactive"
			})
			contract.update({
				"historyperiod":++historyperiod
			})
		}
		
		
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	
		
		//success notification
		$.gritter.add({
			title: 'Contract was Ended ',
			text: 'Contract was successfully ended',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}, 2000);
	
}

$("#endModal").draggable({
	handle: ".modal-header"
});
$("#nonActiveModal").draggable({
	handle: ".modal-header"
});

function extendModal(id){
	
	$("#extendModal").modal();
}

$("#extendButton").click(function() {
	$("#extendForm").submit();
})
//extend modal draggable
$("#extendModal").draggable({
	handle: ".modal-header"
});
//extend form validation
$("#extendForm").validate({
	submitHandler: function() {
		$('#extendModal').modal('hide');
		$("#cover-spin").fadeIn(250, function() {
			$(this).show();
		});
		extendTenant();
	}
})



function extendTenant(id) {
	var historyperiod=0
	var status = ""
	var contract2 = firebase.database().ref().child("contract/"+id+"");
        contract2.on('child_added', function(snapshot){
            room_id=snapshot.key
						var contract4 = firebase.database().ref().child("contract/"+id+"/"+room_id+"");
						contract4.on('value', function(snapshot){
							historyperiod=snapshot.child("historyperiod").val()
							status=snapshot.child("status").val();
						})
						// contract4.on('child_added', function(snapshot){
						// 	var bond = snapshot.child("bond").val()
						// 	var ctrt_length=snapshot.child("ctrt_length").val()
						// 	var ctrt_type = snapshot.child("ctrt_type").val()
						// 	var payPlan = snapshot.child("payPlan").val()
						// 	var refNumb = snapshot.child("refNumb").val()
						// 	var rent=snapshot.child("rent").val()
						// 	var start_date = snapshot.child("start_date").val()
						// 	var end_date = snapshot.child("end_date").val()
						// })
				})
	//collect data from form
	historyperiod++;
	var refNumber = $("#tenant_id").html();
	var payPlan = $("#extendPayPlan").val();
	var bondPrice = $("#fbond").html();
	var rentPrice = $("#fprice").html();
	var startDate = $("#ExtendstartDate").html();
	var endDate2 = $("#ExtendendDate").html();
	if(endDate2=="Ongoing"){
		ctrt_length="-"
		ctrt_type="-"
	}
	else{
		ctrt_length=$("#ExtendIntendAngka").val();
		ctrt_type=$("#extendIntend").val()
	}
	if ($("#ExtendendDate").html()!="Ongoing"){
		var endDate = reformatDate2($("#ExtendendDate").html());
	}
	else{
		endDate = "Ongoing"
	}
	bondPrice2=bondPrice.split("Rp. ")[1]
	bondPrice3=bondPrice2.split(",-")[0]
	bondPrice4=bondPrice3.split(".")
	bondPrice5=""
	for (let index = 0; index < bondPrice4.length; index++) {
		bondPrice5+=bondPrice4[index]	
	}
	bondPrice6=parseInt(bondPrice5)

	rentPrice2=rentPrice.split("Rp. ")[1]
	rentPrice3=rentPrice2.split(",-")[0]
	rentPrice4=rentPrice3.split(".")
	rentPrice5=""
	for (let index = 0; index < rentPrice4.length; index++) {
		rentPrice5+=rentPrice4[index]	
	}
	
	$("#extendForm").trigger("reset");
	
	if (status=="inactive"){
		firebase.database().ref().child("tenant_endContract/"+id).remove();
	}

	tenantid2=$("#tenant_id").html().substring(0,9)
	tenantid3=tenantid2.split(" ")
	tenantid4=tenantid3[0]+tenantid3[1]+tenantid3[2]
	var contract = firebase.database().ref().child("contract/"+id+"/"+tenantid4+"");
	contract.push({
		"ctrt_length": ctrt_length,
		"refNumb":refNumber,
		"ctrt_type":ctrt_type,
		"bond": bondPrice5,
		"end_date":endDate,
		"start_date":reformatDate2(startDate),
		"payPlan":payPlan,
		"rent":rentPrice5
	})
	contract.update({
		"historyperiod":++historyperiod,
		"status":"active"
	})
	//create due on ledger
	/*
	var bondPriceInt = parseInt($("#cfbond").val());
	var rentPriceInt = parseInt($("#cfprice").val());
	ledgerList.push({
		"date":reformatDate2(startDate),
		"desc":"Bond Money Due",
		"invoice":bondPriceInt,
		"payment":null
	});
	ledgerList.push({
		"date":reformatDate2(startDate),
		"desc":"Rental Due",
		"invoice":rentPriceInt,
		"payment":null
	});
	ledgerList = sortArrayByDate(ledgerList);
	table1.clear();
	for (x in ledgerList) {
		table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
	}
	table1.draw();
	countTotalDue();
	countTotalReceived();
	countBalance();
	countTotalBalance();
	//change start date to end of contract
	$("#startDate").html($("#endDate").html());
	//reset input
	$("#extendPayPlan")
		.val("")
		.trigger("change");
	$("#extendIntend")
		.val("")
		.trigger("change");
	*/
	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		//success notification
		$.gritter.add({
			title: 'Tenant Extended',
			text: 'Tenant was successfully extended.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}, 1000);

}

$(document).ready(function() {
	//get data from database
	tenant={}
	tenantdata={}
	paymentBal={}
	paymentRec={}
	contractdata={}
	overdue={}
	tenantChange = false
	changeContract = false
	paymentChange = false
	var todayDate = Date.today().addDays(20).toString("MM/dd/yyyy")
	var trRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref().child("tenant");
	var contractRef = firebase.database().ref().child("contract");
	var paymentRef =firebase.database().ref().child("payment");
	var overdueRef = firebase.database().ref().child("overdue");
	var getToday = Date.today().toString("MM/dd/yyyy");
	contractRef.on('child_added', function(snapshot){
		var id = snapshot.key
		contractRef.child(id).once('child_added', function(snapshot){
			var room_id = snapshot.key
			contractRef.child(id+"/"+room_id).on('child_added', function(snapshot){
				var contract_id = snapshot.key
				if (contract_id!="historyperiod" && contract_id!="status"){
					contractdata[id]=snapshot.val()
				}
			})
		})
		contractRef.child(id).on('child_changed', function(snapshot){
			var row = table3.row(id);
			row.remove();
			var room_id = snapshot.key
			changeContract = true
			contractRef.child(id+"/"+room_id).on('child_changed', function(snapshot){
				var contract_id = snapshot.key
				if (contract_id!="historyperiod" && contract_id!="status"){
					contract[id]=snapshot.val()
				}
			})
		})

	})
	paymentRef.on('child_added', function(snapshot){
		var id = snapshot.key
		paymentRef.child(id).on('child_added', function(snapshot){
			var child_id=snapshot.key
			if (child_id=="balance"){
				paymentBal[id]=snapshot.val()
			}else if(child_id=="recurring"){
				paymentRec[id]=snapshot.val()
			}
		})
		paymentRef.child(id).on("child_changed", function(snapshot){
			paymentChange = true
			var row = table2.row('#over'+id);
			row.remove();
			if (snapshot.key=="balance"){
				paymentBal[id]={"balance":snapshot.val()}
			}else if(snapshot.key=="recurring"){
				paymentRec[id]={"recurring":snapshot.val()}
			}
		})
	})
	tenantRef.on('child_added',function(snapshot){
		var id = snapshot.key
		tenantRef.child(id).once("value", function(snapshot){
			if(snapshot.key!="counter"){
			tenantdata[id]=snapshot.val()
		}
		})
	})
	trRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;	
		trRef.child(tenantID).once('child_added', function(snapshot) {
			//get starting date , building address , status occupy , ref id
			if (tenantID!="total_tenant"){
				tenant[tenantID]=snapshot.val()
			}
		});
		trRef.child(tenantID).on('child_changed', function(snapshot) {
			tenantChange = true
			tenant[tenantID]=snapshot.val()
			var row = table6.row('#key'+tenantID);
			row.remove();
		});
		trRef.child(tenantID).on('child_removed', function(snapshot) {
			//get ref ID
			var refN=snapshot.child("ref_number").val().split(" ");
			var refNumber=refN[0]+refN[1]+refN[2];
			// remove row changed
			var row = table1.row('#booking'+refNumber);
			row.remove();
		});
	});
	overdueRef.on('child_added', function(snapshot){
		var tenantID = snapshot.key;	
		overdue[tenantID]=snapshot.val()
		
	})

	//table
	//Booking list
	var table1 = $('#booking-list').DataTable({
		"aLengthMenu": [[3, 6, -1], [3, 6, "All"]],
		"iDisplayLength": 3,
		"order": [],
		"columnDefs": [
		{
			targets: -1,
			orderable:false
		},
		{
			targets: 0,
			width: "20%",
			orderable:false
		},
		{
			targets: 1,
			className: 'dt-body-left',
			width:"20%"
		}
		]
	})

	//overdue
	var table2 = $('#overdue-list').DataTable({
		"aLengthMenu": [[3, 6, -1], [3, 6, "All"]],
		"iDisplayLength": 3,
		"order": [[ 2, "asc" ]],
		"columnDefs": [
		{
			targets: 0,
			className: 'dt-body-left',
			width: "30%"
		},
		]
	})

	//almost expired
	var table3 = $('#aexpired-list').DataTable({
		"aLengthMenu": [[3, 6, -1], [3, 6, "All"]],
		"iDisplayLength": 3,
		"order": [[ 2, "asc" ]],
		"columnDefs": [
		{
			targets: 0,
			width: "20%"
		},
		{
			targets: 1,
			width: "20%"
		}
		]
	})

	//imcomplete tenant
	var table4 = $('#incomplete-list').DataTable({
		"aLengthMenu": [[3, 6, -1], [3, 6, "All"]],
		"iDisplayLength": 3,
		"order": [[ 0, "asc" ]],
		"columnDefs": [
		{
			targets: 0,
			width: "30%"
		},
		]
	})

	//key list
	var table6 = $('#keyC-list').DataTable({
		"aLengthMenu": [[3, 6, -1], [3, 6, "All"]],
		"iDisplayLength": 3,
		"order": [[2,"desc"]],
		"columnDefs": [
		{
			targets: 0,
			width: "20%"
		},
		{
			targets: -1,
			width: "10%"
		},
		{
			targets: 1,
			width: "20%"
		},
		]
	})

	setTimeout(() => {
		bookingTable(); 
		overdueTable();
		keyTable();
		expiredTable();
		autocompleteFunction();
	}, 4000);
	
	setTimeout(() => {
		bookingTable(); 
		overdueTable();
		keyTable();
		expiredTable();
		autocompleteFunction();
	}, 10000);

	setTimeout(() => {
		bookingTable(); 
		overdueTable();
		keyTable();
		expiredTable();
		autocompleteFunction();
	}, 20000);

	setInterval(() => {
		if (tenantChange==true){
			keyTable()
			autocompleteFunction()
			tenantChange=false
		}
		else if(changeContract==true){
			expiredTable()
			changeContract=false
		}
		else if(paymentChange==true){
			overdueTable()
			paymentChange=false
		}
	}, 60000);

	//function
	function bookingTable(){
		var paymentRef = firebase.database().ref("payment");
		listApproveT=[];
		setTimeout(() => {
			table1.clear();
			console.log(tenant)
			console.log(tenantdata)
			console.log(paymentBal)
			console.log(paymentRec)
			console.log(contractdata)
			console.log(overdue)
			if (tenant!={} && tenantdata!={}){
				for (i in tenant){
					paymentRef.child(i).once('value', function(snapshot) {
						if (snapshot.val() != null) {  // Have payments
							// // jika status = approved
							// if (tenant[i].stat_occupy=="approved"){
							// 	refNumFormat=tenant[i].ref_number
							// 	refN=refNumFormat.split(" ")
							// 	refNumber=refN[0]+refN[1]+refN[2]
							// 	tenantName=shortenString(tenantdata[i].full_name,8)
							// 	statingDate=tenant[i].start_date
							// 	propAddr=shortenString(tenant[i].prop_addr,10)
								
							// 	// untuk sort , datanya dimasukan ke list
							// 	newObj = {
							// 		"statOccupy":"approved",
							// 		"refNum":refNumber,
							// 		"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' style='background-color:#c8bca6' disabled><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
							// 		"tenant_id":i
							// 	}
							// 	listApproveT.push(newObj);
							// }
							// //jika status = booking
							// if(tenant[i].stat_occupy=="booking") {
							// 	// untuk sort , datanya dimasukan ke list
							// 	refNumFormat=tenant[i].ref_number
							// 	refN=refNumFormat.split(" ")
							// 	refNumber=refN[0]+refN[1]+refN[2]
							// 	tenantName=shortenString(tenantdata[i].full_name,8);
							// 	statingDate=tenant[i].start_date
							// 	propAddr=shortenString(tenant[i].prop_addr,10)
							// 	newObj = {
							// 		"statOccupy":"booking",
							// 		"refNum":refNumber,
							// 		"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
							// 		"tenant_id":i
							// 	}
							// 	listApproveT.push(newObj);
							// }
						} else {  // No payments
							// jika status = approved
							if (tenant[i].stat_occupy=="approved"){
								refNumFormat=tenant[i].ref_number
								refN=refNumFormat.split(" ")
								refNumber=refN[0]+refN[1]+refN[2]
								tenantName=shortenString(tenantdata[i].full_name,8)
								statingDate=tenant[i].start_date
								propAddr=shortenString(tenant[i].prop_addr,10)
								
								// untuk sort , datanya dimasukan ke list
								newObj = {
									"statOccupy":"approved",
									"refNum":refNumber,
									"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",reformatDate(statingDate),propAddr,"<i class='fa fa-check'  style='color:#83E53A'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"','"+i+"')><i class='fa fa-times'></i></button>"],
									"tenant_id":i,
									"start_date":statingDate
								}
								listApproveT.push(newObj);
							}
							//jika status = booking
							if(tenant[i].stat_occupy=="booking") {
								// untuk sort , datanya dimasukan ke list
								refNumFormat=tenant[i].ref_number
								refN=refNumFormat.split(" ")
								refNumber=refN[0]+refN[1]+refN[2]
								tenantName=shortenString(tenantdata[i].full_name,8);
								statingDate=tenant[i].start_date
								propAddr=shortenString(tenant[i].prop_addr,10)
								newObj = {
									"statOccupy":"booking",
									"refNum":refNumber,
									"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",reformatDate(statingDate),propAddr,"<i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"','"+i+"')><i class='fa fa-times'></i></button>"],
									"tenant_id":i,
									"start_date":statingDate
								}
								listApproveT.push(newObj);
							}
						}	
					});
				}
				listApproveT = sortByStatOccupy(listApproveT);
					//add hasil sort ke datatables
				for (i=0;i<listApproveT.length;i++) {
					console.log("in table booking")
					table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
				}
				table1.draw();
			}else{
				setTimeout(() => {
					console.log(tenant)
					console.log(tenantdata)
					console.log(paymentBal)
					console.log(paymentRec)
					console.log(contractdata)
					for (i in tenant){
						paymentRef.child(i).once('value', function(snapshot) {
							if (snapshot.val() != null) {  // Have payments
								// // jika status = approved
								// if (tenant[i].stat_occupy=="approved"){
								// 	refNumFormat=tenant[i].ref_number
								// 	refN=refNumFormat.split(" ")
								// 	refNumber=refN[0]+refN[1]+refN[2]
								// 	tenantName=shortenString(tenantdata[i].full_name,8)
								// 	statingDate=tenant[i].start_date
								// 	propAddr=shortenString(tenant[i].prop_addr,10)
									
								// 	// untuk sort , datanya dimasukan ke list
								// 	newObj = {
								// 		"statOccupy":"approved",
								// 		"refNum":refNumber,
								// 		"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' style='background-color:#c8bca6' disabled><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
								// 		"tenant_id":i
								// 	}
								// 	listApproveT.push(newObj);
								// }
								// //jika status = booking
								// if(tenant[i].stat_occupy=="booking") {
								// 	// untuk sort , datanya dimasukan ke list
								// 	refNumFormat=tenant[i].ref_number
								// 	refN=refNumFormat.split(" ")
								// 	refNumber=refN[0]+refN[1]+refN[2]
								// 	tenantName=shortenString(tenantdata[i].full_name,8);
								// 	statingDate=tenant[i].start_date
								// 	propAddr=shortenString(tenant[i].prop_addr,10)
								// 	newObj = {
								// 		"statOccupy":"booking",
								// 		"refNum":refNumber,
								// 		"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
								// 		"tenant_id":i
								// 	}
								// 	listApproveT.push(newObj);
								// }
							} else {  // No payments
								// jika status = approved
								if (tenant[i].stat_occupy=="approved"){
									refNumFormat=tenant[i].ref_number
									refN=refNumFormat.split(" ")
									refNumber=refN[0]+refN[1]+refN[2]
									tenantName=shortenString(tenantdata[i].full_name,8)
									statingDate=tenant[i].start_date
									propAddr=shortenString(tenant[i].prop_addr,10)
									
									// untuk sort , datanya dimasukan ke list
									newObj = {
										"statOccupy":"approved",
										"refNum":refNumber,
										"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",reformatDate(statingDate),propAddr,"<i class='fa fa-check' style='color:#83E53A'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+i+"')><i class='fa fa-times'></i></button>"],
										"tenant_id":i
									}
									listApproveT.push(newObj);
								}
								//jika status = booking
								if(tenant[i].stat_occupy=="booking") {
									// untuk sort , datanya dimasukan ke list
									refNumFormat=tenant[i].ref_number
									refN=refNumFormat.split(" ")
									refNumber=refN[0]+refN[1]+refN[2]
									tenantName=shortenString(tenantdata[i].full_name,8);
									statingDate=tenant[i].start_date
									propAddr=shortenString(tenant[i].prop_addr,10)
									newObj = {
										"statOccupy":"booking",
										"refNum":refNumber,
										"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",reformatDate(statingDate),propAddr,"<i class='fa fa-check' style='color:#83E53A'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+i+"')><i class='fa fa-times'></i></button>"],
										"tenant_id":i
									}
									listApproveT.push(newObj);
								}
							}	
						});
					}
					listApproveT = sortByStatOccupy(listApproveT);
						//add hasil sort ke datatables
					for (i=0;i<listApproveT.length;i++) {
						console.log("in table booking")
						table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
					}
					table1.draw();
				}, 2000);
			}
		}, 4000);	
	}

	function overdueTable(){
		setTimeout(() => {
			table2.clear()
			if (tenant!={} && tenantdata!={} && overdue!={}){
				for (i in paymentBal){
					var balance = overdue[i].balance;
					//validasi jika balance balance !=0
					if (balance<0){
						var refN = tenant[i].ref_number
						var statOccupy = tenant[i].stat_occupy
						var overdueDate = overdue[i].date_due
						if ((statOccupy=="approved") ||(statOccupy=="active")){
							
							console.log("in table overdue")
							// overdueRef2=firebase.database().ref().child("tenant/"+tenantID);
							var name = shortenString(tenantdata[i].full_name,10) 
							table2.row.add(["<a href='tenant_details.html?id="+i+"' class='pull-left'>"+name+"</a>",refN,reformatDate(overdueDate)]).node().id = 'over'+i;
							
						}
					}
				}
				table2.draw();
			}else{
				setTimeout(() => {
					for (i in paymentBal){
						var balance = parseInt(paymentBal[i]);
						//validasi jika balance balance !=0
						if (balance<0){
							var refN = tenant[i].ref_number
							var statOccupy = tenant[i].stat_occupy
							var recurringD = paymentRec[i]
							if ((statOccupy=="approved") ||(statOccupy=="active")){
								//mengampil pay plan
								var pay_plan = tenant[i].pay_plan
								if(pay_plan=="monthly"){
									pay_plan=-1;
								} else if (pay_plan=="semiannually"){
									pay_plan=-6;
								} else if (pay_plan=="annually"){
									pay_plan=-12;
								}
								
								var recurringDate = new Date(recurringD)
								var overdueDate = recurringDate.addMonths(pay_plan).toString("M/d/yyyy");
								//validasi dengan tanggal hari ini
								if (!dateToday_diff(overdueDate)){
									console.log("in table overdue")
									// overdueRef2=firebase.database().ref().child("tenant/"+tenantID);
									var name = shortenString(tenantdata[i].full_name,10) 
									table2.row.add(["<a href='tenant_details.html?id="+i+"' class='pull-left'>"+name+"</a>",refN,reformatDate(overdueDate)]).node().id = 'over'+i;
									
								}
							}
						}
					}
					table2.draw();
				}, 2000);
			}
		},4000);
	}
	
	function expiredTable(){
		setTimeout(() => {
			table3.clear();
			if (contractdata!={} && tenant!={} && tenantdata!={}){
				for (j in contractdata){
					var endDate = contractdata[j].end_date
					if ((endDate != "Ongoing") && (date_diff_indays(getToday,endDate) >= 0) && (date_diff_indays(getToday,endDate) <= 31) ) {
						console.log("in table expired")
						refNumFormat = tenant[j].ref_number
						tenantName = tenantdata[j].full_name
						name = shortenString(tenantName,10);
						table3.row.add(["<a href='tenant_details.html?id="+j+"' class='pull-left'>"+name+"</a>",refNumFormat,reformatDate(endDate),"<button class='btn btn-xs btn-primary' title='Send Email' ><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-success' title='Extend' onclick=window.location='tenant_details.html?id="+j+"#extend'><i class='fa fa-plus'></i></button> <button class='btn btn-xs btn-danger' title='End Contract' onclick=window.location='tenant_details.html?id="+j+"#end'><i class='fa fa-times'></i></button> <button class='btn btn-xs btn-warning' title='Non Active' onclick=window.location='tenant_details.html?id="+j+"#non-active'><i class='fa fa-minus'></i></button>"]).node().id = j;							
					}
				}
				table3.draw();
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				})
			}else{
				setTimeout(() => {
					for (j in contractdata){
						if ((endDate != "Ongoing") && (date_diff_indays(getToday,endDate) >= 0) && (date_diff_indays(getToday,endDate) <= 31) ) {
							console.log("in table expired")
							refNumFormat = tenant[j].ref_number
							tenantName = tenantdata[j].full_name
							name = shortenString(tenantName,10);
							table3.row.add(["<a href='tenant_details.html?id="+j+"' class='pull-left'>"+name+"</a>",refNumFormat,reformatDate(endDate),"<button class='btn btn-xs btn-primary' title='Send Email' ><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-success' title='Extend' onclick=window.location='tenant_details.html?id="+j+"#extend'><i class='fa fa-plus'></i></button> <button class='btn btn-xs btn-danger' title='End Contract' onclick=window.location='tenant_details.html?id="+j+"#end'><i class='fa fa-times'></i></button> <button class='btn btn-xs btn-warning' title='Non Active' onclick=window.location='tenant_details.html?id="+j+"#non-active'><i class='fa fa-minus'></i></button>"]).node().id = j;			
							
						}
					}
					table3.draw();
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				}, 2000);
			}
		}, 4000);
	}

	function keyTable(){
		setTimeout(() => {
			table6.clear()
			if (tenant!={} && tenantdata!={}){
				for (i in paymentBal){
					var statingDate = tenant[i].start_date
					var keyDate = tenant[i].key_date
					var statOccupy = tenant[i].stat_occupy
					var refN = tenant[i].ref_number
					var note = tenant[i].notes
					var noteIcon=""
					var note1=""
					if(note==null){
						note1=""
						noteIcon=""
					} else {
						note=note.replace("\n", " ");
						note1=note
						noteIcon = "<button class='btn btn-xs btn-danger tip' data-position='top-center' data-tip='"+note+"'>"+"<i class='fa fa-comments-o'></i>"+"</button>"
					}
					var refN1= refN.split(" ");
					var refNumber = refN1[0]+refN1[1]+refN1[2];
					if ((statOccupy=="approved") ||(statOccupy=="active")){
						console.log("in table key")
						var name = tenantdata[i].full_name
						name = shortenString(name,8);
						table6.row.add(["<a href='tenant_details.html?id="+i+"' class='pull-left'>"+name+"</a>",refN,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+i+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+i;
						
						$(".tip").tip();
					}
				}
				table6.draw();
			}else{
				setTimeout(() => {
					for (i in paymentBal){
						var statingDate = tenant[i].start_date
						var keyDate = tenant[i].key_date
						var statOccupy = tenant[i].stat_occupy
						var refN = tenant[i].ref_number
						var note = tenant[i].notes
						var noteIcon=""
						var note1=""
						if(note==null){
							note1=""
							noteIcon=""
						} else {
							note=note.replace("\n", " ");
							note1=note
							noteIcon = "<button class='btn btn-xs btn-danger tip' data-position='top-center' data-tip='"+note+"'>"+"<i class='fa fa-comments-o'></i>"+"</button>"
						}
						var refN1= refN.split(" ");
						var refNumber = refN1[0]+refN1[1]+refN1[2];
						if ((statOccupy=="approved") ||(statOccupy=="active")){
							console.log("in table key")
							var name = tenantdata[i].full_name
							name = shortenString(name,8);
							table6.row.add(["<a href='tenant_details.html?id="+i+"' class='pull-left'>"+name+"</a>",refN,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+i+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+i;
							
							$(".tip").tip();
						}
					}
					table6.draw();
				}, 2000);
			}
		}, 4000);
	}

	function autocompleteFunction(){
		setTimeout(() => {
			tenantNames = [];
			if (tenant!={} && tenantdata!={}){
				for (i in tenant){
					var statOccupy=tenant[i].stat_occupy
					var refN = tenant[i].ref_number
					var refN1= refN.split(" ");
					var refNumber=refN1[0]+refN1[1]+refN1[2];
					// mengambil data tenant yang status nya approved atau active
					if ((statOccupy=="approved") ||(statOccupy=="active")){
						var full_name=tenantdata[i].full_name
						newObj = {
							"label":full_name +' ('+refN+')',
							"tenantid":i,
							"refnumber":refNumber
						}
						tenantNames.push(newObj);
						//start invoice tenant autocomplete
						$("#invoiceTenantName").autocomplete({
							source: function(request, response) {
								var results = $.ui.autocomplete.filter(tenantNames, request.term);
								response(results.slice(0, 10));
							},
							select: function(event, ui) {
								$("#invoiceTenantName").val(ui.item.label.split("(")[0].slice(0,-1));
								$("#invoiceTenantID").val(ui.item.tenantid);
								$("#invoiceTenantRef").val(ui.item.refnumber);
								return false;
							}
						});
						//start payment tenant autocomplete
						$("#paymentTenantName").autocomplete({
							source: function(request, response) {
								var results = $.ui.autocomplete.filter(tenantNames, request.term);
								response(results.slice(0, 10));
							},
							select: function(event, ui) {
								$("#paymentTenantName").val(ui.item.label.split("(")[0].slice(0,-1));
								$("#paymentTenantID").val(ui.item.tenantid);
								$("#paymentTenantRef").val(ui.item.refnumber);
								return false;
							}
						});
					}
				}

			}
			
			//sort array ascending based on name
			tenantNames.sort(function(a, b){
				var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase();
				if (nameA < nameB) //sort string ascending
					return -1;
				if (nameA > nameB)
					return 1;
				return 0; //default return value (no sorting)
			});
		}, 4000);
	}

	
	function editKeyCollectDate() {

		var keyDate = $("#keyDate").val();
		var notes = $("#notes").val();
		noteIcon = "<button class='btn btn-xs btn-danger tip' data-position='top-center' data-tip='"+notes+"'>"+"<i class='fa fa-comments-o'></i>"+"</button>"
		if(notes==""){
			notes=null;
		}
		var keyTenantID = $("#keyTenantID").val();
		var refNumber = $("#keyTenantRef").val()
		var keyTenantRef = $("#keyTenantRef").val().substring(0,7);
		var keyDateRef = firebase.database().ref("tenant-room/"+keyTenantID+"/"+keyTenantRef);
		var name = tenantdata[keyTenantID].full_name
		var statingDate = tenant[keyTenantID].start_date
		name = shortenString(name,8);
		var row = table6.row('#key'+keyTenantID);
		row.remove();
		if (notes!=null){
			table6.row.add(["<a href='tenant_details.html?id="+keyTenantID+"' class='pull-left'>"+name+"</a>",refNumber,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+keyTenantID+"\",\""+refNumber+"\",\""+notes+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+keyTenantID;
			table6.draw();
		}else {
			table6.row.add(["<a href='tenant_details.html?id="+keyTenantID+"' class='pull-left'>"+name+"</a>",refNumber,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+keyTenantID+"\",\""+refNumber+"\",\""+notes+"\")'>"+keyDate+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+keyTenantID;
			table6.draw();
		}
		keyDateRef.update({
			"key_date":keyDate,
			"notes":notes
		}).then(function onSuccess(res) {
			//success notification
			$.gritter.add({
				title: 'Key Collection Date Edited',
				text: "Key collection date successfully edited",
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		}).catch(function onError(err) {
			//error notification
			$.gritter.add({
				title: 'Error Edit Key Collection Date',
				text: err.code+" : "+err.message,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		});
	
	}
	
	
	//start invoice tenant autocomplete
	$("#invoiceTenantName").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(tenantNames, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#invoiceTenantName").val(ui.item.label.split("(")[0].slice(0,-1));
			$("#invoiceTenantID").val(ui.item.tenantid);
			$("#invoiceTenantRef").val(ui.item.refnumber);
			$("#invoiceTenantName").attr("disabled",true);
			return false;
		}
	});
	//start payment tenant autocomplete
	$("#paymentTenantName").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(tenantNames, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#paymentTenantName").val(ui.item.label.split("(")[0].slice(0,-1));
			$("#paymentTenantID").val(ui.item.tenantid);
			$("#paymentTenantRef").val(ui.item.refnumber);
			$("#paymentTenantName").attr("disabled",true);
			return false;
		}
	});

	//start key datepicker
	$('#keyDatePicker').datepicker({
		autoclose: true,
		minDate: 0,
	})

	//start invoice datepicker
	$('#invoiceDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	})
	//start payment datepicker
	$('#paymentDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	})
	
	$("#invoiceDate").val(reformatDate(getTodayDate()));
	$("#paymentDate").val(reformatDate(getTodayDate()));
	
	//approve modal add listener
	$("#confirmApprove").click(function() {
		var BrefNumber = $("#approveM").val();
		// get Ref Number
		var refNumber = BrefNumber.split("booking")[1];
		// get tenant ID
		var tenantID;
		console.log(refNumber)
		for (i=0;i<listApproveT.length;i++){
			if(listApproveT[i].refNum==refNumber){
				tenantID = listApproveT[i].tenant_id; 
				break
			}
		}
		//get room id
		var roomID=refNumber.substring(0,refNumber.length-2);
		//update data booking to approved
		var trRef = firebase.database().ref("tenant-room/"+tenantID+"/"+roomID);
		trRef.update({
			'stat_occupy':'approved'
		});
		//mengambil apply date, rent price , prop_addr
		trRef.once('value', function(snapshot) {
			var applyDate1=snapshot.child("apply_date").val();
			var rent_price1=snapshot.child("rent_price").val();
			var rent_bond1=snapshot.child("rent_bond").val();
			var total = parseInt(rent_price1)+parseInt(rent_bond1);
			var propAddr1=snapshot.child("prop_addr").val();
			// send email
			sendEmail(tenantID,roomID,total,propAddr1);
		})
		$("#approve_booking"+refNumber).prop("style","background-color:#c8bca6")
		$("#approve_booking"+refNumber).prop("disabled",true)
	})
	
	//remove approve modal add listener
	$("#removeApprove").click(function() {
		startPageLoad();
		var refNumber = $("#approveD").val();
		var tenantID = $("#approveD2").val();
		
		var tenantRef = firebase.database().ref("tenant");
		var trRef = firebase.database().ref("tenant-room");
		var contractRef = firebase.database().ref("contract");
		contractRef.child(tenantID).remove(
		).then(function onSuccess(res) {
			tenantRef.child(tenantID).remove(
			).then(function onSuccess(res) {
				trRef.child(tenantID).remove(
				).then(function onSuccess(res) {
					trRef.once("value", function(snapshot) {
						var tenantCount = parseInt(snapshot.child("total_tenant").val()) - 1;
						trRef.update({
							total_tenant : tenantCount
						}).then(function onSuccess(res) {
							
							var row = table1.row('#'+refNumber);
							row.remove();
							table1.draw(false);
							addNotification("Booking removed","Booking successfully removed.");
							stopPageLoad();
						}).catch(function onError(err) {
							addNotification("Error Remove Booking",err.code+" : "+err.message);
						});
					});
				}).catch(function onError(err) {
					addNotification("Error Remove Booking",err.code+" : "+err.message);
				});
			}).catch(function onError(err) {
				addNotification("Error Remove Booking",err.code+" : "+err.message);
			});
		}).catch(function onError(err) {
			addNotification("Error Remove Booking",err.code+" : "+err.message);
		});
	});
	
	//invoice add button listener
	$("#invoiceb").on('click', function() {
		$("#addInvoiceModal").modal();
	})
	//invoice amount listener
	$("#invoiceAmount").on('keyup change', function() {
		$("#invoiceAmount").val(get_moneydot($("#invoiceAmount").val()));
	})
	//invoice modal details listener
	$("#invoiceDetails").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "otherdue") {
			$("#invoiceDetailsOtherBlock").fadeIn(250, function() {
				$(this).show();
			})
		} else {
			$("#invoiceDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
		}
	})
	//invoice modal add listener
	$("#addInvoiceButton").click(function() {
		$("#addInvoiceForm").submit();
	})
	//invoice add form validation
	$("#addInvoiceForm").validate({
		submitHandler: function() {
			$('#addInvoiceModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			})
			if ($('#invoiceTenantID').val()!="" && $('#invoiceTenantRef').val()!=""){
				addInvoice();
			}
		}
	})
	//payment add button listener
	$("#paymentb").on('click', function() {
		$("#addPaymentModal").modal();
	})
	//payment bond checkbox listener
	$("input[type=checkbox][name=paymentBond]").on('change', function() {
		if (this.checked) {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
			removeOptions(document.getElementById("paymentDetails"));
			var optionElement1 = document.createElement("option");
			var optionElement2 = document.createElement("option");
			var optionElement3 = document.createElement("option");
			optionElement1.value = "transfer";
			optionElement1.innerHTML = "Bond Money Transfer";
			optionElement2.value = "refund";
			optionElement2.innerHTML = "Bond Money Refund";
			optionElement3.value = "bondpay";
			optionElement3.innerHTML = "Bond Money Payment";
			document.getElementById("paymentDetails").appendChild(optionElement1);
			document.getElementById("paymentDetails").appendChild(optionElement2);
			document.getElementById("paymentDetails").appendChild(optionElement3);
		} else {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
			removeOptions(document.getElementById("paymentDetails"));
			var optionElement1 = document.createElement("option");
			var optionElement2 = document.createElement("option");
			var optionElement3 = document.createElement("option");
			var optionElement4 = document.createElement("option");
			optionElement1.value = "rentpay";
			optionElement1.innerHTML = "Rental Payment";
			optionElement2.value = "finepay";
			optionElement2.innerHTML = "Fine Payment";
			optionElement3.value = "bondpay";
			optionElement3.innerHTML = "Bond Money Payment";
			optionElement4.value = "otherpay";
			optionElement4.innerHTML = "Other Payment";
			document.getElementById("paymentDetails").appendChild(optionElement1);
			document.getElementById("paymentDetails").appendChild(optionElement2);
			document.getElementById("paymentDetails").appendChild(optionElement3);
			document.getElementById("paymentDetails").appendChild(optionElement4);
		}
	})
	//payment amount listener
	$("#paymentAmount").on('keyup change', function() {
		$("#paymentAmount").val(get_moneydot($("#paymentAmount").val()));
	})
	//payment modal details listener
	$("#paymentDetails").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "otherpay") {
			$("#paymentDetailsOtherBlock").fadeIn(250, function() {
				$(this).show();
			})
		} else {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
		}
	})
	//payment modal draggable
	$("#addPaymentModal").draggable({
		handle: ".modal-header"
	});
	$("#addInvoiceModal").draggable({
		handle: ".modal-header"
	});
	$("#approveModal").draggable({
		handle: ".modal-header"
	});
	$("#editKeyDateModal").draggable({
		handle: ".modal-header"
	});
	$("#rApproveModal").draggable({
		handle: ".modal-header"
	});

	//payment modal add listener
	$("#addPaymentButton").click(function() {
		$("#addPaymentForm").submit();
	})
	//payment add form validation
	$("#addPaymentForm").validate({
		submitHandler: function() {
			$('#addPaymentModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			})
			if ($('#paymentTenantID').val()!="" && $('#paymentTenantRef').val()!=""){
				addPayment();
			}
		}
	})
	
	//start key datepicker
	$('#keyDatePicker').datepicker({
		autoclose: true
	})
	//key date modal edit listener
	$("#editKeyDateButton").click(function() {
		$("#editKeyDateForm").submit();
	})
	//key date edit form validation
	$("#editKeyDateForm").validate({
		submitHandler: function() {
			$('#editKeyDateModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			editKeyCollectDate();
		}
	})
	
	
})