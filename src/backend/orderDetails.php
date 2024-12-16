<?php
include 'connection.php';

header('Content-Type: application/json');

$id = $_GET['orderID'];
$query = $conn->prepare("
    SELECT o.id as orderID,
                 od.productID as productID,
                 o.totalPrice as total,
                 o.deliveryCost as shipping,
                 o.totalPriceWithDel as subtotal,
                 l.name as status,
                 p.productName as name,
                 s.scentName as scent,
                 od.quantity as quantity,
                 od.price as price,
                 COALESCE(si.image, p.image) AS image 
          FROM orders o
          LEFT JOIN lookup l ON l.id=o.statusID
          LEFT JOIN orderData od on od.orderID=o.id
          LEFT JOIN products p on p.id=od.productID
          LEFT JOIN scents s on s.id=od.scentID
          LEFT JOIN productData pd ON pd.productID = od.productID AND pd.scentID = od.scentID  
          LEFT JOIN scentImages si on si.ProductDataID=pd.id AND si.dominant = true
          where o.id=? 
          ORDER BY o.id ASC
");

$query->bind_param("i", $id);

$query->execute();

$result = $query->get_result();

if ($result->num_rows > 0) {
    $orderDetails = array();

    while ($row = $result->fetch_assoc()) {
        $orderID = $row['orderID'];

        if (!isset($orderDetails[$orderID])) {
            $orderDetails[$orderID] = array(
                "orderID" => (string)$row['orderID'],
                "total" => (int)$row['total'],
                "shipping" => (int)$row['shipping'],
                "subtotal" => (int)$row['subtotal'],
                "status" => (string)$row['status'],
                "products" => array()
            );
        }

        $orderDetails[$orderID]['products'][] = array(
            "productID" => $row['productID'], 
            "name" => $row['name'],
            "scent" => $row['scent'],
            "quantity" => $row['quantity'],
            "price" => $row['price'],
            "image" => $row['image'],

        );
    }

    // Return the structured orders
    echo json_encode(array_values($orderDetails));
} else {
    // Return empty array if no orders are found
    echo json_encode(array());
}

$conn->close();
?>
