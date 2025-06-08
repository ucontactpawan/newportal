document.addEventListener("DOMContentLoaded", function () {
  // Initialize datepicker for date inputs if using one
  if ($.fn.datepicker) {
    $(".logs-date-input").datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
    });
  }

  // Handle filter form submission
  document
    .getElementById("logsFilterForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        employee_id: document.getElementById("employeeFilter").value,
        date_from: document.getElementById("dateFrom").value,
        date_to: document.getElementById("dateTo").value,
        status: document.getElementById("statusFilter").value,
      };

      // Add query parameters to URL
      const params = new URLSearchParams(formData);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.location.href = newUrl;
    });

  // Handle clear filters
  document
    .getElementById("clearFilters")
    .addEventListener("click", function () {
      window.location.href = window.location.pathname;
    });

  // Export functionality
  document.getElementById("exportLogs").addEventListener("click", function () {
    const filters = {
      employee_id: document.getElementById("employeeFilter").value,
      date_from: document.getElementById("dateFrom").value,
      date_to: document.getElementById("dateTo").value,
      status: document.getElementById("statusFilter").value,
    };

    // Convert filters to query string
    const params = new URLSearchParams(filters);

    // Redirect to export endpoint
    window.location.href = `includes/export_logs.php?${params.toString()}`;
  });

  // Function to calculate and display attendance status
  function calculateStatus(entry_time, schedule_time) {
    const entry = new Date(`2000-01-01 ${entry_time}`);
    const schedule = new Date(`2000-01-01 ${schedule_time}`);

    // Consider 15 minutes grace period
    const grace = new Date(schedule.getTime() + 15 * 60000);

    if (entry <= grace) {
      return '<span class="logs-status logs-status-ontime">On Time</span>';
    } else {
      return '<span class="logs-status logs-status-late">Late</span>';
    }
  }

  // Apply status badges if they exist
  document.querySelectorAll("[data-entry-time]").forEach((element) => {
    const entryTime = element.dataset.entryTime;
    const scheduleTime = element.dataset.scheduleTime;

    if (entryTime && scheduleTime) {
      element.innerHTML = calculateStatus(entryTime, scheduleTime);
    } else {
      element.innerHTML =
        '<span class="logs-status logs-status-absent">Absent</span>';
    }
  });
});
