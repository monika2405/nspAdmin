var table;

function addMaintenance() {
	$("#addMainForm").trigger("reset");
	$("#mainDetailsBlock").hide();
	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	});
}

$(document).ready(function() {
	
	table = $('#maintenanceTable').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
		"fixedHeader": true,
		"order": [[2,"desc"]]
	});

	$("#addMainPop").click(function() {
		$("#addMainModal").modal();
	});

	$("#addMainModal").draggable({
		handle: ".modal-header"
	});

	$('#reqDateDP').datepicker({
		format: "d-M-yy",
		autoclose: true
	});

	$("#mainType").change(function() {
		if ($(this).val() == "Other") {
			$("#mainDetailsBlock").fadeIn(250, function() {
				$(this).show();
			});
		} else {
			$("#mainDetailsBlock").fadeOut(250, function() {
				$(this).hide();
			});
		}
	});
	
	$("#addMainButton").click(function() {
		$("#addMainForm").submit();
	});

	$("#addMainForm").validate({
		submitHandler: function() {
			$('#addMainModal').modal('toggle');
			//start loading icon
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			addMaintenance();
		}
	});

	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	});
	
})