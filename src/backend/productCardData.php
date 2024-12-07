<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "
    SELECT p.id, p.productName, p.discount, p.price, p.description, p.categoryID,p.image, c.categoryName,
           r.id AS reviewID, concat(u.firstName,' ',u.lastName) AS username, r.description AS reviewComment, r.date AS reviewDate
    FROM products p
    JOIN categories c ON p.categoryID = c.id
    LEFT JOIN reviews r ON p.id = r.productID
    LEFT JOIN users u ON u.id = r.userID

";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $products = array();

    $reviews = array();

    while ($row = $result->fetch_assoc()) {
        $productID = $row['id'];

        if (!isset($products[$productID])) {
            $products[$productID] = array(
                "id" => (int)$row['id'],
                "image" => $row['image'],
                "title" => $row['productName'],
                "discount" => $row['discount'],
                "oldPrice" => $row['price'],
                "destination" => "/product/" . $row['id'],
                "description" => $row['description'],
                "category" => $row['categoryName'],
                "reviews" => []
            );
        }

        if ($row['reviewID']) {
            $products[$productID]['reviews'][] = array(
                "id" => $row['reviewID'],
                "name" => $row['username'],
                "comment" => $row['reviewComment'],
                "date" => $row['reviewDate']
            );
        }
    }

    echo json_encode(array("products" => array_values($products)));
} else {
    echo json_encode(array("products" => []));
}

$conn->close();
?>
