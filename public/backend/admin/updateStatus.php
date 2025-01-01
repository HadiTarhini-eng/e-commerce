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

    if ($statusId === 2) { // Status ID 2 triggers stock update
        $orderDataQuery = $conn->prepare("SELECT scentID, productID, quantity FROM orderdata WHERE orderID = ?");
        $orderDataQuery->bind_param("i", $orderId);
        $orderDataQuery->execute();
        $orderDataResult = $orderDataQuery->get_result();

        while ($row = $orderDataResult->fetch_assoc()) {
            $scentId = $row['scentID'] ? (int)$row['scentID'] : null;
            $productId = (int)$row['productID'];
            $quantity = (int)$row['quantity'];

            if ($scentId) {
                // Update stock in the `productdata` table for specific scent
                $updateStockQuery = $conn->prepare("UPDATE productdata SET stock = stock - ? WHERE scentID = ? AND productID = ?");
                $updateStockQuery->bind_param("iii", $quantity, $scentId, $productId);
            } else {
                // Update stock in the `products` table if no `scentID` exists
                $updateStockQuery = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
                $updateStockQuery->bind_param("ii", $quantity, $productId);
            }

            if (!$updateStockQuery->execute()) {
                throw new Exception("Failed to update stock.");
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
