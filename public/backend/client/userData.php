<?php
include 'connection.php';

header('Content-Type: application/json');
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$userId = $data; 

$query = $conn->prepare("SELECT fullName, email, phone FROM users WHERE id = ?");
$query->bind_param("i", $userId);
$query->execute();

$result = $query->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    echo json_encode(array(
        "name" => $user['fullName'],
        "email" => $user['email'],
        "phoneNumber" => $user['phone']
    ));
} else {
    echo json_encode(["error" => "No user found with userId $userId"]);
}

// Close connections
$query->close();
$conn->close();
?>
