<?php
include 'connection.php';

header('Content-Type: application/json');

$id = $_GET['orderID'];

$query = $conn->prepare("
    SELECT o.id as orderID,
           oh.Date as Date,
           l.name as Status
    FROM orders o
    LEFT JOIN orderhistory oh ON o.id = oh.orderID
    LEFT JOIN lookup l ON l.id = oh.statusID
    WHERE o.id = ?
    ORDER BY oh.Date DESC
");

$query->bind_param("i", $id);

$query->execute();

$result = $query->get_result();

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

    echo json_encode(array_values($orders));
} else {
    echo json_encode(array());
}

$query->close();
$conn->close();
?>
