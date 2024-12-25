<?php
include 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$query = $conn->prepare("DELETE FROM categories WHERE id = ?");
$query->bind_param("i", $data);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "category with id $data has been deleted."]);
    } else {
        echo json_encode(["error" => "No category found with id $data."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete category."]);
}

$query->close();
$conn->close();
?>
