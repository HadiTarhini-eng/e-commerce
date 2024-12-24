<?php
include 'connection.php';

header('Content-Type: application/json');


$data = json_decode(file_get_contents('php://input'), true);

$id = (int)$data['id'];

$query = $conn->prepare("DELETE FROM users WHERE id = ?");
$query->bind_param("i", $id);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "User with id $id has been deleted."]);
    } else {
        echo json_encode(["error" => "No user found with id $id."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete user."]);
}

$query->close();
$conn->close();
?>
