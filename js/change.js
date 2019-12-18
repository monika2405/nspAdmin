// var fpay = firebase.database().ref("first-payment");
// var payment = firebase.database().ref("payment");
// var trRef = firebase.database().ref("tenant-room");

// trRef.on('child_added', function(snapshot){
//     var t_id = snapshot.key
//     trRef.child(t_id).on('child_added', function(snapshot){
//         var bondPrice=snapshot.child("rent_bond").val();
//         var rentPrice=snapshot.child("rent_price").val();
//         payment.child(t_id).on('value', function(snapshot){
//             if(snapshot.val()!=null){
//                 fpay.child(t_id).set({
//                     "payment":1,
//                     "bond-balance": 0
//                 })
//             }else{
//                 fpay.child(t_id).set({
//                     "payment":0,
//                     "bond-balance": bondPrice+rentPrice
//                 })
//             }
//         })
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


// for (let index = 737; index <= 746; index++) {
    
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
//     reportback.child("04").on('child_added', function(snapshot){
//         var key = snapshot.key
//         reportback.child("04"+"/"+key).on('value', function(snapshot){
//             var tenant_id = snapshot.child("tenant_id").val();
//             var inputDate = snapshot.child("inputDate").val();
//             if(inputDate=="12/11/2019"){
//                 reportRef.child("04/"+tenant_id).push({
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

// reportback.on('child_added', function(snapshot){
//     var build_id = snapshot.key
//     reportback.child("04").on('child_added', function(snapshot){
//         var key = snapshot.key
//         reportback.child("04"+"/"+key).on('value', function(snapshot){
//             var tenant_id = snapshot.child("tenant_id").val();
//             var inputDate = snapshot.child("inputDate").val();
//             // if(inputDate=="12/11/2019" || inputDate=="12/12/2019" || inputDate=="12/13/2019" || inputDate=="12/14/2019"){
//                 reportRef.child("04/"+tenant_id).push({
//                     "date":snapshot.child("date").val(),
//                     "due": snapshot.child("due").val(),
//                     "inputDate":snapshot.child("inputDate").val(),
//                     "receive":snapshot.child("receive").val(),
//                     "refNumb":snapshot.child("refNumb").val()
//                 })
//             //}
           
//         })

//     })
// })

