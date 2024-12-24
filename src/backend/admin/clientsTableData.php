<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT id, fullName, email, phone, password FROM users where type='client'";
$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute query."]);
    $conn->close();
    exit();
}

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "id" => (int) $row['id'],
            "name" => $row['fullName'],
            "email" => $row['email'],
            "phoneNumber" => $row['phone'],
            "password" => $row['password'],
        ];
    }
}

echo json_encode($users);

$conn->close();
?>
