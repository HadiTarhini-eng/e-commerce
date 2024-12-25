<?php
include 'connection.php';

header('Content-Type: application/json');

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
        orderData.id AS orderDataId,
        orderData.orderID,
        orderData.productID,
        orderData.discount AS productDiscount,
        orderData.scentID,
        scents.ScentName,
        products.productName,
        COALESCE(scentImages.image, products.image) AS scentImage, 
        orderData.price,
        orderData.quantity
    FROM 
        orders
    LEFT JOIN 
        orderData 
    ON 
        orders.id = orderData.orderID
    LEFT JOIN 
        lookup AS deliveryLookup 
    ON 
        orders.deliveryID = deliveryLookup.id
    LEFT JOIN 
        lookup AS paymentLookup 
    ON 
        orders.paymentID = paymentLookup.id
    LEFT JOIN 
        productData AS pd
    ON 
        orderData.productID = pd.productID AND orderData.scentID = pd.scentID 
    LEFT JOIN 
        scentImages AS scentImages
    ON 
        pd.id = scentImages.productDataID AND scentImages.dominant = 1
    LEFT JOIN 
        scents 
    ON 
        orderData.scentID = scents.id
    LEFT JOIN 
        products 
    ON 
        orderData.productID = products.id;
";

$result = $conn->query($sql);

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