<?php
include 'connection.php';
 session_start();

$input = file_get_contents('php://input');

$data = json_decode($input, true);
$userID=$_SESSION['userID'];

if ($data === null) {
    echo json_encode(["error" => "Invalid JSON payload"]);
    http_response_code(400);
    exit;
}

$checkoutData = $data['checkoutData'];
$cartData = $data['cart'];

$sql = "INSERT INTO orders (userID,name, email, phone,city, address, 
        paymentID ,deliveryID, gift, note,Date,statusID,totalPrice,DeliveryCost,totalPriceWithDel)
        VALUES (?,?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "issssiisssiiii", 
    $userID,
    $checkoutData['name'], 
    $checkoutData['email'], 
    $checkoutData['phoneNumber'], 
    $checkoutData['city'], 
    $checkoutData['address'], 
    $checkoutData['paymentMethod'], 
    $checkoutData['deliveryMethod'], 
    $checkoutData['sendAsGift'], 
    $checkoutData['noteForDriver'],
    NOW(),
    1,
    $checkoutData['totalPrice'],
    $checkoutData['DeliveryCost'],
    $checkoutData['totalPriceWithDel'],

);
$stmt->execute();
$orderID = $conn->insert_id; 

    $sql_his = "INSERT INTO orderHistory(orderID, statusID, Date)
    VALUES (?, ?, ?)";
    $stmt_history = $conn->prepare($sql_his);
    $stmt_history->bind_param(
    "iis", 
    $orderID, 
    1, 
    Now()
    );
    $stmt_history->execute();

foreach ($cartData as $item) {
    $sql_item = "INSERT INTO orderData (orderID, productId, scentID, price, quantity)
                 VALUES (?, ?, ?, ?, ?)";
    $stmt_item = $conn->prepare($sql_item);
    $stmt_item->bind_param(
        "iiiii", 
        $orderID, 
        $item['productId'], 
        $item['scentID'], 
        $item['newPrice'], 
        $item['quantity'], 
    );
    $stmt_item->execute();
}

$stmt->close();
$stmt_item->close();
$stmt_history->close();

echo json_encode(["success" => true, "orderID" => $order_id]);
http_response_code(200); 

?>
