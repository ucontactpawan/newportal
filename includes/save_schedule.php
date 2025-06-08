<?php
session_start();
require_once "db.php";

// Set content type to JSON
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($input['employee_id'], $input['shift_start'], $input['shift_end'], $input['day_of_week'])) {
        throw new Exception('Missing required fields');
    }

    // Sanitize input
    $employee_id = mysqli_real_escape_string($conn, $input['employee_id']);
    $shift_start = mysqli_real_escape_string($conn, $input['shift_start']);
    $shift_end = mysqli_real_escape_string($conn, $input['shift_end']);
    $day_of_week = mysqli_real_escape_string($conn, $input['day_of_week']);
    $schedule_id = isset($input['id']) ? mysqli_real_escape_string($conn, $input['id']) : null;

    // Prepare query based on whether this is an insert or update
    if ($schedule_id) {
        // Update existing schedule
        $query = "UPDATE schedules SET 
                    employee_id = ?, 
                    shift_start = ?, 
                    shift_end = ?, 
                    day_of_week = ? 
                 WHERE id = ?";
    } else {
        // Insert new schedule
        $query = "INSERT INTO schedules (employee_id, shift_start, shift_end, day_of_week) 
                 VALUES (?, ?, ?, ?)";
    }

    // Prepare and execute statement
    $stmt = mysqli_prepare($conn, $query);
    if ($schedule_id) {
        mysqli_stmt_bind_param($stmt, "issss", $employee_id, $shift_start, $shift_end, $day_of_week, $schedule_id);
    } else {
        mysqli_stmt_bind_param($stmt, "isss", $employee_id, $shift_start, $shift_end, $day_of_week);
    }

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Database error: " . mysqli_stmt_error($stmt));
    }

    // Success response
    echo json_encode([
        'success' => true,
        'message' => $schedule_id ? 'Schedule updated successfully' : 'Schedule added successfully'
    ]);
} catch (Exception $e) {
    // Error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
if (isset($stmt)) {
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);
