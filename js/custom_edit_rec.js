var table = $('#editReportTable').DataTable({
    "aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
    "iDisplayLength": 5,
    "paging":false,
    "fixedHeader": true,
    "order": [],
    "columnDefs": [
        {
            targets: 0,
            width: "5%",
            orderable:false,
            className: 'dt-head-center'
        },
        {
            targets: 1,
            width: "10%",
            className: 'dt-head-center'
        },
        {
            targets: 2,
            width: "15%",
            className: 'dt-head-center'
        },
        {
            targets: 3,
            width: "10%",
            className: 'dt-head-center'
        },
        {
            targets: 4,
            width: "15%",
            className: 'dt-head-center'
        },
        {
            targets: 5,
            width: "15%",
            className: 'dt-head-center'
        }    
    ]
})

function startPageLoad() {
	
	$("#cover-spin").fadeIn(250, function() {
        $(this).hide();
    })
	
}

function PageLoadOff() {
	
	$("#cover-spin").fadeOut(250, function() {
        $(this).hide();
    })
	
}

function spaceDelete(string){
    var newString = string.split(" ").join("_")
    return newString
}

function spaceBack(string){
    var newString = string.split("_").join(" ")
    return newString
}

function toStr(str){
    var newstr = '"'+str+'"'
    return newstr
}

function get_fmoney(money) {
	
	if (money != null) {
		if (parseInt(money) < 0) {
			var rev     = Math.abs(parseInt(money, 10)).toString().split('').reverse().join('');
			var rev2    = '';
			for(var i = 0; i < rev.length; i++){
				rev2  += rev[i];
				if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
					rev2 += '.';
				}
			}
			return ("(Rp. "+rev2.split('').reverse().join('') + ',-)');
		} else {
			var rev     = parseInt(money, 10).toString().split('').reverse().join('');
			var rev2    = '';
			for(var i = 0; i < rev.length; i++){
				rev2  += rev[i];
				if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
					rev2 += '.';
				}
			}
			return ("Rp. "+rev2.split('').reverse().join('') + ',-');
		}
	} else {
		return null;
	}
	
}

function rem_fmoney(money) {
	
	if (money != null) {
		if (money.substring(0,1) == "(") {
			return parseInt(money.substring(5,money.length-3).split(".").join(""))*-1;
		} else {
			return parseInt(money.substring(4,money.length-2).split(".").join(""));
		}
	} else {
		return null;
	}
	
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


function rem_moneydot(money) {
	
	return parseInt(money.split(".").join(""));
	
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


function editTransModal(id, payPlan, pay, rent, date) {

    $("#modalTransAdj").modal();
    $("#t_id").val(id);
    $("#payPlan").val(payPlan);
    $("#rent").val(rent);
    $("#TransReceive").val(pay);
    $("#RefNumbTenant").val(date);

}

function editTrans(){
    var t_id=$("#t_id").val();
    var payPlan=$("#payPlan").val();
    var rent=$("#rent").val();
    var recurringRef= firebase.database().ref("recurringPay/"+t_id+"/rental");
    
    var pay= $("#TransReceive").val();
    var date=$("#RefNumbTenant").val()

    recurringRef.update({
        "payment":spaceBack(pay),
        "prevRecurringDate": date,
        "rent":rent,
        "payPlan":payPlan
    }).then(function onSuccess(res) {
        addNotification("Report Edited","Report successfully edited.");
		PageLoadOff();
		}).catch(function onError(err) {
			addNotification("Error Edit",err.code+" : "+err.message);
		});  
}

    
$(document).ready(function() {
    table
		.clear()
        .draw();

    rec={}
    tenant={}

    //firebase ref
    var recu = firebase.database().ref("recurringPay");
    var tenantRoom = firebase.database().ref("tenant-room")
    var history = firebase.database().ref("HistoryRoom")
       
    recu.on('child_added',function(snapshot){
		var id = snapshot.key
		recu.child(id+"/rental").once("value", function(snapshot){
			
			rec[id]=snapshot.val()
		
		})
    })

    tenantRoom.on('child_added', function(snapshot){
        var id = snapshot.key
        tenantRoom.child(id).on('child_added', function(snapshot){
            var room_id = snapshot.key
            tenantRoom.child(id+"/"+room_id).on("value", function(snapshot){
                tenant[id]=snapshot.val()
            })
        })
    })

    history.on("child_added", function(snapshot){
        var build_id = snapshot.key
        history.child(build_id).on('child_added', function(snapshot){
            var room_id = snapshot.key
            history.child(build_id+"/"+room_id).on('child_added', function(snapshot){
                var tenant_id = snapshot.key
                history.child(build_id+"/"+room_id+"/"+tenant_id+"/tenant-room").on('value', function(snapshot){
                    tenant[tenant_id]=snapshot.val()
                    
                })
            })
        })
    })

    setTimeout(() => {
        console.log(rec)
        if(rec!={}){
            console.log(tenant)

            for (i in rec){
                console.log(i)
                table.row.add(["<a href='tenant_details.html?"+i+"?"+tenant[i].ref_number.split(" ").join("")+"#ledger' class='pull-left'>"+i+"</a>",rec[i].prevRecurringDate,rec[i].payment,rec[i].payPlan,rec[i].rent,"<button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+toStr(i)+","+toStr(rec[i].payPlan)+","+toStr(spaceDelete(rec[i].payment))+","+toStr(rec[i].rent)+","+toStr(rec[i].prevRecurringDate)+")><i class='fa fa-pencil'></i></button>"]).node().id = 'rec'+i;
               
               
           }
           table.draw();
        }else{
            setTimeout(() => {
                for (i in rec){
                    table.row.add(["<a href='tenant_details.html?id="+i+"?"+tenant[i].ref_number.split(" ").join("")+"#ledger' class='pull-left'>"+i+"</a>",rec[i].prevRecurringDate,rec[i].payment,rec[i].payPlan,rec[i].rent,"<button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+toStr(i)+","+toStr(rec[i].payPlan)+","+toStr(spaceDelete(rec[i].payment))+","+toStr(rec[i].rent)+","+toStr(rec[i].prevRecurringDate)+")><i class='fa fa-pencil'></i></button>"]).node().id = 'rec'+i;
               
                   
               }
               table.draw();
            }, 5000);
        }
        
    }, 5000);
    
    //Trans Adj Modal listener
	$("#confirmTransAdjt").click(function() {
		$("#adjustmentTransForm").submit();
	})
	//Trans Adj form validation
	$("#adjustmentTransForm").validate({
		submitHandler: function() {
			$('#modalTransAdj').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			editTrans();
		}
    })

    
    setTimeout(() => {
        PageLoadOff();
    }, 5000);
})