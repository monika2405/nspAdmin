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
			return (rev2.split('').reverse().join(''));
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
	inputDay=inputBroke[1];
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

function deleteReport(key,build_no,t_id){
    $("#confirmYes").off();
	$("#modalConfirm").modal();
	$("#confirmYes").click(function () {
		startPageLoad();
        console.log("reportAccount2/"+build_no+"/"+t_id+"/"+key)
		firebase.database().ref("reportAccount2/"+build_no+"/"+t_id+"/"+key).remove(
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


function editTransModal(key,build_no,ref_id,t_id,recv,due,date) {

    $("#modalTransAdj").modal();
    $("#key").val(key);
    $("#t_id").val(t_id)
    $("#TransReceive").val(recv);
    $("#TransDue").val(due);
    $("#RefNumbTenant").val(ref_id);
    $("#AdjstDate").val(reformatDate(date));
	$("#build_no").val(build_no);

}

function editTrans(){
    var key_tenant=$("#key").val();
    var buildNo = $("#build_no").val();
    var tenant_id = $("#t_id").val();
    var date = $("#AdjstDate").val()
    var reportRef= firebase.database().ref("reportAccount2/"+buildNo+"/"+tenant_id+"/"+key_tenant);
    console.log(reportRef)
    var recv= rem_moneydot($("#TransReceive").val());
    var due= rem_moneydot($("#TransDue").val())

    

    reportRef.update({
        "receive":recv,
        "due": due,
        "date":reformatDate2(date)
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
    reportdata = {}
    
    
    //firebase ref
	var trRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref().child("tenant");
    var reportRef= firebase.database().ref("reportAccount2");
    var historyRoom = firebase.database().ref("HistoryRoom")
       
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

    historyRoom.on('child_added', function(snapshot){
        var build_id= snapshot.key
        historyRoom.child(build_id).on('child_added', function(snapshot){
            var room_id = snapshot.key
            historyRoom.child(build_id+"/"+room_id).on('child_added', function(snapshot){
                var tenant_id = snapshot.key
                historyRoom.child(build_id+"/"+room_id+"/"+tenant_id+"/tenant").on("value", function(snapshot){
                    tenantdata[tenant_id]=snapshot.val()
                })
                historyRoom.child(build_id+"/"+room_id+"/"+tenant_id+"/tenant-room").on("value", function(snapshot){
                    tenant[tenant_id]=snapshot.val()
                })
            })
        })
    })

    reportRef.on('child_added', function(snapshot){
        var build_id = snapshot.key
        reportRef.child(build_id).on('child_added', function(snapshot){
            var tenant_id = snapshot.key
            reportRef.child(build_id+"/"+tenant_id).on('child_added', function(snapshot){
                var key_id = snapshot.key
                reportRef.child(build_id+"/"+tenant_id+"/"+key_id).on('value', function(snapshot){
                    reportdata[key_id+"/"+tenant_id]=snapshot.val()
                    
                    // 
                })
                
            })
            //  
        })
    })
   

    setTimeout(() => {
        table.clear();
        console.log(reportdata)
        for (i in reportdata){
            t_id = (i).split("/")[1]
            console.log(t_id)
            key_id = i.split("/")[0]
            table.row.add([tenant[t_id].build_no,reportdata[i].refNumb,tenantdata[t_id].full_name,reformatDate(reportdata[i].date),reportdata[i].due,reportdata[i].receive,"<button id='editbutt' class='btn btn-xs btn-success' title='Edit' onclick=editTransModal('"+key_id+"','"+tenant[t_id].build_no+"','"+reportdata[i].refNumb+"','"+t_id+"','"+reportdata[i].receive+"','"+reportdata[i].due+"','"+reportdata[i].date+"')><i class='fa fa-pencil'></i></button><button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteReport('"+key_id+"','"+tenant[t_id].build_no+"','"+t_id+"')><i class='fa fa-times'></i></button>"]).node().id = 'report'+key_id;
        }
            
        table.draw()
        
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
    
    $('#editReportTable thead tr').clone(true).appendTo( '#editReportTable thead' );
    $('#editReportTable thead tr:eq(1) th').each( function (i) {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" style="width:100%"/>' );
 
        $( 'input', this ).on( 'keyup change', function () {
            if ( table.column(i).search() !== this.value ) {
                table
                    .column(i)
                    .search( this.value )
                    .draw();
            }
        } );
    } );
    
    setTimeout(() => {
        PageLoadOff();
    }, 20000);
})