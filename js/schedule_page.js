document.addEventListener("DOMContentLoaded", function () {
  // Initialize datepicker if using one
  if ($.fn.datepicker) {
    $(".schedule-date").datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
    });
  }

  // Show add schedule modal
  function showAddScheduleModal() {
    document.getElementById("scheduleModal").style.display = "block";
  }

  // Hide modal
  function hideScheduleModal() {
    document.getElementById("scheduleModal").style.display = "none";
    document.getElementById("scheduleForm").reset();
  }

  // Add event listeners for modal buttons
  document
    .querySelector(".schedule-btn-add")
    .addEventListener("click", showAddScheduleModal);
  document.querySelectorAll(".schedule-modal-close").forEach((button) => {
    button.addEventListener("click", hideScheduleModal);
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("scheduleModal")) {
      hideScheduleModal();
    }
  });

  // Handle form submission
  document
    .getElementById("scheduleForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        employee_id: document.getElementById("employeeSelect").value,
        shift_start: document.getElementById("shiftStart").value,
        shift_end: document.getElementById("shiftEnd").value,
        day_of_week: document.getElementById("dayOfWeek").value,
      };

      // Validate form data
      if (
        !formData.employee_id ||
        !formData.shift_start ||
        !formData.shift_end ||
        !formData.day_of_week
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Send data to server
      fetch("includes/save_schedule.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Schedule saved successfully");
            hideScheduleModal();
            location.reload(); // Reload to show new schedule
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while saving the schedule");
        });
    });

  // Delete schedule
  function deleteSchedule(scheduleId) {
    if (confirm("Are you sure you want to delete this schedule?")) {
      fetch("includes/delete_schedule.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: scheduleId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Schedule deleted successfully");
            location.reload();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while deleting the schedule");
        });
    }
  }

  // Expose delete function globally
  window.deleteSchedule = deleteSchedule;

  // Edit schedule
  function editSchedule(scheduleId) {
    fetch(`includes/get_schedule.php?id=${scheduleId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const schedule = data.schedule;
          document.getElementById("scheduleId").value = schedule.id;
          document.getElementById("employeeSelect").value =
            schedule.employee_id;
          document.getElementById("shiftStart").value = schedule.shift_start;
          document.getElementById("shiftEnd").value = schedule.shift_end;
          document.getElementById("dayOfWeek").value = schedule.day_of_week;
          showAddScheduleModal();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading the schedule");
      });
  }

  // Expose edit function globally
  window.editSchedule = editSchedule;
});
