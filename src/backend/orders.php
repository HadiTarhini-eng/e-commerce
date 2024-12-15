<?php
include 'connection.php';

header('Content-Type: application/json');

$query = $conn->prepare("
    SELECT o.id, o.totalPricewithdel, l.name AS status, o.Date
    FROM orders o
    LEFT JOIN lookup l ON l.id = o.statusID
    WHERE o.userID = ?
");
$query->bind_param("i", $userID);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $orders = array();

    while ($row = $result->fetch_assoc()) {
       $orderID= $row['id'];

       if (!isset($orders[$orderID])) {
        $orders[$orderID] = array(
             "orderID" => (int)$row['id'],
             "dateOrdered" => $row['Date'],
             "status" => $row['status'],
             "total" => "$".$row['totalPricewithdel'],
        );
    }
    }

    echo json_encode(array_values($orders));
} else {
    echo json_encode(array("orders" => []));
}

$conn->close();
?>
