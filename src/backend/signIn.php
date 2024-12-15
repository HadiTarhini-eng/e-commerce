<?php
include 'connection.php'; // Include your database connection file
header('Content-Type: application/json');
// Get input data from the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$email = $data['email'];
$password = $data['password'];

$query = $conn->prepare("SELECT id,fullName,phone,type,password FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();
    $hashedPassword = trim($row['password']);
    // Verify the entered password with the hashed password
    if (password_verify($password, $hashedPassword)) {
        
        echo json_encode(["success" => true, "message" => "Sign-in successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not found"]);
}

$query->close();
$conn->close();
?>
