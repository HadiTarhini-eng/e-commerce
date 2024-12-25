<?php
include 'connection.php';
$data = json_decode(file_get_contents('php://input'), true);

header('Content-Type: application/json');


$query = $conn->prepare("DELETE FROM products WHERE id = ?");
$query->bind_param("i", $data);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "product with id $data has been deleted."]);
    } else {
        echo json_encode(["error" => "No product found with id $data."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete product."]);
}

$query->close();
$conn->close();
?>
