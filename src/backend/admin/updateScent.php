<?php
include 'connection.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$scentId = (int)$data['id'];
$scentName = $data['name'];

$query = $conn->prepare("UPDATE scents SET ScentName = ? WHERE id = ?");
$query->bind_param("si", $scentName, $scentId);

if ($query->execute()) {
        echo json_encode(["success" => "Scent updated successfully."]);
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "No scent found with id $scentId."]);
    }

$query->close();
$conn->close();
?>
