var newPayment = firebase.database().ref("newPayment")
var payment = firebase.database().ref("payment");
var firstPayment = firebase.database().ref("first-payment");
var reportAccount = firebase.database().ref("reportAccount");
var reportAccount2 = firebase.database().ref("reportAccount2")
var reportBackup = firebase.database().ref("reportBackup");
var contract = firebase.database().ref("contract");
var newContract = firebase.database().ref("newContract");
var dataRoom = firebase.database().ref("dataRoom")
var tenantRoom = firebase.database().ref("tenant-room");
var tenant = firebase.database().ref("tenant")
var recurring = firebase.database().ref("recurring")
var bookingTenant = firebase.database().ref("booking-tenant")
var virtualAccount = firebase.database().ref("virtualAccountReport")
var tenantEnd = firebase.database().ref("tenantendContract")
var HistoryRoom = firebase.database().ref("HistoryRoom")
var recurringPay = firebase.database().ref("recurringPay")
var overdue = firebase.database().ref("overdue")
var overdueBackup = firebase.database().ref("overdueBackup")
var endingContract = firebase.database().ref("endingContract")
var property = firebase.database().ref("property/residential")
var contractLedger = firebase.database().ref("contractLedger")

function reformatDate2(inputDate) {
	months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des", "Dec", "May"];
	months2 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "12", "05"];
	inputBroke = inputDate.split("-");
	inputDay = inputBroke[0];
	inputMonth = inputBroke[1];
	inputYear = inputBroke[2];
	if (parseInt(inputDay) < 10) {
		outputDay = inputDay;
	} else {
		outputDay = inputDay;
	}
	for (var i = 0; i < months.length; i++) {
		if (inputMonth == months[i]) {
			outputMonth = months2[i];
			break
		}
	}
	outputYear = "20" + inputYear;
	return (outputMonth + "/" + outputDay + "/" + outputYear);
}

function reformatDate(inputDate) {

	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	inputBroke = inputDate.split("/");
	inputDay = parseInt(inputBroke[1]);
	inputMonth = parseInt(inputBroke[0]);
	inputYear = inputBroke[2];
	outputDay = inputDay;
	outputMonth = months[inputMonth - 1];
	outputYear = "20" + inputYear.split("")[2] + inputYear.split("")[3];
	return (outputDay + "-" + outputMonth + "-" + outputYear);

}

//========================================Buat Child First Payment=====================================
// firstPayment.remove()
// tenantRoom.on('child_added', function(snapshot){
//     var t_id = snapshot.key
//     tenantRoom.child(t_id).on('child_added', function(snapshot){
//         var rentPrice=snapshot.child("rent_price").val();
//         payment.child(t_id).on('value', function(snapshot){
//             if(snapshot.val()!=null){
//                 firstPayment.child(t_id).set({
//                     "payment":1,
//                     "bond-balance": 0
//                 })
//             }else{
//                 firstPayment.child(t_id).set({
//                     "payment":0,
//                     "bond-balance": rentPrice
//                 })
//             }
//         })
//     })
// })
//=====================================================================================================

//====================================Buat Child New Contract=========================================
// contractRef.on('child_added', function(snapshot){
//     var t_id = snapshot.key
//     var numbContr = 1;

//     contractRef.child(t_id).on('child_added', function(snapshot){
//         var historyperiod = snapshot.child("historyperiod").val();
//         var status = snapshot.child("status").val();
//         var ref_id = snapshot.key

//         contractRef.child(t_id+"/"+ref_id).on('child_added', function(snapshot){
//             var ctrt_length = snapshot.child("ctrt_length").val();
//             var refNumb = snapshot.child("refNumb").val();
//             var ctrt_type = snapshot.child("ctrt_type").val();
//             var bond = snapshot.child("bond").val();
//             var end_date = snapshot.child("end_date").val();
//             var start_date = snapshot.child("start_date").val();
//             var payPlan = snapshot.child("payPlan").val();
//             var rent = snapshot.child("rent").val();
//             newContract.child(t_id+"/"+ref_id+"/"+numbContr).set({
//                 "ctrt_length": ctrt_length,
//                 "refNumb":refNumb,
//                 "ctrt_type":ctrt_type,
//                 "bond": bond,
//                 "end_date":end_date,
//                 "start_date":start_date,
//                 "payPlan":payPlan,
//                 "rent":rent
//             })
//             numbContr++   
//         })
//         newContract.child(t_id+"/"+ref_id).update({
//             "status": "active",
//             "historyperiod":historyperiod
//         })

//     })
// })
//======================================================================================================

//==========================================Buat Child Recurring=========================================
// var last_date =""
// var pay_date = ""
// list={}
// contract={}


