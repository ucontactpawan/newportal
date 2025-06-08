<?php
session_start();
require_once "db.php";

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Validate input
    if (!isset($_GET['id'])) {
        throw new Exception('Schedule ID is required');
    }

    // Sanitize input
    $schedule_id = mysqli_real_escape_string($conn, $_GET['id']);

    // Prepare and execute select statement
    $query = "SELECT * FROM schedules WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $schedule_id);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Database error: " . mysqli_stmt_error($stmt));
    }

    $result = mysqli_stmt_get_result($stmt);
    $schedule = mysqli_fetch_assoc($result);

    if (!$schedule) {
        throw new Exception("Schedule not found");
    }

    // Success response
    echo json_encode([
        'success' => true,
        'schedule' => $schedule
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
