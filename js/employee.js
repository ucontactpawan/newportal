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
  $(".add-employee-btn").click(function () {
    $("#addEmployeeModal").modal("show");
  });
  // Handle form submission  $("#addEmployeeForm").submit(function (e) {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    
    var formData = {
      name: $("#name").val(),
      email: $("#email").val(),
      contact: $("#contact").val(),
      address: $("#address").val(),
      position: $("#position").val(),
      schedule: $("#schedule").val(),
    };
    
    console.log("Form data:", formData); // Debug log

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
        alert("Error occurred while saving employee. Please check console for details.");
      },
    });
  });

  // Edit button click
  $(".edit-btn").click(function () {
    var employeeId = $(this).data("id");
    // Add your edit functionality
  });

  // Delete button click
  $(".delete-btn").click(function () {
    var employeeId = $(this).data("id");
    if (confirm("Are you sure you want to delete this employee?")) {
      $.ajax({
        url: "includes/delete_employee.php",
        type: "POST",
        data: { id: employeeId },
        success: function (response) {
          location.reload();
        },
      });
    }
  });
});

// Modal functionality
const modal = document.getElementById("addEmployeeModal");
const addBtn = document.querySelector(".add-employee-btn");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.querySelector(".btn-cancel");
const addEmployeeForm = document.getElementById("addEmployeeForm");

// Open modal
addBtn.onclick = function () {
  modal.style.display = "block";
};

// Close modal
function closeModal() {
  modal.style.display = "none";
  addEmployeeForm.reset();
}

closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

// Add Employee Form Submit
$("#addEmployeeForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: "add_employee.php",
    type: "POST",
    data: $(this).serialize(),
    dataType: "json",
    success: function (response) {
      if (response.success) {
        alert("Employee added successfully");
        $("#addEmployeeModal").hide();
        location.reload();
      } else {
        alert("Error: " + response.message);
      }
    },
    error: function () {
      alert("Error occurred while adding employee");
    },
  });
});

// Delete Employee
$(".delete-btn").on("click", function () {
  if (confirm("Are you sure you want to delete this employee?")) {
    const id = $(this).data("id");

    $.ajax({
      url: "delete_employee.php",
      type: "POST",
      data: { id: id },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          alert("Employee deleted successfully");
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

// Sidebar toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const body = document.body;

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      body.classList.toggle("sidebar-collapsed");

      // Save the state
      const isCollapsed = body.classList.contains("sidebar-collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    });
  }

  // Restore the sidebar state on page load
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    body.classList.add("sidebar-collapsed");
  }
});