// contractRef.on('child_added', function(snapshot){
//     var t_id = snapshot.key
//     contractRef.child(t_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         contractRef.child(t_id+"/"+room_id).on('value', function(snapshot){
//             var historyperiod = snapshot.child("historyperiod").val()
//             contractRef.child(t_id+"/"+room_id+"/"+historyperiod).on('value', function(snapshot){
//                 var payPlan = snapshot.child("payPlan").val()
//                 var rent = snapshot.child("rent").val()
//                 contract[t_id]={
//                     "payPlan": payPlan,
//                     "rent": rent
//                 }
//             })
//         })

//     })
// })


// newPaymentRef.on('child_added', function(snapshot){
//     var t_id = snapshot.key
//     var i =0
//     payRef.child(t_id).on('value', function(snapshot){
//         var balance = snapshot.child("balance").val()

//         newPaymentRef.child(t_id).on('value', function(snapshot){
//             var total = snapshot.child("total_tenant").val();
//             newPaymentRef.child(t_id).on('child_added', function(snapshot){
//                 if(snapshot.key!="total_tenant"){
//                     var desc = snapshot.child("desc").val();
//                     var date =new Date(snapshot.child("date").val());
//                     ++i
//                     if (desc == "Rental Due" ){
//                         last_date = date
//                     }else if(desc == "Rental Payment" ){
//                         pay_date = date
//                     }
//                     if (i==total){
//                         // list[id]=last_date.toString("MM/dd/yyyy")

//                         if (pay_date>last_date || balance==0){
//                             // console.log("else",last_date.toString("MM/dd/yyyy"))
//                             list[t_id]={
//                                 "date":last_date.toString("MM/dd/yyyy"),
//                                 "pay":"pay"
//                             }                            
//                          }else{                           
//                             list[t_id]={
//                                 "date":last_date.toString("MM/dd/yyyy"),
//                                 "pay":"not pay"
//                             }

//                         }                
//                     }               
//                 }           
//         })
//     })
//     })
// })
// setTimeout(() => {
//     console.log(list)
//     console.log(contract)
//     for (i in list){

//                     recurringRef.child(i).update({
//                         "prevRecurringDate": list[i].date.toString("MM/dd/yyyy"),
//                         "payPlan": contract[i].payPlan,
//                         "rent":contract[i].rent,
//                         "payment": list[i].pay
//                     })
//                 }

// }, 10000);
//======================================================================================================

//======================================Buat Child Data Room============================================
// dataRoom.remove()
// trRef.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     trRef.child(tenant_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         trRef.child(tenant_id+"/"+room_id).on('value', function(snapshot){
//             var build_id = snapshot.child("build_no").val();
//             console.log(build_id)
//             dataRoom.child(build_id+"/"+tenant_id).set("there")
//         })
//     })
// })
//==============================================================================================

//=========================Buat Child Booking Tenant===========================================
// booking.remove()
// trRef.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     trRef.child(tenant_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         trRef.child(tenant_id+"/"+room_id).on('child_added', function(snapshot){
//             booking.child(tenant_id).set({"status": "booked"})
//         })
//     })
// })
//==============================================================================================

//===================================Buat Child Virtual Account=====================================

// paymentRef.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     paymentRef.child(tenant_id).on('child_added', function(snapshot){
//         var key_id = snapshot.key
//         if (key_id!= "balance" && key_id!="bondWaitDue" && key_id != "receive" && key_id!= "due"){
//             paymentRef.child(tenant_id+"/"+key_id).on('value', function(snapshot){
//                 // var due = snapshot.child("invoice").val()
//                 // var date = snapshot.child("date").val()
//                 // var desc = snapshot.child('desc').val()
//                 // if (desc=="Rental Due"){
//                 //     console.log(date)
//                 //     month=date.split("/")[0]
//                 //     year=date.split("/")[2]
//                 //     virtual.child(tenant_id+"/"+month+":"+year).set({
//                 //         "due": due,
//                 //         "date":date
//                 //     })
//                 // }
//                 // var adjst_date = snapshot.child("adjst_date").val()
//                 // if(adjst_date!=null){
//                 //     var adjst_date = snapshot.child("adjst_date").val()
//                 //     var adjst_detail = snapshot.child("adjst_detail").val()
//                 //     month = adjst_date.split("/")[0]
//                 //     year = adjst_date.split("/")[2]
//                 //     if (adjst_detail=="Rental Due" || adjst_detail=="Rental due" ||adjst_detail=="rental Due" || adjst_detail=="rental due"){
//                 //         virtual.child(tenant_id+"/"+month+":"+year).remove()
//                 //     }

//                 // }
//             })
//         }
//     })
// })
//==========================================================================================

