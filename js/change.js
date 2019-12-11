// var fpay = firebase.database().ref("first-payment");
// var payment = firebase.database().ref("payment");

// payment.on('child_added', function(snapshot){
//     var tenant_id=snapshot.key
//     fpay.child(tenant_id).set({
//         "payment":1,
//         "bond-balance": 0
//     })
// })
// reportback = firebase.database().ref("reportBackup").remove()
// var reportRef = firebase.database().ref("reportAccount");
// var reportback = firebase.database().ref("reportBackup");
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


// for (let index = 727; index <= 736; index++) {
    
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

// var reportback = firebase.database().ref("reportAccount");
// var reportRef = firebase.database().ref("reportAccount2");

// reportback.on('child_added', function(snapshot){
//     var build_id = snapshot.key
//     reportback.child("01").on('child_added', function(snapshot){
//         var key = snapshot.key
//         reportback.child("01"+"/"+key).on('value', function(snapshot){
//             var tenant_id = snapshot.child("tenant_id").val();
//             var inputDate = snapshot.child("inputDate").val();
//             if(inputDate=="12/11/2019"){
//                 reportRef.child("01/"+tenant_id).push({
//                     "date":snapshot.child("date").val(),
//                     "due": snapshot.child("due").val(),
//                     "inputDate":snapshot.child("inputDate").val(),
//                     "receive":snapshot.child("receive").val(),
//                     "refNumb":snapshot.child("refNumb").val()
//                 })
//             }
           
//         })

//     })
// })