<?php
include 'connection.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);


$scentId = (int)$data['id'];
$scentName = $data['name'];

$query = $conn->prepare("UPDATE scents SET name = ? WHERE id = ?");
$query->bind_param("si", $scentName, $scentId);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "Scent updated successfully."]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No scent found with id $scentId."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update scent."]);
}

$query->close();
$conn->close();
?>