//=========================Buat Child Report Account2 dari Payment================================
// reportAccount2.remove()
// dataRoom.on('child_added', function(snapshot){
//     var build_id=snapshot.key
//     dataRoom.child(build_id).on('child_added', function(snapshot){
//         var tenant_id = snapshot.key
//         newPayment.child(tenant_id).on('child_added', function(snapshot){
//             var key = snapshot.key
//             newPayment.child(tenant_id+"/"+key).on('value', function(snapshot){
//                 var date = snapshot.child("date").val();
//                 var rec = snapshot.child("payment").val();
//                 var inv = snapshot.child("invoice").val();
//                 var ref = snapshot.child("refnumber").val();
//                 if (rec==null){
//                     reportAccount2.child(build_id+"/"+tenant_id).push({
//                         "date":date,
//                         "due": inv,
//                         "inputDate":"01/15/2020",
//                         "receive":0,
//                         "refNumb":ref
//                     })
//                 }
//                 else if(inv==null){
//                     reportAccount2.child(build_id+"/"+tenant_id).push({
//                         "date":date,
//                         "due": 0,
//                         "inputDate":"01/15/2020",
//                         "receive":rec,
//                         "refNumb":ref
//                     })
//                 }
//                 else{
//                     reportAccount2.child(build_id+"/"+tenant_id).push({
//                         "date":date,
//                         "due": inv,
//                         "inputDate":"01/15/2020",
//                         "receive":rec,
//                         "refNumb":ref
//                     })
//                 }
//             })   
//         })
//     })
// })
//=====================================================================================

//=======================Buat Child Recurring dr Recurring sebelumnya==================

// recurringRef.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     recurringRef.child(tenant_id).on('value', function(snapshot){
//         var payPlan = snapshot.child('payPlan').val()
//         var payment = snapshot.child('payment').val()
//         var prevRecurringDate = snapshot.child('prevRecurringDate').val()
//         var rent = snapshot.child('rent').val()

//         newRecurring.child(tenant_id+"/rental").set({
//             "payPlan": payPlan,
//             "payment": payment,
//             "prevRecurringDate": prevRecurringDate,
//             "rent": rent
//         })
//         newRecurring.child(tenant_id).update({
//             "total_recurring":0
//         })
//     })
// })
//===========================================================================================

//======================Buat Child History Room dari Tenant End Contract========================

// newHistory.remove()
// historyTenant.on('child_added', function(snapshot2){
//     var tenant_id= snapshot2.key
//     historyTenant.child(tenant_id+"/tenant-room").on('value', function(snapshot){
//         var build_id = parseInt(snapshot.child("build_no").val()).toString()
//         var room_id = snapshot.child("ref_number").val().split(" ").join("").substring(0,7)
//         newHistory.child(build_id+"/"+room_id+"/"+tenant_id).set(snapshot2.val())
//     })
// })
//==============================================================================================

//=======================================Buat Backup Report=====================================
// reportback = firebase.database().ref("reportBackup").remove()

// i=0;
// reportRef.on('child_added', function(snapshot){
//     var build_id = snapshot.key
//     reportRef.child(build_id).on('child_added', function(snapshot){
//         reportback.child(build_id+"/"+i).set({
//             "date":snapshot.child("date").val(),
//             "due": snapshot.child("due").val(),
//             "inputDate":snapshot.child("inputDate").val(),
//             "receive":snapshot.child("receive").val(),
//             "refNumb":snapshot.child("refNumb").val(),
//             "tenant_id":snapshot.child("tenant_id").val()
//         })
//         ++i
//     })
// })
//=============================================================================================

//======================================Backup Payment=========================================
// newPayment.remove()
// payment.on('child_added', function(snapshot){
//     var tenant_id=snapshot.key
//     payment.child(tenant_id).on('child_added', function(snapshot){
//         if (snapshot.key!= "balance" && snapshot.key!= "bondWaitDue" && snapshot.key!= "due" && snapshot.key!= "receive"){
//             newPayment.child(tenant_id+"/"+snapshot.key).set(snapshot.val())
//             console.log(snapshot.key)
//         }
//         console.log(snapshot.key)

//     })
// })
//===============================================================================================      

//===========================Print Tenant yang baru diinput====================================
// reportAcc.on('child_added', function(snapshot){
//     var build_id = snapshot.key
//     reportAcc.child(build_id.toString()).on('child_added', function(snapshot){
//         var tenant_id = snapshot.key
//         reportAcc.child(build_id.toString()+"/"+tenant_id).on('child_added', function(snapshot){
//             var inputDate = snapshot.child("inputDate").val()

//             if(inputDate =="01/11/2020" ){
//                 console.log(tenant_id,inputDate)
//             }else{
//                 console.log("nothing")
//             }
//         })
//     })
//})
//=============================================================================================


//==================Push Bond Money + Rent Money ke Report dari tenant ID======================
// for (let index = 737; index <= 756; index++) {

