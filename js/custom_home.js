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

function sumMonth(date,month) {
  var d = new Date(date);
  d.setMonth(d.getMonth()+month);
  newDate = String(d).split(" ")
  var endMonth = newDate[1];
  var endDay = newDate[2];
  var endYear = newDate[3];
  return reformatDate2(endDay+"-"+endMonth+"-"+endYear);
}

function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
}

function addInvoice() {
	var invoiceAmount = parseInt(rem_moneydot($("#invoiceAmount").val()))
		console.log($("#invoiceAmount").val())
		var refNumberHtml = $("#invoiceTenantRef").val();
		var ref_num = $("#invoiceTenantRef").val().split(" ").join("")
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

		

		reportRef = firebase.database().ref().child("reportAccount2");
		paymentRef = firebase.database().ref().child("payment/"+id);
		var recurringRef = firebase.database().ref("recurringPay/"+id)

		// var invoiceRecurrent = $("#invoiceRecurrent").val(); 
		// if (invoiceRecurrent != "onetime"){
		// 	recurringRef.on("value", function(snapshot){
		// 		var total = (snapshot.child("total_recurring").val())+1
		// 		recurringRef.child("due:"+total).update({
		// 			"rent":invoiceAmount,
		// 			"date":invoiceDate,
		// 			"payPlan": invoiceRecurrent,
		// 			"status": "active",
		//			"details": invoiceDetailsOther
		// 		})
		// 	})
		// }


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
		
		reportRef.child(building_id+"/"+id).push({
			"due":invoiceAmount,
			"receive": 0,
			"date":invoiceDate,
			"inputDate": thisDate,
			"refNumb": refNumberHtml
		})
		
		
	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		//reset invoice form
		$('#addInvoiceForm').trigger("reset");
		
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
			window.location='tenant_details.html?'+id+"?"+ref_num+"#ledger";
		}, 1000);
	}, 1000);
	
	
}

var bondList = [];
var ledgerList = [];
var bondWaitDue = 0;
var historyperiod = 1;

