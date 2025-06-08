<?php
session_start();
include 'includes/db.php';
include 'includes/auth.php';

// Redirect if user is not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get all schedules with employee names
$query = "SELECT s.*, e.name as employee_name 
          FROM schedules s 
          JOIN employees e ON s.employee_id = e.id 
          ORDER BY s.day_of_week, s.shift_start";
$result = mysqli_query($conn, $query);

// Get all employees for the dropdown
$employees_query = "SELECT id, name FROM employees ORDER BY name";
$employees_result = mysqli_query($conn, $employees_query);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schedule Management</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Base styles -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Component styles -->
    <link rel="stylesheet" href="css/components/navbar.css">
    <!-- Schedule specific styles -->
    <link rel="stylesheet" href="css/schedule_page.css">
</head>

<body>
    <?php include 'includes/navbar.php'; ?>
    <?php include 'includes/sidebar.php'; ?>

    <div class="main-content">
        <div class="schedule-container">
            <div class="schedule-header">
                <h2 class="schedule-title">Schedule Management</h2>
                <button class="schedule-btn-add">
                    <i class="fas fa-plus"></i> Add Schedule
                </button>
            </div>

            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Day of Week</th>
                        <th>Shift Start</th>
                        <th>Shift End</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = mysqli_fetch_assoc($result)) { ?>
                        <tr>
                            <td><?php echo htmlspecialchars($row['employee_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['day_of_week']); ?></td>
                            <td><?php echo htmlspecialchars($row['shift_start']); ?></td>
                            <td><?php echo htmlspecialchars($row['shift_end']); ?></td>
                            <td>
                                <div class="schedule-actions">
                                    <button class="schedule-btn-edit" onclick="editSchedule(<?php echo $row['id']; ?>)">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="schedule-btn-delete" onclick="deleteSchedule(<?php echo $row['id']; ?>)">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Schedule Modal -->
    <div id="scheduleModal" class="schedule-modal">
        <div class="schedule-modal-content">
            <div class="schedule-modal-header">
                <h3>Add/Edit Schedule</h3>
                <button type="button" class="schedule-modal-close">&times;</button>
            </div>
            <form id="scheduleForm">
                <input type="hidden" id="scheduleId">
                <div class="schedule-form-group">
                    <label for="employeeSelect">Employee</label>
                    <select id="employeeSelect" class="schedule-form-control" required>
                        <option value="">Select Employee</option>
                        <?php while ($emp = mysqli_fetch_assoc($employees_result)) { ?>
                            <option value="<?php echo $emp['id']; ?>">
                                <?php echo htmlspecialchars($emp['name']); ?>
                            </option>
                        <?php } ?>
                    </select>
                </div>
                <div class="schedule-form-group">
                    <label for="dayOfWeek">Day of Week</label>
                    <select id="dayOfWeek" class="schedule-form-control" required>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
                <div class="schedule-form-group">
                    <label for="shiftStart">Shift Start</label>
                    <input type="time" id="shiftStart" class="schedule-form-control" required>
                </div>
                <div class="schedule-form-group">
                    <label for="shiftEnd">Shift End</label>
                    <input type="time" id="shiftEnd" class="schedule-form-control" required>
                </div>
                <div class="schedule-form-actions">
                    <button type="submit" class="schedule-btn-save">Save Schedule</button>
                    <button type="button" class="schedule-btn-cancel schedule-modal-close">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/schedule_page.js"></script>
</body>

</html>