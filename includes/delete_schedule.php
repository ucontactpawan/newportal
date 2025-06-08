<?php
session_start();
require_once "db.php";

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($input['id'])) {
        throw new Exception('Schedule ID is required');
    }

    // Sanitize input
    $schedule_id = mysqli_real_escape_string($conn, $input['id']);

    // Prepare and execute delete statement
    $query = "DELETE FROM schedules WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $schedule_id);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Database error: " . mysqli_stmt_error($stmt));
    }

    // Check if any rows were affected
    if (mysqli_affected_rows($conn) === 0) {
        throw new Exception("Schedule not found");
    }

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Schedule deleted successfully'
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
