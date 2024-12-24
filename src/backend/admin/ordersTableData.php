<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "
SELECT 
    o.id, 
    'Order' AS title, 
    o.name, 
    o.email, 
    o.totalPrice, 
    o.discount, 
    o.deliveryCost,
    l.name as deliveryName,
    o.totalPriceWithDel, 
    l2.name as status
FROM 
    orders o
LEFT JOIN lookup l on l.id=o.deliveryID
LEFT JOIN lookup l2 on l2.id=o.statusID
";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $orders = array();

    while ($row = $result->fetch_assoc()) {
        $orders[] = array(
            "id" => (int)$row['id'],
            "title" => $row['title'],
            "name" => $row['name'],
            "email" => $row['email'],
            "price" => $row['totalPrice'],
            "discount" => $row['discount'],
            "delivery" => $row['deliveryName'],
            "deliveryCost"=>$row['deliveryCost'],
            "total" => $row['totalPriceWithDel'],
            "status" => $row['status']
        );
    }

    echo json_encode($orders);
} else {
    echo json_encode(array("orders" => []));
}

$conn->close();
?>
