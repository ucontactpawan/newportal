function showAddModal() {
  $("#addEmployeeModal").modal("show");
}

$(document).ready(function () {
  // Add Employee button click
  $(".add-employee-btn").click(function () {
    showAddModal();
  }); // Form submission
  $("#addEmployeeForm").on("submit", function (e) {
    e.preventDefault();

    // Get form data
    var formData = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      position: $("#position").val().trim(),
      contact: $("#contact").val().trim(),
      address: $("#address").val().trim(),
      schedule: $("#schedule").val(),
    };

    // Validate form data
    for (var key in formData) {
      if (!formData[key]) {
        alert("Please fill in all fields");
        return;
      }
    }
    $.ajax({
      url: "includes/save_employee.php",
      type: "POST",
      data: formData,
      dataType: "json",
      beforeSend: function () {
        // Disable submit button
        $(".employee-btn-save").prop("disabled", true);
      },
      success: function (response) {
        if (response.success) {
          alert(response.message);
          $("#addEmployeeModal").modal("hide");
          $("#addEmployeeForm")[0].reset();
          location.reload();
        } else {
          alert("Error: " + (response.message || "Unknown error occurred"));
        }
      },
      error: function (xhr, status, error) {
        console.error("Error details:", {
          error: error,
          status: status,
          response: xhr.responseText,
        });
        try {
          const response = JSON.parse(xhr.responseText);
          alert("Error: " + (response.message || "Unknown error occurred"));
        } catch (e) {
          alert("Error occurred while saving employee. Please try again.");
        }
      },
      complete: function () {
        // Re-enable submit button
        $(".employee-btn-save").prop("disabled", false);
      },
    });
  });

  // Modal close buttons
  $(".btn-close, .employee-btn-cancel").click(function () {
    $("#addEmployeeModal").modal("hide");
    $("#addEmployeeForm")[0].reset();
  });

  // Search functionality
  $("#searchEmployee").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#employeeTable tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
