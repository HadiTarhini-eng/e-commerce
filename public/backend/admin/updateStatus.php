<?php
include 'connection.php';

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$orderId = (int)$data['id'];
$statusId = (int)$data['statusId'];
$date = date("d-m-Y");

$conn->begin_transaction();

try {
    $updateOrderQuery = $conn->prepare("UPDATE orders SET statusID = ? WHERE id = ?");
    $updateOrderQuery->bind_param("ii", $statusId, $orderId);

    if (!$updateOrderQuery->execute()) {
        throw new Exception("Failed to update order status.");
    }

    $insertHistoryQuery = $conn->prepare("INSERT INTO orderhistory (orderID, statusID, date) VALUES (?, ?, ?)");
    $insertHistoryQuery->bind_param("iis", $orderId, $statusId, $date);

    if (!$insertHistoryQuery->execute()) {
        throw new Exception("Failed to insert into orderHistory.");
    }

    if ($statusId === 2) {
        $orderDataQuery = $conn->prepare("SELECT scentID, productID, quantity FROM orderdata WHERE orderID = ?");
        $orderDataQuery->bind_param("i", $orderId);
        $orderDataQuery->execute();
        $orderDataResult = $orderDataQuery->get_result();

        while ($row = $orderDataResult->fetch_assoc()) {
            $scentId = (int)$row['scentID'];
            $productId = (int)$row['productID'];
            $quantity = (int)$row['quantity'];

            $updateStockQuery = $conn->prepare("UPDATE productdata SET stock = stock - ? WHERE scentID = ? AND productID = ?");
            $updateStockQuery->bind_param("iii", $quantity, $scentId, $productId);

            if (!$updateStockQuery->execute()) {
                throw new Exception("Failed to update product stock.");
            }

            $updateStockQuery->close();
        }

        $orderDataQuery->close();
    }

    $conn->commit();
    echo json_encode(["success" => "Order status updated, history recorded, and product stock updated if applicable."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["error" => $e->getMessage()]);
}

$updateOrderQuery->close();
$insertHistoryQuery->close();
$conn->close();
?>
