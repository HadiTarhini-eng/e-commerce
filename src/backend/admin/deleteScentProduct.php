<?php
include 'connection.php';

header('Content-Type: application/json');


$data = json_decode(file_get_contents('php://input'), true);

$scentID= (int)$data['scentId'];
$productID= (int)$data['productId'];

$query = $conn->prepare("DELETE FROM productData WHERE scentID = ? and productID=?");
$query->bind_param("ii", $scentID,$productID);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "scent has been deleted."]);
    } else {
        echo json_encode(["error" => "No scent found with id $iscentIDd."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete scent."]);
}

$query->close();
$conn->close();
?>
