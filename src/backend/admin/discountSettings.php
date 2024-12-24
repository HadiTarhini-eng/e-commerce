<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT firstOrderDiscount, freeDelivery, deliveryThreshold, discountNumber FROM offers LIMIT 1";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $offer = $result->fetch_assoc();

    $offer['firstOrderDiscount'] = (bool)$offer['firstOrderDiscount'];
    $offer['freeDelivery'] = (bool)$offer['freeDelivery'];

    echo json_encode($offer);
} else {
    echo json_encode(array("error" => "No offers found"));
}

$conn->close();
?>