//     trRef.child("t_"+index).once('child_added', function(snapshot) {
//         var bond = snapshot.child("rent_bond").val();
//         var rent = snapshot.child("rent_price").val();
//         var startdate = snapshot.child("start_date").val();
//         var build_no=snapshot.child("build_no").val();
//         console.log(snapshot.child("build_no").val())
//         report.child(build_no).push({
//             "date":startdate,
//             "inputDate":"12/08/2019",
//             "due":bond+rent,
//             "receive":0
//         })
//     })
// }
//=============================================================================================

//======================Push Rent + Bond ke Report dari Building No============================
// for(let build_id = 12; build_id <= 41; ++build_id){
//     dataRoom.child(build_id.toString()).on('child_added', function(snapshot){
//         var tenant_id=snapshot.key
//         trRef.child(tenant_id).on('child_added', function(snapshot){
//             var start_date = snapshot.child("start_date").val()
//             var refN = snapshot.child("ref_number").val()
//             var rent = parseInt(snapshot.child("rent_price").val())
//             var bond = parseInt(snapshot.child("rent_bond").val())
//             reportAcc.child(build_id+"/"+tenant_id).push({
//                 "date": start_date,
//                 "due":rent+bond,
//                 "inputDate": "01/03/2020",
//                 "receive":0,
//                 "refNumb": refN
//             })
//         })
//     })
// }
//=============================================================================================

//=========================Push Payment dari Recurring terakhir=============================

// recurringPay.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).once('child_added', function(snapshot){
//        if (snapshot.key!= "balance" && snapshot.key!="bondWaitDue" && snapshot.key!="receive" && snapshot.key!= "due" ){
//             var refNumb = snapshot.child("refnumber").val()
//             var build_no = refNumb.substring(1,3)
//             recurringPay.child(tenant_id+"/rental").on('value', function(snapshot){
//                 var payPlan=snapshot.child("payPlan").val()
//                 var rent = snapshot.child("rent").val()
//                 var last_date = new Date(snapshot.child("prevRecurringDate").val())
//                 var prevRecurringDate = new Date(snapshot.child("prevRecurringDate").val()).toString("MM")
//                 if (prevRecurringDate=="03"){
//                     if(payPlan=="monthly"){
//                         console.log(tenant_id)
//                         payment.child(tenant_id).push({
//                             "date": last_date.addMonths(1).toString("MM/dd/yyyy"),
//                             "desc": "Rental Due",
//                             "list": "ledgerList",
// 							"invoice": rent ,
// 							"refnumber": refNumb
//                         })
//                         recurringPay.child(tenant_id+"/rental").update({
//                             "payment": "not pay",
//                             "prevRecurringDate":last_date.toString("MM/dd/yyyy")
//                         })
//                         reportAccount2.child(build_no+"/"+tenant_id).push({
//                             "date":last_date.toString("MM/dd/yyyy"),
//                             "due": rent,
//                             "inputDate":"01/27/2019",
//                             "receive":0,
//                             "refNumb":refNumb
//                         })
                        

//                     }
//                 }
//             })
//        }
//     })
//  })

// payment.on("child_added", function(snapshot){
// 	var tenant_id = snapshot.key
// 	payment.child(tenant_id).on("value", function(snapshot){
// 		var balance = parseInt(snapshot.child("balance").val())
// 			if (balance>0){
// 				console.log(tenant_id, balance)
// 			}
// 	})
// })
//==============================================================================================

//=========================Push Fine dari Recurring terakhir=============================

// recurringPay.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).once('child_added', function(snapshot){
//        if (snapshot.key!= "balance" && snapshot.key!="bondWaitDue" && snapshot.key!="receive" && snapshot.key!= "due" ){
//             var refNumb = snapshot.child("refnumber").val()
//             var build_no = refNumb.substring(1,3)
//             recurringPay.child(tenant_id+"/rental").on('value', function(snapshot){
//                 var payPlan=snapshot.child("payPlan").val()
//                 var rent = snapshot.child("rent").val()*0.5
//                 var paymentChild = snapshot.child("payment").val()
//                 var prevRecurringDate = new Date(snapshot.child("prevRecurringDate").val()).toString("MM")
//                 var fineDate =  new Date(snapshot.child("prevRecurringDate").val()).addDays(20).toString("MM/dd/yyyy")

//                 if (prevRecurringDate=="03"){
//                     if(payPlan=="monthly"){
//                         if (paymentChild == "not pay"){
//                             console.log(refNumb,rent,fineDate)
//                             payment.child(tenant_id).push({
//                                 "date": fineDate,
//                                 "desc": "Fine Due - 50% on "+fineDate,
//                                 "list": "ledgerList",
//                                 "invoice": rent
//                             })

