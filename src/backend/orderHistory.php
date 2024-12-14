<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT o.id as orderID,
                 oh.Date as Date,
                 l.name as Status
          FROM orders o
          LEFT JOIN orderhistory oh ON o.id = oh.orderID
          LEFT JOIN lookup l ON l.id=oh.statusID
          ORDER BY o.id, oh.Date DESC";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $orders = array();

    while ($row = $result->fetch_assoc()) {
        $orderID = $row['orderID'];

        if (!isset($orders[$orderID])) {
            $orders[$orderID] = array(
                "orderID" => (string)$row['orderID'],
                "steps" => array()
            );
        }

        $orders[$orderID]['steps'][] = array(
            "date" => $row['Date'], 
            "status" => $row['Status']
        );
    }

    // Return the structured orders
    echo json_encode(array_values($orders));
} else {
    // Return empty array if no orders are found
    echo json_encode(array());
}

$conn->close();
?>
