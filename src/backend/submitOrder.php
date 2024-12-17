<?php
include 'connection.php';

$input = file_get_contents('php://input');

$data = json_decode($input, true);

$checkoutData = $data['checkoutData'];
$cartData = $data['cart'];
$userID=$data['userId'];
$date = date("d-m-Y");
$status=1;
$sql = "INSERT INTO orders (userID,name, email, phone, address,city,
        paymentID ,deliveryID, gift, note,Date,statusID,totalPrice,DeliveryCost,totalPriceWithDel)
        VALUES (?,?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "isssssiisssiiii", 
    $userID,
    $checkoutData['name'], 
    $checkoutData['email'], 
    $checkoutData['phoneNumber'], 
    $checkoutData['address'], 
    $checkoutData['city'], 
    $checkoutData['paymentMethod']['id'], 
    $checkoutData['deliveryMethod']['id'], 
    $checkoutData['sendAsGift'], 
    $checkoutData['noteForDriver'],
    $date,
    $status,
    $checkoutData['totalWithoutDelivery'],
    $checkoutData['deliveryMethod']['deliveryPrice'],
    $checkoutData['totalWithDelivery'],

);
$stmt->execute();
$orderID = $conn->insert_id; 

    $sql_his = "INSERT INTO orderHistory(orderID, statusID, Date)
    VALUES (?, ?, ?)";
    $stmt_history = $conn->prepare($sql_his);
    $stmt_history->bind_param(
    "iis", 
    $orderID, 
    $status, 
    $date
    );
    $stmt_history->execute();

foreach ($cartData as $item) {
    
    $sql_item = "INSERT INTO orderData (orderID, productId, scentID,discount, price, quantity)
                 VALUES (?, ?, ?, ?, ?,?)";
    $stmt_item = $conn->prepare($sql_item);
    $stmt_item->bind_param(
        "iiiiii", 
        $orderID, 
        $item['productId'], 
        $item['scentId'], 
        $item['discountValue'], 
        $item['newPrice'], 
        $item['quantity'], 
    );
    $stmt_item->execute();
}

$stmt->close();
$stmt_item->close();
$stmt_history->close();

echo json_encode(["success" => true, "orderID" => $orderID]);
http_response_code(200); 

?>
