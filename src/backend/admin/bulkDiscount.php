<?php
include 'connection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$discount = (float)$input['discount']['discount'];
$productIds = $input['productIds'];


$placeholders = implode(',', array_fill(0, count($productIds), '?'));


$queryStr = "UPDATE products SET discount = ? WHERE id IN ($placeholders)";

$query = $conn->prepare($queryStr);

$params = array_merge([$discount], $productIds);
$paramTypes = str_repeat('i', count($productIds));
$query->bind_param("d$paramTypes", ...$params);

if ($query->execute()) {
    echo json_encode(["success" => "Discount updated successfully for specified products."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update discount for products."]);
}

$query->close();
$conn->close();
?>
