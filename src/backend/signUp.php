<?php
include 'connection.php'; // Include your database connection file

header('Content-Type: application/json');

// Get input data from the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$email = $data['email'];
$fullName = $data['fullName'];
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Check if the email already exists in the database
$query = $conn->prepare("SELECT email FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

// Hash the password with cost 11
$options = ['cost' => 11];
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert new user into the database
$insertQuery = $conn->prepare("INSERT INTO users (email, fullname, password, type) VALUES (?, ?, ?, ?)");
$type = 'client'; // Default type
$insertQuery->bind_param("ssss", $email, $fullName, $hashedPassword, $type);

if ($insertQuery->execute()) {
    echo json_encode(["success" => true, "message" => "Signup successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
    http_response_code(500);
}

$insertQuery->close();
$conn->close();
?>
