<?php
include 'connection.php';

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$orderId = (int)$data['id'];
$statusId = (int)$data['statusId'];
$date = date("d-m-Y");

$conn->begin_transaction();



    $updateOrderQuery = $conn->prepare("UPDATE orders SET statusID = ? WHERE id = ?");
    $updateOrderQuery->bind_param("ii", $statusId, $orderId);

    if (!$updateOrderQuery->execute()) {
        throw new Exception("Failed to update order status.");
    }
    

    $insertHistoryQuery = $conn->prepare("INSERT INTO orderhistory (orderID, statusID,date) VALUES (?, ?,?)");
    $insertHistoryQuery->bind_param("iis", $orderId, $statusId,$date);

    if (!$insertHistoryQuery->execute()) {
        throw new Exception("Failed to insert into orderHistory.");
    }
    $conn->commit();
    // Commit the transaction
    
    echo json_encode(["success" => "Order status updated and history recorded."]);


// Close the queries and connection
$updateOrderQuery->close();
$insertHistoryQuery->close();
$conn->close();
?>