//                             reportAccount2.child(build_no+"/"+tenant_id).push({
//                                 "date":fineDate,
//                                 "due": rent,
//                                 "inputDate":"03/20/2020",
//                                 "due":0,
//                                 "refNumb":refNumb
//                             })
//                             virtualAccount.child(tenant_id+"/balance").on('value', function(snapshot){
//                                 var prevBalance = parseInt(snapshot.val())
//                                 virtualAccount.child(tenant_id+"/balance").update(prevBalance-rent)
//                             })
//                             overdue.child(tenant_id+"/balance").on("value", function(snapshot){
//                                 var balprev = parseInt(snapshot.val())
//                                 overdue.child(tenant_id).update({
//                                     "balance": balprev-rent
//                                 })
//                             })
//                         }
//                     }
//                 }
//             })
//        }
//     })
//  })
//==============================================================================================

//==========================Push ke Report Data Tenant yg udah keluar===========================
// dataRoom.on('child_added', function(snapshot){
//     var buildid = snapshot.key
//     var build_id = parseInt(buildid).toString()

//     HistoryRoom.child(build_id).on('child_added', function(snapshot){
//             var room_id = snapshot.key
//             HistoryRoom.child(build_id+"/"+room_id).on('child_added', function(snapshot){
//                 var tenant_id = snapshot.key
//                 HistoryRoom.child(build_id+"/"+room_id+"/"+tenant_id+"/payment").on('child_added', function(snapshot){
//                     var key_id = snapshot.key
//                     if (key_id!= "balance" && key_id!= "bondWaitDue"){
//                         HistoryRoom.child(build_id+"/"+room_id+"/"+tenant_id+"/payment/"+key_id).on('value', function(snapshot){
//                             var date = snapshot.child("date").val();
//                             var rec = snapshot.child("payment").val();
//                             var inv = snapshot.child("invoice").val();
//                             var ref = snapshot.child("refnumber").val();
//                             console.log(ref)
//                             if (rec==null){
//                                 reportAccount2.child(buildid+"/"+tenant_id).push({
//                                     "date":date,
//                                     "due": inv,
//                                     "inputDate":"12/01/2019",
//                                     "receive":0,
//                                     "refNumb":ref
//                                 })
//                             }
//                             else if(inv==null){
//                                 reportAccount2.child(buildid+"/"+tenant_id).push({
//                                     "date":date,
//                                     "due": 0,
//                                     "inputDate":"12/01/2019",
//                                     "receive":rec,
//                                     "refNumb":ref
//                                 })
//                             }
//                             else{
//                                 reportAccount2.child(buildid+"/"+tenant_id).push({
//                                     "date":date,
//                                     "due": inv,
//                                     "inputDate":"12/01/2019",
//                                     "receive":rec,
//                                     "refNumb":ref
//                                 })
//                             }
//                         })
//                     }
//                 })
//             })
//         })
// })
//==========================================================================================

//===========================Push Rent pertama ke Report====================================
// dataRoom.on('child_added', function(snapshot){
//     var build_id = snapshot.key
//     dataRoom.child(build_id).on('child_added', function(snapshot){
//         var tenant_id = snapshot.key
//         tenantRoom.child(tenant_id).on('child_added', function(snapshot){
//             var room_id = snapshot.key
//             tenantRoom.child(tenant_id+"/"+room_id).on('value', function(snapshot){
//                 var rent = snapshot.child('rent_price').val()
//                 var bond = snapshot.child('rent_bond').val()
//                 var date = snapshot.child('start_date').val()
//                 var ref = snapshot.child('ref_number').val()
//                 reportAccount2.child(build_id+"/"+tenant_id).push({
//                         "date":date,
//                         "due": rent,
//                         "inputDate":"01/15/2020",
//                         "receive":0,
//                         "refNumb":ref
//                 })
//             })
//         })
//     })
// })
//=========================================================================================

//===================Push Rent pertama tenant yg udah keluar ke Report=====================

// dataRoom.on('child_added', function(snapshot){
//     var buildid = snapshot.key
//     var build_id = parseInt(buildid).toString()
//     HistoryRoom.child(build_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         HistoryRoom.child(build_id+"/"+room_id).on('child_added', function(snapshot){
//             var tenant_id = snapshot.key
//             HistoryRoom.child(build_id+"/"+room_id+"/"+tenant_id+"/tenant-room").on('value', function(snapshot){
//                 var rent = snapshot.child('rent_price').val()
//                 var bond = snapshot.child('rent_bond').val()
//                 var date = snapshot.child('start_date').val()
//                 var ref = snapshot.child('ref_number').val()
//                 reportAccount2.child(buildid+"/"+tenant_id).push({
//                         "date":date,
//                         "due": rent+bond,
//                         "inputDate":"01/15/2020",
//                         "receive":0,
//                         "refNumb":ref
//                 })
//             })
//         })
//     })
// })
//========================================================================================

//========================Push Tagihan Awal Tenant ke Virtual Account=======================

