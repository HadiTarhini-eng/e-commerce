<?php
include 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$scentName = $data['name'];

$query = $conn->prepare("INSERT INTO scents (scentName) VALUES (?)");
$query->bind_param("s", $scentName); 

if ($query->execute()) {
    echo json_encode(["success" => "Scent added successfully."]);
} else {
    http_response_code(500); 
    echo json_encode(["error" => "Failed to add scent."]);
}

$query->close();
$conn->close();
?>
