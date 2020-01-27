//table VA
var table7 = $("#tabel-va").DataTable({
    "aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
    "iDisplayLength": 5,
	"paging":false,
    "order": [0,"asc"],
    "columnDefs": [
    {
        targets: 0,
        className: 'dt-body-center',
        width: "5%",
        orderable:false
    },
    {
        targets: 1,
        className: 'dt-body-left',
        width: "10%",
        orderable:false
    },
    {
        targets: 2,
        className: 'dt-body-left',
        width:"25%"
    },
    {
        targets: 3,
        className: 'dt-body-center',
        width:"15%"
    },
    {
        targets: 4,
        className: 'dt-body-right',
        width:"15%"
    }
    ],
    dom: 'Bfrtip',
    buttons: [ {
        extend: 'excelHtml5',
        autoFilter: true,
        sheetName: 'Tagihan Virtual Account',
        exportOptions: {
            columns: [ 1, 2, 4]
        },
    } ]
})

function get_fmoney(money) {
	
	var rev     = parseInt(money, 10).toString().split('').reverse().join('');
	var rev2    = '';
	for(var i = 0; i < rev.length; i++){
		rev2  += rev[i];
		if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
			rev2 += ',';
		}
	}
	return (rev2.split('').reverse().join(''))
	
}

function reformatDate(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[1]);
	inputMonth=parseInt(inputBroke[0]);
	inputYear=inputBroke[2];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	return (outputDay+"-"+outputMonth+"-"+inputYear);
	
}

$(document).ready(function() {
    virtualList={}

    tenantRef = firebase.database().ref("tenant")
    var trRef = firebase.database().ref("tenant-room");
    var virtual = firebase.database().ref("virtualAccountReport")
    var thisMonth = Date.today().toString("MM")
    var thisYear = Date.today().toString("yyyy")
    var lastMonth = Date.today().addMonths(-1).toString("MM")
    var lastYear = Date.today().addMonths(-1).toString("yyyy")

    trRef.on('child_added', function(snapshot){
        var tenant_id = snapshot.key
        trRef.child(tenant_id).on('child_added', function(snapshot){
            var room_id = snapshot.key
            trRef.child(tenant_id+"/"+room_id).on('value', function(snapshot){
                var ref_number = snapshot.child("ref_number").val()
                var build_no = parseInt(snapshot.child("build_no").val()).toString()
                tenantRef.child(tenant_id).on('value', function(snapshot){
                    var full_name = snapshot.child('full_name').val()
                    virtual.child(tenant_id).on('child_added', function(snapshot){
                        var monthYear = snapshot.key
                        virtual.child(tenant_id+"/"+monthYear).on('value',function(snapshot){
                            var due = snapshot.child("due").val()
                            var date = snapshot.child("date").val()
                            virtualList[tenant_id+"-"+monthYear]={
                                "due": due,
                                "ref_number": ref_number.split(" ").join(""),
                                "full_name": full_name,
                                "date": date,
                                "build_no": build_no
                            }
                            
                        })
                    })
                })
            })
        })
        
    })

    $("#showAllReport").click(function() {
        $("#cover-spin").fadeIn(250, function() {
            $(this).show();
        });
        
        table7
			.clear()
			.draw();
            
        setTimeout(() => {
            for (i in virtualList){
                table7.row.add([virtualList[i].build_no,virtualList[i].ref_number,virtualList[i].full_name,reformatDate(virtualList[i].date),get_fmoney(virtualList[i].due)]).node().id = i;
            }
            table7.draw()
            $("#cover-spin").fadeOut(250, function() {
                $(this).hide();
            })
        }, 5000);
    })

    $("#showLastReport").click(function() {
        $("#cover-spin").fadeIn(250, function() {
            $(this).show();
        });
        table7
            .clear()
            .draw();
            
        setTimeout(() => {
            for (i in virtualList){
                month = i.split("-")[1].split(":")[0]
                year = i.split("-")[1].split(":")[1]
                if(month==lastMonth && year == lastYear){
                    table7.row.add([virtualList[i].build_no,virtualList[i].ref_number,virtualList[i].full_name,reformatDate(virtualList[i].date),get_fmoney(virtualList[i].due)]).node().id = i;
                }
            }
            table7.draw()
            $("#cover-spin").fadeOut(250, function() {
                $(this).hide();
            })
        }, 5000); 
    })

    $("#showNowReport").click(function() {
        
        $("#cover-spin").fadeIn(250, function() {
            $(this).show();
        });
        table7
            .clear()
            .draw();
            
        setTimeout(() => {
            console.log(virtualList)
            for (i in virtualList){
                month = i.split("-")[1].split(":")[0]
                year = i.split("-")[1].split(":")[1]
                if(month==thisMonth && year == thisYear){
                    table7.row.add([virtualList[i].build_no,virtualList[i].ref_number,virtualList[i].full_name,reformatDate(virtualList[i].date),get_fmoney(virtualList[i].due)]).node().id = i;
                }
                    
            }
            table7.draw()
            $("#cover-spin").fadeOut(250, function() {
                $(this).hide();
            })
        }, 5000);  
    })

    $("#filterForm").validate({
        submitHandler: function() {
            $('#filterModal').modal('toggle');
            
            $("#cover-spin").fadeIn(250, function() {
                $(this).show();
            });

            table7
			    .clear()
			    .draw();
                
            setTimeout(() => {
                for (i in virtualList){
                    var filterMonth = $("#MonthsFilter").val()
                    var filterYear = $("#YearFilter").val()
                    month = i.split("-")[1].split(":")[0]
                    year = i.split("-")[1].split(":")[1]
                    if(month==filterMonth && year==filterYear){
                        table7.row.add([virtualList[i].build_no,virtualList[i].ref_number,virtualList[i].full_name,reformatDate(virtualList[i].date),get_fmoney(virtualList[i].due)]).node().id = i;
                    }
                        
                }
                table7.draw()
                $("#cover-spin").fadeOut(250, function() {
                    $(this).hide();
                })
            }, 5000);

        }
    })

    setTimeout(() => {
        $("#showNowReport").click();
    }, 6000);
    
    
    $('#filterStartDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	});
	
	$('#filterEndDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	});
	
	$("#showCustomReport").click(function() {
		$("#filterModal").modal();
	});
    

})

