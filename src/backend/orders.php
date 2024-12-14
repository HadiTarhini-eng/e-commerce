<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT o.id,o.totalPricewithdel,l.name as status,o.Date
          FROM orders o
          left join lookup l on l.id=o.statusID ";

$result = $conn->query($query);

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
