<?php
include 'connection.php';

header('Content-Type: application/json');
$orderID = json_decode(file_get_contents('php://input'), true);

$sql = "
    SELECT 
        orders.id AS orderId,
        orders.UserID,
        orders.totalPrice,
        orders.name,
        orders.phone,
        orders.deliveryID,
        deliveryLookup.name AS deliveryName,
        orders.paymentID,
        paymentLookup.name AS paymentName,
        orders.statusID,
        orders.Date,
        orders.deliveryCost,
        orders.totalPriceWithDel,
        orders.city,
        orders.address,
        orders.gift,
        orders.note,
        orders.email,
        orders.discount AS orderDiscount,
        orderdata.id AS orderDataId,
        orderdata.orderID,
        orderdata.productID,
        orderdata.discount AS productDiscount,
        orderdata.scentID,
        scents.ScentName,
        products.productName,
        COALESCE(scentimages.image, products.image) AS scentImage, 
        orderdata.price,
        orderdata.quantity
    FROM 
        orders
    LEFT JOIN 
        orderdata 
    ON 
        orders.id = orderdata.orderID
    LEFT JOIN 
        lookup AS deliveryLookup 
    ON 
        orders.deliveryID = deliveryLookup.id
    LEFT JOIN 
        lookup AS paymentLookup 
    ON 
        orders.paymentID = paymentLookup.id
    LEFT JOIN 
        productdata AS pd
    ON 
        orderdata.productID = pd.productID AND orderdata.scentID = pd.scentID 
    LEFT JOIN 
        scentimages AS scentimages
    ON 
        pd.id = scentimages.productDataID AND scentimages.dominant = 1
    LEFT JOIN 
        scents 
    ON 
        orderdata.scentID = scents.id
    LEFT JOIN 
        products 
    ON 
        orderdata.productID = products.id
    where orders.id = ?;
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $orderID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = [];
    
    while ($row = $result->fetch_assoc()) {
        $orderId = $row['orderId'];

        if (!isset($data[$orderId])) {
            $data[$orderId] = [
                "orderId" => $row['orderId'],
                "UserID" => $row['UserID'],
                "totalPrice" => $row['totalPrice'],
                "name" => $row['name'],
                "phone" => $row['phone'],
                "deliveryID" => $row['deliveryID'],
                "deliveryName" => $row['deliveryName'],
                "paymentID" => $row['paymentID'],
                "paymentName" => $row['paymentName'],
                "statusID" => $row['statusID'],
                "Date" => $row['Date'],
                "deliveryCost" => $row['deliveryCost'],
                "totalPriceWithDel" => $row['totalPriceWithDel'],
                "city" => $row['city'],
                "address" => $row['address'],
                "gift" => $row['gift'],
                "note" => $row['note'],
                "email" => $row['email'],
                "orderDiscount" => $row['orderDiscount'],
                "orderData" => []
            ];
        }

        if ($row['orderDataId'] !== null) {
            $data[$orderId]['orderData'][] = [
                "orderDataId" => $row['orderDataId'],
                "orderID" => $row['orderID'],
                "productID" => $row['productID'],
                "productDiscount" => $row['productDiscount'],
                "scentID" => $row['scentID'],
                "scentName" => $row['ScentName'],
                "productName" => $row['productName'],
                "scentImage" => $row['scentImage'],
                "price" => $row['price'],
                "quantity" => $row['quantity']
            ];
        }
    }

    echo json_encode(array_values($data));
} else {
    echo json_encode([]); 
}

$conn->close();
?>
