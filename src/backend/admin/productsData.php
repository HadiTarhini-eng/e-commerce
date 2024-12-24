<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT id, productName as name FROM products";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $products = array();

    while ($row = $result->fetch_assoc()) {
        $products[] = array(
            "id" => (int)$row['id'],
            "name" => $row['name']
        );
    }

    echo json_encode($products);
} else {
    echo json_encode(array("products" => []));
}

$conn->close();
?>
