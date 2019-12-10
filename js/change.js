// var trRef = firebase.database().ref("tenant-room");


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
