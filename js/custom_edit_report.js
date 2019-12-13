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
        },
        {
            targets: 6,
            width: "10%",
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

function deleteReport(key,build_no){
    $("#confirmYes").off();
	$("#modalConfirm").modal();
	$("#confirmYes").click(function () {
		startPageLoad();
        console.log("reportBackup/"+build_no+"/"+key)
		firebase.database().ref("reportBackup/"+build_no+"/"+key).remove(
		).then(function onSuccess(res) {
            var row = table.row('report'+key);
			row.remove();
		    table.draw(false);
            addNotification("Report removed","Report successfully removed.");
			PageLoadOff();
			}).catch(function onError(err) {
				addNotification("Error Remove Booking",err.code+" : "+err.message);
			});
	})
}


function editTransModal(key,build_no,recv,due) {

    $("#modalTransAdj").modal();
    $("#key").val(key);
    $("#TransReceive").val(recv);
    $("#TransDue").val(due);
   
    if(parseInt(build_no)<10){
        build_no="0"+build_no.toString()
    }
	$("#build_no").val(build_no);

}

function editTrans(){
    var key_tenant=$("#key").val();
    var buildNo = $("#build_no").val();
    var reportRef= firebase.database().ref("reportBackup/"+buildNo+"/"+key_tenant);
    
    var recv= rem_moneydot($("#TransReceive").val());
    var due= rem_moneydot($("#TransDue").val())
    var refNum = $("#refN").val();
    var tenant_id = $("#t_id").val();

    reportRef.update({
        "receive":recv,
        "due": due,
        "refNumb":refNum,
        "tenant_id":tenant_id
    }).then(function onSuccess(res) {
        addNotification("Report Edited","Report successfully edited.");
		PageLoadOff();
		}).catch(function onError(err) {
			addNotification("Error Edit",err.code+" : "+err.message);
		});  
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
                    $("#RefNumbTenant").autocomplete({
                        source: function(request, response) {
                            var results = $.ui.autocomplete.filter(tenantNames, request.term);
                            response(results.slice(0, 10));
                        },
                        select: function(event, ui) {
                            $("#RefNumbTenant").val(ui.item.label.split("(")[0].slice(0,-1));
                            $("#t_id").val(ui.item.tenantid);
                            $("#refN").val(ui.item.refnumber);
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
    
$(document).ready(function() {
    table
		.clear()
        .draw();

    report={}
    tenant={}
	tenantdata={}
    
    //firebase ref
	var trRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref().child("tenant");
    var reportRef= firebase.database().ref("reportBackup");
       
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
		
	});
    reportRef.child("02").on('child_added', function(snapshot){
        report[snapshot.key]=snapshot.val();
    })

    setTimeout(() => {
        if(report!={}&&tenantdata!={}){
            autocompleteFunction();
            console.log(report)

            for (i in report){
               if(report[i].refNumb==null){
                   table.row.add(["02"," "," ",reformatDate(report[i].date),get_fmoney(report[i].receive),get_fmoney(report[i].due),"<button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteReport("+i+",'02')><i class='fa fa-times'></i></button><button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+i+",02,"+report[i].receive+","+report[i].due+")><i class='fa fa-pencil'></i></button>"]).node().id = 'report'+i;
               }else{
                table.row.add(["02",report[i].refNumb,tenantdata[report[i].tenant_id].full_name,reformatDate(report[i].date),get_fmoney(report[i].receive),get_fmoney(report[i].due),"<button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteReport("+i+",'02')><i class='fa fa-times'></i></button><button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+i+",02,"+report[i].receive+","+report[i].due+")><i class='fa fa-pencil'></i></button>"]).node().id = 'report'+i;
               }
               
           }
           table.draw();
        }else{
            setTimeout(() => {
                for (i in report){
                   if(report[i].refNumb==null){
                       table.row.add(["02"," "," ",reformatDate(report[i].date),get_fmoney(report[i].receive),get_fmoney(report[i].due),"<button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteReport("+i+",'02')><i class='fa fa-times'></i></button><button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+i+",02,"+report[i].receive+","+report[i].due+")><i class='fa fa-pencil'></i></button>"]).node().id = 'report'+i;
                   }else{
                    table.row.add(["02",report[i].refNumb,tenantdata[report[i].tenant_id].full_name,reformatDate(report[i].date),get_fmoney(report[i].receive),get_fmoney(report[i].due),"<button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteReport("+i+",'02')><i class='fa fa-times'></i></button><button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal("+i+",02,"+report[i].receive+","+report[i].due+")><i class='fa fa-pencil'></i></button>"]).node().id = 'report'+i;
                   }
                   
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
    //amount listener
	$("#TransReceive").on('keyup change', function() {
		$("#TransReceive").val(get_moneydot($("#TransReceive").val()));
    })
    $("#TransDue").on('keyup change', function() {
		$("#TransDue").val(get_moneydot($("#TransDue").val()));
	})
    
    setTimeout(() => {
        PageLoadOff();
    }, 5000);
})