// trRef.on('child_added', function(snapshot){
//     var tenant_id=snapshot.key
//     trRef.child(tenant_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         trRef.child(tenant_id+"/"+room_id).on('value', function(snapshot){
//             var rent = snapshot.child('rent_price').val()
//             var bond = snapshot.child('rent_bond').val()
//             var date = snapshot.child('start_date').val()
//             month = date.split("/")[0]
//             year = date.split("/")[2]
//             virtual.child(tenant_id+"/"+month+":"+year).update({
//                 "due": rent+bond,
//                 "date": date
//             })
//         })

//     })
// })
//===========================================================================================

//========================Hapus Child Report di tgl input tertentu==============================
// for (let index = "12"; index <= "41"; index++) {
//     reportAcc.child(index).on("child_added", function(snapshot){
//         var tenant_id = snapshot.key
//         reportAcc.child(index+"/"+tenant_id).on("child_added", function(snapshot){
//             var key = snapshot.key
//             var inputDate = snapshot.child("inputDate").val();
//             if(inputDate!="12/01/2019"){
//                 reportAcc.child(index+"/"+tenant_id+"/"+key).remove();
//             }
//         })
//     })
// }
//================================================================================================

//=================================Backup Overdue Child===========================================
// overdueBackup.remove()
// overdue.on('child_added', function(snapshot){
//     var tenant_id=snapshot.key
//     overdue.child(tenant_id).on('child_added', function(snapshot){
//         overdueBackup.child(tenant_id+"/"+snapshot.key).set(snapshot.val())
//     })
// })
//================================================================================================

//===============================Push Overdue baru==========================================
// payment.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).on('value', function(snapshot){
//         var balance = parseInt(snapshot.child("balance").val())
//         payment.child(tenant_id).on('child_added', function(snapshot){
//             if (snapshot.key!= "balance" && snapshot.key!= "bondWaitDue" && snapshot.key!= "due" && snapshot.key!= "receive"){
//                 var desc = snapshot.child("desc").val()
//                 var date = snapshot.child("date").val()
//                 if (desc=="Rental Due"){
//                     console.log(tenant_id)
//                     overdue.child(tenant_id).update({
//                         "balance": balance,
//                         "date_due": date
//                     })
//                 }
//             }                                                   
//         })
//     })
// })
//=============================================================================================

//================================Update Child Overdue=========================================
// virtualAccount.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     virtualAccount.child(tenant_id+"/balance").on('value', function(snapshot){
//         overdue.child(tenant_id).update({
//             "balance": parseInt(snapshot.val())
//         })
//     })
// })
//=============================================================================================

//============================Buat Child Ref number di ending contract==========================
// endingContract.on('child_added', function(snapshot){
//     var tenant_id = snapshot.key
//     endingContract.child(tenant_id).on('child_added', function(snapshot){
//         var room_id = snapshot.key
//         tenantRoom.child(tenant_id+"/"+room_id).on('value', function(snapshot){
//             var refNumb = snapshot.child("ref_number").val()  
//             endingContract.child(tenant_id+"/"+room_id).update({
//                 "refNumber":refNumb
//             })

//         })
//     })
// })
//=============================================================================================

//=================================Avail Date property=========================================
// newContract.on("child_added", function (snapshot) {
//     var tenant_id = snapshot.key
//     newContract.child(tenant_id).on("child_added", function (snapshot) {
//         var room_id = snapshot.key
//         var build_id = snapshot.key.substring(1, 3)
//         var floor_no = snapshot.key.substring(3, 5)
//         newContract.child(tenant_id + "/" + room_id).on("value", function (snapshot) {
//             var historyperiod = snapshot.child("historyperiod").val().toString()
//             var status = snapshot.child("status").val()
//             newContract.child(tenant_id + "/" + room_id + "/" + historyperiod).on("value", function (snapshot) {

//                 var endDate = snapshot.child("end_date").val()
//                 if (endDate == "Ongoing") {
//                     property.child("building_no:" + build_id + "/floor:" + floor_no + "/ID:" + room_id).update({availdate:"01/01/2050"})
//                     console.log("Ongoing" + tenant_id)
//                 } else {
//                     property.child("building_no:" + build_id + "/floor:" + floor_no + "/ID:" + room_id).update({availdate:endDate})
//                     console.log("NotOngoing" + tenant_id)
//                 }



//             })

//         })
//     })
// })
//=============================================================================================

//=================================Prorata Price push=========================================
// tenantRoom.on("child_added", function(snapshot){
//     var tenant_id = snapshot.key
//     tenantRoom.child(tenant_id).once("child_added", function(snapshot){
//         var room_id = snapshot.key
//         tenantRoom.child(tenant_id+"/"+room_id).once("value", function(snapshot){
//             tenantRoom.child(tenant_id+"/"+room_id).update({
//                 prorata_price: snapshot.child("rent_price").val()
//             }).then(function onSuccess(res) {
//                 console.log(tenant_id,snapshot.child("rent_price").val())
//             }).catch(function onError(err) {
//                 console.log(tenant_id,err)
//             })