function addPayment() {

	function checkFirstPayment(id,building_id,refNumber,date,room_id){
		
		var fpayRef = firebase.database().ref().child("first-payment/"+id);
		var reportRef = firebase.database().ref().child("reportAccount2/"+building_id+"/"+id);
		var recurring = firebase.database().ref("recurringPay/"+id)
		var contract  = firebase.database().ref("newContract/"+id+"/"+room_id)
		var booking = firebase.database().ref().child("booking-tenant/"+id)
		fpayRef.on('value', function(snapshot){
			var payment = snapshot.child("payment").val();
			var balance = snapshot.child("bond-balance").val();
			
			if(payment==0){
				contract.on("value", function(snapshot){
					
					var historyperiod = snapshot.child("historyperiod").val().toString()
					
					contract.child(historyperiod).on("value", function(snapshot){
						var payPlan = snapshot.child("payPlan").val()
						var rent = snapshot.child("rent").val()
						
						if (payPlan=="monthly"){
							
							recurring.update({
								"total_recurring": 0
							})
							recurring.child("rental").set({
								"payPlan": payPlan,
								"payment": "pay",
								"prevRecurringDate": new Date(date).addMonths(1).toString("MM/d/yyyy"),
								"rent": rent,
								"status": "active"
								}).then(function onSuccess(res) {		
									reportRef.push({
										"date":date,
										"due": balance,
										"inputDate":Date.today().toString("MM/d/yyyy"),
										"receive":0,
										"refNumb":refNumber,
									}).then(function onSuccess(res){
										booking.set({
											"status": "booked"
										})
										}).catch(function onError(err) {
											return "unsuccess"
										});	
								}).catch(function onError(err) {
									return "unsuccess"
								});
							
						}else if(payPlan == "semiannually"){
							recurring.update({
								"total_recurring": 0
							})
							recurring.child("rental").set({
								"payPlan": payPlan,
								"payment": "pay",
								"prevRecurringDate": new Date(date).addMonths(6).toString("MM/d/yyyy"),
								"rent": rent,
								"status": "active"
								}).then(function onSuccess(res) {
									reportRef.push({
										"date":date,
										"due": balance,
										"inputDate":Date.today().toString("MM/d/yyyy"),
										"receive":0,
										"refNumb":refNumber,
									}).then(function onSuccess(res){
										booking.set({
											"status": "booked"
										})
									}).catch(function onError(err) {
											return "unsuccess"
										});	
								}).catch(function onError(err) {
									return "unsuccess"
								});
							
						}else if(payPlan == "annually"){
							recurring.update({
								"total_recurring": 0
							})
							recurring.child("rental").set({
								"payPlan": payPlan,
								"payment": "pay",
								"prevRecurringDate": new Date(date).addMonths(12).toString("MM/d/yyyy"),
								"rent": rent,
								"status": "active"
								}).then(function onSuccess(res) {
									reportRef.push({
										"date":date,
										"due": balance,
										"inputDate":Date.today().toString("MM/d/yyyy"),
										"receive":0,
										"refNumb":refNumber,
									}).then(function onSuccess(res){
										booking.set({
											"status": "booked"
										})
									}).catch(function onError(err) {
											return "unsuccess"
										});	
								}).catch(function onError(err) {
									return "unsuccess"
								});
							
						}
						
					})
				})
						
			}else{
				return "success"
			}
		})
	}
	
	function resetPaymentForm() {
		//reset payment form
		$('#addPaymentForm').trigger("reset");
		$("#paymentDetailsOtherBlock").hide();
		$("#paymentDetailsAdjustBlock").hide();
		removeOptions(document.getElementById("paymentDetails"));
		var optionElement1 = document.createElement("option");
		var optionElement2 = document.createElement("option");
		var optionElement3 = document.createElement("option");
		var optionElement4 = document.createElement("option");
		var optionElement5 = document.createElement("option");
		optionElement1.value = "rentpay";
		optionElement1.innerHTML = "Rental Payment";
		optionElement2.value = "finepay";
		optionElement2.innerHTML = "Fine Payment";
		optionElement3.value = "bondpay";
		optionElement3.innerHTML = "Bond Money Payment";
		optionElement4.value = "adjustpay";
		optionElement4.innerHTML = "Adjustment";
		optionElement5.value = "otherpay";
		optionElement5.innerHTML = "Other Payment";
		document.getElementById("paymentDetails").appendChild(optionElement1);
		document.getElementById("paymentDetails").appendChild(optionElement2);
		document.getElementById("paymentDetails").appendChild(optionElement3);
		document.getElementById("paymentDetails").appendChild(optionElement4);
		document.getElementById("paymentDetails").appendChild(optionElement5);
	}
	
	// get id , refnum
	var refNumberHtml = $("#paymentTenantRef").val();
	var id = $("#paymentTenantID").val();
	var building_id = refNumberHtml.substring(1,3);
	var room_id = refNumberHtml.substring(0,7)
	//init firebase
	paymentRef = firebase.database().ref().child("payment/"+id);
	fpayRef = firebase.database().ref().child("first-payment/"+id);
	overdueRef = firebase.database().ref().child("overdue/"+id);
	reportRef = firebase.database().ref().child("reportAccount2");
	//collect data from payment form
	var paymentDate = reformatDate2($("#paymentDate").val());
	var paymentAmount = parseInt($("#paymentAmountCond").val()+rem_moneydot($("#paymentAmount").val()));
	var paymentDetails = $("#paymentDetails").val();
	var paymentDetailsOther = $("#paymentDetailsOther").val();
	var paymentDetailsAdjust = $("#paymentDetailsAdjust").val();
	var adjst_details = $("#adjstDetails").val()
	var adjst_date = $("#adjstDate").val()
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
	}  else if (paymentDetails == "adjustpay") {
		var paymentDetailsFull = "Adjustment - "+adjst_details+" on "+adjst_date;
		var date = reformatDate2(adjst_date)
		month = date.split("/")[0]
		year = date.split("/")[2]
		if (adjst_details=="Rental Due"){
			virtual.child(month+":"+year).remove()
		}
	}else {
		var paymentDetailsFull = "Other Payment - "+paymentDetailsOther;
	}

	checkFirstPayment(id,building_id,refNumberHtml,paymentDate,room_id)
	
	setTimeout(() => {
		stage1();
	}, 5000);
	
	
	
	function stage1() {
		overdueRef.once('value', function(snapshot){
			var prevDue = snapshot.child("balance").val();
			if (prevDue==null) {
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=snapshot.child("rent_bond").val();
					var rent = snapshot.child("rent_price").val();
					var startDate = snapshot.child("start_date").val();
					overdueRef.update({
						"balance":(paymentAmount-bondPrice-rent),
						"date_due": startDate
					}).then(function onSuccess(res) {
						stage2();
					}).catch(function onError(err) {
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
						//error notification
						$.gritter.add({
							title: 'Error Stage 1a',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
					});
				});
			} else {
				overdueRef.update({
					"balance": parseInt(prevDue) + paymentAmount,
				}).then(function onSuccess(res) {
					stage2();
				}).catch(function onError(err) {
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
					//error notification
					$.gritter.add({
						title: 'Error Stage 1b',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
				});
			}
		});
	}
	
	function stage2() {
		paymentRef.once('value', function(snapshot){
			if (snapshot.child("balance").val()==null){
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=snapshot.child("rent_bond").val();
					var rent = snapshot.child("rent_price").val()
					
					paymentRef.update({
						"balance": (paymentAmount-bondPrice-rent).toString(),
						"receive": paymentAmount
					}).then(function onSuccess(res) {
						stage3();
					}).catch(function onError(err) {
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
						//error notification
						$.gritter.add({
							title: 'Error Stage 2a',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
					});
				});
			} else {
				var prevBalance = parseInt(snapshot.child("balance").val());
				var prevRec =parseInt(snapshot.child("receive").val());
				paymentRef.update({
					"balance": (prevBalance + paymentAmount).toString(),
					"receive": paymentAmount+prevRec
				}).then(function onSuccess(res) {
					stage3();
				}).catch(function onError(err) {
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
					//error notification
					$.gritter.add({
						title: 'Error Stage 2b',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
				});
			}
		});
	}
	
	function stage3() {
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

		if(paymentDetails=="refund"){
			reportRef.child(building_id+"/"+id).push({
				"due":paymentAmount,
				"receive": 0,
				"date": paymentDate,
				"inputDate": thisDate,
				"refNumb": refNumberHtml,
			}).then(function onSuccess(res) {
				stage4();
			}).catch(function onError(err) {
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
				//error notification
				$.gritter.add({
					title: 'Error Stage 3',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
			});
		}else if(paymentDetails=="transfer"){
			reportRef.child(building_id+"/"+id).push({
				"due":0,
				"receive": paymentAmount,
				"date": paymentDate,
				"inputDate": thisDate,
				"refNumb": refNumberHtml,
			}).then(function onSuccess(res) {
				stage4()
			}).catch(function onError(err) {
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
				//error notification
				$.gritter.add({
					title: 'Error Stage 3',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
			});
		}else{
			reportRef.child(building_id+"/"+id).push({
				"receive":paymentAmount,
				"due": 0,
				"date": paymentDate,
				"inputDate": thisDate,
				"refNumb": refNumberHtml,
			}).then(function onSuccess(res) {
				stage4();
			}).catch(function onError(err) {
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
				//error notification
				$.gritter.add({
					title: 'Error Stage 3',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
			});
		}
		
		
	}
	
	function stage4() {
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
							}).then(function onSuccess(res){
								fpayRef.update({
									"bond-balance": bondLeft,
									"payment": 1
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":paymentDetailsFull,
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										if (bondLeft != 0) {
											paymentRef.push({
												"date":paymentDate,
												"desc":"Rental Payment",
												"invoice":null,
												"payment":bondLeft,
												"refnumber":refNumberHtml,
												"list":"ledgerList"
											}).then(function onSuccess(res) {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-111c',
													text: err.code+" : "+err.message,
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
													title: 'Error Stage 4-111c',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});;
										} else {									
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-111b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-111a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								})
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-111a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							})
						} else {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								stage5();
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-112',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}
					} else {
						bondWaitDue -= paymentAmount;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"bondList"
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":paymentDetailsFull,
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res){
									fpayRef.update({
										"bond-balance": 0,
										"payment": 1
									}).then(function onSuccess(res) {
									stage5();
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-12c',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-12b',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-12a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-12a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
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
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": bondLeft,
											"payment": 1
										}).then(function onSuccess(res) {
											if (bondLeft != 0) {
												paymentRef.push({
													"date":paymentDate,
													"desc":"Rental Payment",
													"invoice":null,
													"payment":bondLeft,
													"refnumber":refNumberHtml,
													"list":"ledgerList"
												}).then(function onSuccess(res) {
													bondWaitDue = 0;
													//set bond wait due
													paymentRef.update({
														"bondWaitDue" : bondWaitDue
													}).then(function onSuccess(res) {
														stage5();
													}).catch(function onError(err) {
														//stop loading icon
														$("#cover-spin").fadeOut(250, function() {
															$(this).hide();
														});
														//error notification
														$.gritter.add({
															title: 'Error Stage 4-2111d',
															text: err.code+" : "+err.message,
															image: './img/bell.png',
															sticky: false,
															time: 3500,
															class_name: 'gritter-custom'
														});
													});
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-2111c',
														text: err.code+" : "+err.message,
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
														title: 'Error Stage 4-2111c',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												})
											
										} else {
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-2111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-2111b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-2111a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							})
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-2112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": 0,
											"payment": 1
										}).then(function onSuccess(res) {
										stage5();
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-212c',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-212b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-212a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-212a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
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
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":paymentDetailsFull,
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								stage5();
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-22b',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-22a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
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
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": bondLeft,
											"payment": 1
										}).then(function onSuccess(res) {
											if (bondLeft != 0) {
												paymentRef.push({
													"date":paymentDate,
													"desc":"Rental Payment",
													"invoice":null,
													"payment":bondLeft,
													"refnumber":refNumberHtml,
													"list":"ledgerList"
												}).then(function onSuccess(res) {
													bondWaitDue = 0;
													//set bond wait due
													paymentRef.update({
														"bondWaitDue" : bondWaitDue
													}).then(function onSuccess(res) {
														stage5();
													}).catch(function onError(err) {
														//stop loading icon
														$("#cover-spin").fadeOut(250, function() {
															$(this).hide();
														});
														//error notification
														$.gritter.add({
															title: 'Error Stage 4-3111d',
															text: err.code+" : "+err.message,
															image: './img/bell.png',
															sticky: false,
															time: 3500,
															class_name: 'gritter-custom'
														});
													});
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-3111c',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											} else {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-3111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-3111b',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-3111a',
											text: err.code+" : "+err.message,
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
											title: 'Error Stage 4-3111a',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									})
								})
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-3112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": 0,
											"payment": 1
										}).then(function onSuccess(res) {
										stage5();
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-312c',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-312b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-312a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-312a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
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
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":paymentDetailsFull,
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Withdraw",
									"invoice":paymentAmount,
									"payment":null,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-32c',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-32b',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-32a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
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
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": bondLeft,
											"payment": 1
										}).then(function onSuccess(res) {
											if (bondLeft != 0) {
												paymentRef.push({
													"date":paymentDate,
													"desc":"Rental Payment",
													"invoice":null,
													"payment":bondLeft,
													"refnumber":refNumberHtml,
													"list":"ledgerList"
												}).then(function onSuccess(res) {
													bondWaitDue = 0;
													//set bond wait due
													paymentRef.update({
														"bondWaitDue" : bondWaitDue
													}).then(function onSuccess(res) {
														stage5();
													}).catch(function onError(err) {
														//stop loading icon
														$("#cover-spin").fadeOut(250, function() {
															$(this).hide();
														});
														//error notification
														$.gritter.add({
															title: 'Error Stage 4-4111d',
															text: err.code+" : "+err.message,
															image: './img/bell.png',
															sticky: false,
															time: 3500,
															class_name: 'gritter-custom'
														});
													});
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-4111c',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											} else {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-4111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-4111b',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-4111a',
											text: err.code+" : "+err.message,
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
											title: 'Error Stage 4-4111a',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									})
								})
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-4112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res){
										fpayRef.update({
											"bond-balance": 0,
											"payment": 1
										}).then(function onSuccess(res) {
										stage5();
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-412c',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-412b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-412a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-412a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							})
						}
					} else {
						paymentRef.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						}).then(function onSuccess(res) {
							stage5();
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-42',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
						});
					}
				}

				/* //bond money payment
				if ($("#paymentBond").prop("checked")) {
					//bond money ledger
					if (paymentDetails == "bondpay") { //payment
						bondList.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount
						});
					} else { //transfer & refund
						bondList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":paymentAmount,
							"payment":null
						});
					}
					bondList = sortArrayByDate(bondList);
					table.clear();
					for (x in bondList) {
						table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
					}
					table.draw();
					countTotalBondDue();
					countTotalBondReceived();
					countBondBalance();
					countTotalBondBalance();
					//standard ledger
					if (paymentDetails == "refund") { //refund
						ledgerList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount
						});
						ledgerList.push({
							"date":paymentDate,
							"desc":"Bond Money Withdraw",
							"invoice":paymentAmount,
							"payment":null
						});
					} else { //transfer & payment
						ledgerList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount
						});
					}
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
				//standard payment
				} else {
					if (paymentDetails == "bondpay") { //payment
						bondList.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount
						});
						bondList = sortArrayByDate(bondList);
						table.clear();
						for (x in bondList) {
							table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
						}
						table.draw();
						countTotalBondDue();
						countTotalBondReceived();
						countBondBalance();
						countTotalBondBalance();
					}
					ledgerList.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount
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
				} */
			});
		});
	}
	
	function stage5() {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
		resetPaymentForm();
		//success notification
		$.gritter.add({
			title: 'Payment Added',
			text: 'Payment was successfully added to the database.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
	}
		
}

//delete booking in table
function deleteBooking(refNumber,tenantID){
	$('#approveD').html("Are you sure to delete "+refNumber+" ?");
	$('#approveD3').val(refNumber);
	$('#approveD2').val(tenantID);
	$("#rApproveModal").modal();
}

//collect booking in table
function collectBooking(refNumber,tenantID){
	$('#collectD').html("Are you sure to collect "+refNumber+" ?");
	$('#collectD').val(refNumber);
	$('#collectD2').val(tenantID);
	$("#cApproveModal").modal();
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


function pushRentalDue(){
	today = Date.today()
}


$(document).ready(function() {
	//get data from database
	tenant={}
	tenantdata={}
	paymentBal={}
	paymentRec={}
	contractdata={}
	overdue={}
	booking={}

	//boolean variable if there is a change
	tenantChange = false
	changeContract = false
	paymentChange = false
	
	//firebase ref
	var trRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref().child("tenant");
	var contractRef = firebase.database().ref().child("newContract");
	var paymentRef =firebase.database().ref().child("payment");
	var overdueRef = firebase.database().ref().child("overdue");
	var bookingRef = firebase.database().ref().child("booking-tenant");
	var getToday = Date.today().toString("MM/dd/yyyy");
	var recurringRef = firebase.database().ref().child("recurringPay")

	//fill list with database object
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
	bookingRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;	
		bookingRef.child(tenantID).once('child_added', function(snapshot) {
			//get starting date , building address , status occupy , ref id
			if (tenantID!="total_tenant"){
				booking[tenantID]=snapshot.val()
			}
		});
		bookingRef.child(tenantID).on('child_changed', function(snapshot) {
			tenantChange = true
			booking[tenantID]=snapshot.val()
			var row = table6.row('#key'+tenantID);
			row.remove();
		});
		bookingRef.child(tenantID).on('child_removed', function(snapshot) {
			//get ref ID
			var refN=snapshot.child("ref_number").val().split(" ");
			var refNumber=refN[0]+refN[1]+refN[2];
			// remove row changed
			var row = table1.row('#booking'+refNumber);
			row.remove();
		});
	});
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
					console.log(i)
					var balance = overdue[i].balance;
					//validasi jika balance balance !=0
					if (balance<0){
						var refN = tenant[i].ref_number
						var re_num =tenant[i].ref_number.split(" ").join("")
						var statOccupy = tenant[i].stat_occupy
						var overdueDate = overdue[i].date_due
						if ((statOccupy=="approved") ||(statOccupy=="active")){
							
							console.log("in table overdue")
							// overdueRef2=firebase.database().ref().child("tenant/"+tenantID);
							var name = shortenString(tenantdata[i].full_name,10) 
							table2.row.add(["<a href='tenant_details.html?"+i+"?"+re_num+"' class='pull-left'>"+name+"</a>",refN,reformatDate(overdueDate)]).node().id = 'over'+i;
							
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
							var re_num =  tenant[i].ref_number.split(" ").join("")
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
									table2.row.add(["<a href='tenant_details.html?"+i+"?"+re_num+"' class='pull-left'>"+name+"</a>",refN,reformatDate(overdueDate)]).node().id = 'over'+i;
									
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
						ref_num = tenant[j].ref_number.split(" ").join("")
						tenantName = tenantdata[j].full_name
						name = shortenString(tenantName,8);
						table3.row.add(["<a href='tenant_details.html?"+j+"?"+ref_num+"' class='pull-left'>"+name+"</a>",refNumFormat,reformatDate(endDate),"<button class='btn btn-xs btn-primary' title='Send Email' ><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-success' title='Extend' onclick=window.location='tenant_details.html?"+j+"?"+ref_num+"#extend'><i class='fa fa-plus'></i></button> <button class='btn btn-xs btn-danger' title='End Contract' onclick=window.location='tenant_details.html?id="+j+"?"+ref_num+"#end'><i class='fa fa-times'></i></button> <button class='btn btn-xs btn-warning' title='Non Active' onclick=window.location='tenant_details.html?"+j+"?"+ref_num+"#non-active'><i class='fa fa-minus'></i></button>"]).node().id = j;							
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
							ref_num = tenant[j].ref_number.split(" ").join("")
							tenantName = tenantdata[j].full_name
							name = shortenString(tenantName,8);
							table3.row.add(["<a href='tenant_details.html?"+j+"?"+re_num+"' class='pull-left'>"+name+"</a>",refNumFormat,reformatDate(endDate),"<button class='btn btn-xs btn-primary' title='Send Email' ><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-success' title='Extend' onclick=window.location='tenant_details.html?"+j+"?"+ref_num+"#extend'><i class='fa fa-plus'></i></button> <button class='btn btn-xs btn-danger' title='End Contract' onclick=window.location='tenant_details.html?id="+j+"?="+ref_num+"#end'><i class='fa fa-times'></i></button> <button class='btn btn-xs btn-warning' title='Non Active' onclick=window.location='tenant_details.html?"+j+"?="+ref_num+"#non-active'><i class='fa fa-minus'></i></button>"]).node().id = j;			
							
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
				for (i in booking){
					
					var statingDate = tenant[i].start_date
					var keyDate = tenant[i].key_date
					var statOccupy = tenant[i].stat_occupy
					var refN = tenant[i].ref_number
					ref_num = tenant[j].ref_number.split(" ").join("")
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
						table6.row.add(["<a href='tenant_details.html?"+i+"?"+ref_num+"' class='pull-left'>"+name+"</a>",refN,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+i+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectBooking('"+refNumber+"','"+i+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+i;
						
						$(".tip").tip();
					}
				}
				table6.draw();
			}else{
				setTimeout(() => {
					for (i in booking){
						var statingDate = tenant[i].start_date
						var keyDate = tenant[i].key_date
						var statOccupy = tenant[i].stat_occupy
						var refN = tenant[i].ref_number
						ref_num = tenant[i].ref_number.split(" ").join("")
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
							table6.row.add(["<a href='tenant_details.html?"+i+"?"+ref_num+"' class='pull-left'>"+name+"</a>",refN,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+i+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectBooking('"+refNumber+"','"+i+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+i;
							
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
		var re_num = $("#keyTenantRef").val().split(" ").join("")
		var keyTenantRef = $("#keyTenantRef").val().substring(0,7);
		var keyDateRef = firebase.database().ref("tenant-room/"+keyTenantID+"/"+keyTenantRef);
		var name = tenantdata[keyTenantID].full_name
		var statingDate = tenant[keyTenantID].start_date
		name = shortenString(name,8);
		var row = table6.row('#key'+keyTenantID);
		row.remove();
		if (notes!=null){
			table6.row.add(["<a href='tenant_details.html?"+keyTenantID+"?"+re_num+"' class='pull-left'>"+name+"</a>",refNumber,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+keyTenantID+"\",\""+refNumber+"\",\""+notes+"\")'>"+keyDate+" "+noteIcon+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+keyTenantID;
			table6.draw();
		}else {
			table6.row.add(["<a href='tenant_details.html?"+keyTenantID+"?"+re_num+"' class='pull-left'>"+name+"</a>",refNumber,statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+keyTenantID+"\",\""+refNumber+"\",\""+notes+"\")'>"+keyDate+"</a>","<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+i+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+i+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+keyTenantID;
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



	$("#collectApprove").click(function() {
		startPageLoad();
		var refNumber = $("#collectD").val();
		var tenantID = $("#collectD2").val();
		
		var bookingRef = firebase.database().ref().child("booking-tenant");

		bookingRef.child(tenantID).remove(
		).then(function onSuccess(res) {
			var row = table6.row("key"+tenantID);
			row.remove();
			table6.draw(false);
			addNotification("Key Collected","Key successfully collected.");
			stopPageLoad();
			setTimeout(() => {
				window.location='home.html';
			}, 1000);
			}).catch(function onError(err) {
				addNotification("Error Remove Booking",err.code+" : "+err.message);
				});
	});
				
	//remove approve modal add listener
	$("#removeApprove").click(function() {
		startPageLoad();
		var refNumber = $("#approveD3").val()
		var build_id = parseInt($("#approveD3").val().split("booking")[1].substring(1,3)).toString()
		var tenantID = $("#approveD2").val();
		
		var tenantRef = firebase.database().ref("tenant");
		var trRef = firebase.database().ref("tenant-room");
		var contractRef = firebase.database().ref("newContract");
		var dataRoom = firebase.database().ref("dataRoom")
		var fpay = firebase.database().ref("first-payment")

		fpay.child(tenantID).remove(
			).then(function onSuccess(res) {
			dataRoom.child(build_id+"/"+tenantID).remove(
				).then(function onSuccess(res) {
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
			$("#paymentDetailsAdjustBlock").fadeOut(250, function() {
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
			$("#paymentDetailsAdjustBlock").fadeOut(250, function() {
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
			optionElement5.value = "adjustpay";
			optionElement5.innerHTML = "Adjustment";
			document.getElementById("paymentDetails").appendChild(optionElement1);
			document.getElementById("paymentDetails").appendChild(optionElement2);
			document.getElementById("paymentDetails").appendChild(optionElement3);
			document.getElementById("paymentDetails").appendChild(optionElement4);
			document.getElementById("paymentDetails").appendChild(optionElement5);
		}
	})
	//payment amount listener
	$("#paymentAmount").on('keyup change', function() {
		$("#paymentAmount").val(get_moneydot($("#paymentAmount").val()));
	})
	//payment modal details listener
	$("#paymentDetails").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "otherpay") {
			$("#paymentDetailsAdjustBlock").fadeOut(250, function() {
				$(this).hide();
				$("#paymentDetailsOtherBlock").fadeIn(250, function() {
					$(this).show();
				});
			});
		}  else if ($(this).find("option:selected").attr("value") == "adjustpay") {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
				$("#paymentDetailsAdjustBlock").fadeIn(250, function() {
					$(this).show();
				});
			});
		}else {
			$("#paymentDetailsOtherBlock,#paymentDetailsAdjustBlock").fadeOut(250, function() {
				$(this).hide();
			});
		}
	})

	//modal draggable
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