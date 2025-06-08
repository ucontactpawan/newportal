<?php
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Set content type to JSON
header("Content-Type: application/json");

// Include database connection
require_once "db.php";

try {
    // Check request method
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Validate required fields
    $required_fields = ["name", "email", "position", "contact", "address", "schedule"];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Sanitize input
    $name = mysqli_real_escape_string($conn, $_POST["name"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $position = mysqli_real_escape_string($conn, $_POST["position"]);
    $contact = mysqli_real_escape_string($conn, $_POST["contact"]);
    $address = mysqli_real_escape_string($conn, $_POST["address"]);
    $schedule = mysqli_real_escape_string($conn, $_POST["schedule"]);

    // Generate default password
    $default_password = password_hash("employee123", PASSWORD_DEFAULT);

    // Check if email already exists
    $check_email = "SELECT id FROM employees WHERE email = ?";
    $check_stmt = mysqli_prepare($conn, $check_email);
    mysqli_stmt_bind_param($check_stmt, "s", $email);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);

    if (mysqli_stmt_num_rows($check_stmt) > 0) {
        throw new Exception("Email already exists");
    }
    mysqli_stmt_close($check_stmt);

    // Prepare the insert query
    $query = "INSERT INTO employees (name, email, position, contact, address, schedule, password) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $query);
    if (!$stmt) {
        throw new Exception("Query preparation failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param(
        $stmt,
        "sssssss",
        $name,
        $email,
        $position,
        $contact,
        $address,
        $schedule,
        $default_password
    );

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Failed to add employee: " . mysqli_stmt_error($stmt));
    }

    // Get the new employee ID
    $new_id = mysqli_insert_id($conn);

    // Success response
    echo json_encode([
        "success" => true,
        "message" => "Employee added successfully",
        "employee_id" => $new_id
    ]);
} catch (Exception $e) {
    // Log the error
    error_log("Error in save_employee.php: " . $e->getMessage());

    // Error response
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

// Close database connection
if (isset($stmt)) {
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);