//         })
//     })
// })
//=============================================================================================

//=================================Change rent_price=========================================
// newContract.on("child_added", function(snapshot){
//     var tenant_id = snapshot.key
//     newContract.child(tenant_id).on("child_added", function(snapshot){
//         var room_id = snapshot.key
//         newContract.child(tenant_id+"/"+room_id).on("value", function(snapshot){
//             var historyperiod = snapshot.child("historyperiod").val().toString()
//             newContract.child(tenant_id+"/"+room_id+"/"+historyperiod).on("value", function(snapshot){
//                 var rent = parseInt(snapshot.child("rent").val())
//                 tenantRoom.child(tenant_id+"/"+room_id).update({
//                     "rent_price":rent
//                 })
//             })
//         })
//     })
// })
//=============================================================================================

//=================================Push Contract Ledger(Rental Due)===========================
// contractLedger.remove()
// payment.on("child_added", function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).on("child_added", function(snapshot){
//         if(snapshot.key!="balance" && snapshot.key!="bondWaitDue" && snapshot.key!="receive" && snapshot.key!="due"){
//             var key_id = snapshot.key
//             payment.child(tenant_id+"/"+key_id).on("value", function(snapshot){
//                 var desc = snapshot.child("desc").val()
//                 var dueDate = snapshot.child("date").val()
//                 var date = new Date(snapshot.child("date").val())
//                 var refN = snapshot.child("refnumber").val()
//                 var due = snapshot.child("invoice").val()
//                 if(desc == "Rental Due"){
//                     newContract.child(tenant_id).on("child_added", function(snapshot){
//                         var room_id = snapshot.key
//                         newContract.child(tenant_id+"/"+room_id+"/1").on("value", function(snapshot){
// 							var end_date2 = snapshot.child("end_date").val().split("/")[0]
// 							var year = snapshot.child("end_date").val().split("/")[2]
// 							var end_date = new Date(end_date2+"/01"+"/"+year)
//                             var payPlan = snapshot.child("payPlan").val()
//                             if(date<end_date && payPlan == "monthly"){
//                                 contractLedger.child(tenant_id).push({
//                                     "desc":desc,
//                                     "date":dueDate,
//                                     "ref_number":refN,
//                                     "due": due
// 								})

//                             }

//                         })
//                     })
//                 }
//             })
//         }
//     })
// })

//=============================================================================================

//=================================Push Contract Ledger(Adjustment Due)===========================

// payment.on("child_added", function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).on("child_added", function(snapshot){
//         if(snapshot.key!="balance" && snapshot.key!="bondWaitDue" && snapshot.key!="receive" && snapshot.key!="due"){
//             var key_id = snapshot.key
//             payment.child(tenant_id+"/"+key_id).on("value", function(snapshot){
//                 var desc = snapshot.child("desc").val()
//                 var refN = snapshot.child("refnumber").val()
//                 var due = snapshot.child("payment").val()
//                 if(desc.split(" ")[0] == "Adjustment"){
//                     var adjst_detail = snapshot.child("adjst_detail").val()
//                     var adjst_dateCek = new Date(snapshot.child("adjst_date").val())
//                     var adjst_date =snapshot.child("adjst_date").val()
//                     if(adjst_detail=="Rental Due"){
//                         newContract.child(tenant_id).on("child_added", function(snapshot){
//                             var room_id = snapshot.key
//                             newContract.child(tenant_id+"/"+room_id+"/1").on("value", function(snapshot){
//                                 var end_date = new Date(snapshot.child("end_date").val())
//                                 var payPlan = snapshot.child("payPlan").val()
//                                 if(adjst_dateCek<=end_date && payPlan == "monthly"){
//                                     console.log(tenant_id)
//                                     contractLedger.child(tenant_id).push({
//                                         "desc":desc,
//                                         "date":adjst_date,
//                                         "ref_number":refN,
//                                         "payment": due
//                                     })
//                                 }

//                             })
//                         })
//                     }


//                 }
//             })
//         }
//     })
// })
//=============================================================================================

//=================================Push Contract Ledger(Rental Due 2)===========================
// payment.on("child_added", function(snapshot){
//     var tenant_id = snapshot.key
//     payment.child(tenant_id).on("child_added", function(snapshot){
//         if(snapshot.key!="balance" && snapshot.key!="bondWaitDue" && snapshot.key!="receive" && snapshot.key!="due"){
//             var key_id = snapshot.key
//             payment.child(tenant_id+"/"+key_id).on("value", function(snapshot){
//                 var desc = snapshot.child("desc").val()
//                 var dueDate = snapshot.child("date").val()
//                 var date = new Date(snapshot.child("date").val())
//                 var refN = snapshot.child("refnumber").val()
//                 var due = snapshot.child("invoice").val()
//                 if(desc == "Rental Due"){
//                     newContract.child(tenant_id).on("child_added", function(snapshot){
//                         var room_id = snapshot.key
//                         newContract.child(tenant_id+"/"+room_id+"/2").on("value", function(snapshot){
//                             var end_date =snapshot.child("end_date").val()
//                             var start_date =snapshot.child("start_date").val()
//                             var payPlan = snapshot.child("payPlan").val()

