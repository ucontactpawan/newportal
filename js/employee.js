// Function to show add modal
function showAddModal() {
  $("#addEmployeeModal").modal("show");
}

$(document).ready(function () {
  // Search functionality
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("table tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Add Employee Form Submit
  $("#addEmployeeForm").on("submit", function (e) {
    e.preventDefault();

    var formData = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      contact: $("#contact").val().trim(),
      address: $("#address").val().trim(),
      position: $("#position").val().trim(),
      schedule: $("#schedule").val(),
    };

    $.ajax({
      url: "includes/save_employee.php",
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          alert(response.message);
          $("#addEmployeeModal").modal("hide");
          $("#addEmployeeForm")[0].reset();
          location.reload();
        } else {
          alert("Error: " + response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error details:", xhr.responseText);
        alert("Error occurred while saving employee");
      },
    });
  });

  // Delete Employee
  $(".delete-btn").on("click", function () {
    const id = $(this).data("id");
    if (confirm("Are you sure you want to delete this employee?")) {
      $.ajax({
        url: "includes/delete_employee.php",
        type: "POST",
        data: { id: id },
        dataType: "json",
        success: function (response) {
          if (response.success) {
            location.reload();
          } else {
            alert("Error: " + response.message);
          }
        },
        error: function () {
          alert("Error occurred while deleting employee");
        },
      });
    }
  });

  // Modal Controls
  $(".add-employee-btn").click(function () {
    $("#addEmployeeModal").modal("show");
  });

  $(".close, .employee-btn-cancel").click(function () {
    $("#addEmployeeModal").modal("hide");
    $("#addEmployeeForm")[0].reset();
  });

  $(window).click(function (e) {
    if ($(e.target).is("#addEmployeeModal")) {
      $("#addEmployeeModal").modal("hide");
      $("#addEmployeeForm")[0].reset();
    }
  });
});

// Sidebar toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const body = document.body;

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      body.classList.toggle("sidebar-collapsed");
      localStorage.setItem(
        "sidebarCollapsed",
        body.classList.contains("sidebar-collapsed")
      );
    });
  }

  // Restore the sidebar state on page load
  if (localStorage.getItem("sidebarCollapsed") === "true") {
    body.classList.add("sidebar-collapsed");
  }
});
