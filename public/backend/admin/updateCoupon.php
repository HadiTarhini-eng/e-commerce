<?php
include 'connection.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$couponId = (int)$data['id'];
$couponName = $data['name'];
$discount = (int)$data['value'];

$query = $conn->prepare("UPDATE coupons SET couponName = ? ,discount = ? WHERE id = ?");
$query->bind_param("sii", $couponName,$discount, $couponId);

if ($query->execute()) {
        echo json_encode(["success" => "coupon updated successfully."]);
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "No coupon found with id $couponId."]);
    }

$query->close();
$conn->close();
?>