//                             if(end_date!="Ongoing" && payPlan == "monthly" && end_date != start_date){
// 								console.log(tenant_id, dueDate)
//                                 var end_date2 = snapshot.child("end_date").val().split("/")[0]
// 								var year = snapshot.child("end_date").val().split("/")[2]
// 								var endDate = new Date(end_date2+"/01/"+year)
//                                 var startDate = new Date(start_date)
//                                 if(date>=startDate && date<endDate){
//                                     console.log(tenant_id, dueDate)
//                                     contractLedger.child(tenant_id).push({
//                                     "desc":desc,
//                                     "date":dueDate,
//                                     "ref_number":refN,
//                                     "due": due
//                                 })
//                                 }

//                             }

//                         })
//                     })
//                 }
//             })
//         }
//     })
// })
//=============================================================================================

//==============================Remove overdue child===========================
// var overdue2 = firebase.database().ref("overdue2")
// tenant.on("child_added", function(snapshot){
// 	var t_id = snapshot.key
// 	console.log(t_id)
// 	overdue.child(t_id).on("value", function(snapshot){
// 		overdue2.child(t_id).set(snapshot.val())
// 	})
// })

// // overdue.remove()
// // overdue2.on("child_added", function(snapshot){
// // 	var t_id = snapshot.key
// // 	overdue2.child(t_id).on("value", function(snapshot){
// // 		overdue.child(t_id).set(snapshot.val())
// // 	})
// // })
//=============================================================================================

//==============================Update overdue balance===========================
// payment.on("child_added", function(snapshot){
// 	var t_id = snapshot.key
// 	payment.child(t_id).on("value", function(snapshot){
// 		var balance = parseInt(snapshot.child("balance").val())
// 		overdue.child(t_id).update({
// 			balance : balance
// 		})
// 	})
// })
//=============================================================================================

//==============================Check 0 overdue===========================
// overdue.on("child_added", function(snapshot){
// 	var t_id = snapshot.key

// 	overdue.child(t_id).on("value", function(snapshot){
// 		var balance = snapshot.child("balance").val()
// 		if (balance == 0){
// 			overdue.child(t_id).update({
// 				date_due : "03/01/2020"
// 			})
// 		}
// 	})
// })\

// payment.on("child_added", function(snapshot){
// 	var tenant_id = snapshot.key
// 	payment.child(tenant_id).on("child_added", function(snapshot){
// 		var key_id = snapshot.key
// 		payment.child(tenant_id+"/"+key_id).on("value", function(snapshot){
// 			var desc = snapshot.child("desc").val();
// 			var fine = desc.split(" ")[0]
// 			if (fine == "Fine"){
// 				var on = desc.split(" ")[5].split("/")[0]
// 				if(on == "04"){
// 					payment.child(tenant_id+"/"+key_id).remove()
// 					console.log(tenant_id+"/"+key_id)
// 				}
// 			}
// 		})
// 	})
// })

// reportAccount2.on("child_added",function(snapshot){
// 	var build_id = snapshot.key
// 	reportAccount2.child(build_id).on("child_added", function(snapshot){
// 		var tenant_id = snapshot.key
// 		reportAccount2.child(build_id+"/"+tenant_id).on("child_added", function(snapshot){
// 			var key_id = snapshot.key
// 			reportAccount2.child(build_id+"/"+tenant_id+"/"+key_id).on("value", function(snapshot){
// 				var inputDate = new Date(snapshot.child("date").val())
// 				var ref_numb = snapshot.child("refNumb").val()
// 				var datein =  new Date("03/20/2020")
// 				if (inputDate > datein){
// 					console.log(ref_numb,snapshot.child("date").val())
// 				}

// 			})
// 		})
// 	})
// })

// payment.on("child_added", function (snapshot) {
// 	var tenant_id = snapshot.key
// 	payment.child(tenant_id).on("child_added", function (snapshot) {
// 		var key_id = snapshot.key
// 		payment.child(tenant_id + "/" + key_id).on("value", function (snapshot) {
// 			var inputDate = new Date(snapshot.child("date").val())
// 			var date = snapshot.child("date").val()
// 			var desc = snapshot.child("desc").val()
// 			var receive = snapshot.child("payment").val()
// 			var ref_numb = snapshot.child("refnumber").val()
// 			var datein = new Date("04/01/2020")
// 			var dateout = new Date("04/16/2020")
// 			if (inputDate >= datein && inputDate <= dateout) {
// 				console.log(tenant_id, date, desc, receive)
// 			}

// 		})
// 	})
// })

