<?php
include 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$couponName = $data['name'];
$discount = (int)$data['value'];

$query = $conn->prepare("INSERT INTO coupons (couponName,discount) VALUES (?,?)");
$query->bind_param("si", $couponName,$discount); 

if ($query->execute()) {
    echo json_encode(["success" => "coupon added successfully."]);
} else {
    http_response_code(500); 
    echo json_encode(["error" => "Failed to add coupon."]);
}

$query->close();
$conn->close();
?>
