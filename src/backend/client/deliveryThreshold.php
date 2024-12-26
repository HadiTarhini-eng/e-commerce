<?php
include 'connection.php';

header('Content-Type: application/json');

$sql = "SELECT  freeDelivery, deliveryThreshold FROM offers";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $carouselData = [];

    while ($row = $result->fetch_assoc()) {
        $carouselData[] = [
            "freeDelivery" => $row['freeDelivery'] == 1,
            "deliveryThreshold" => (float)$row['deliveryThreshold']
        ];
    }
    echo json_encode($carouselData, JSON_PRETTY_PRINT);
} else {

    echo json_encode([]);
}

$conn->close();
?>
