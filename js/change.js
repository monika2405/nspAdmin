var trRef = firebase.database().ref("tenant-room");
var report = firebase.database().ref("reportAccount");

for (let index = 708; index <= 726; index++) {
    
    trRef.child("t_"+index).once('child_added', function(snapshot) {
        var bond = snapshot.child("rent_bond").val();
        var rent = snapshot.child("rent_price").val();
        var startdate = snapshot.child("start_date").val();
        var build_no=snapshot.child("build_no").val();
        console.log(snapshot.child("build_no").val())
        report.child(build_no).push({
            "date":startdate,
            "inputDate":"11/26/2019",
            "due":bond+rent,
            "receive":0
        })
    })
    
}

