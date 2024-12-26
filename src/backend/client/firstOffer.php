<?php
include 'connection.php';

header('Content-Type: application/json');

$sql = "SELECT firstOrderDiscount as isFirstOffer, discountNumber as firstOfferAmount FROM offers";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $carouselData = [];

    while ($row = $result->fetch_assoc()) {
        $carouselData[] = [
            "isFirstOffer" => $row['isFirstOffer'] == 1,
            "firstOfferAmount" => (float)$row['firstOfferAmount']
        ];
    }
    echo json_encode($carouselData, JSON_PRETTY_PRINT);
} else {

    echo json_encode([]);
}

$conn->close();
?>
