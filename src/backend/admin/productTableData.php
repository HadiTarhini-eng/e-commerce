<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "
SELECT 
    p.id, 
    'Product' AS title, 
    p.image, 
    p.createdAt as date,
    p.productName as name, 
    c.categoryName, 
    p.price, 
    COALESCE(SUM(pd.stock), 0) AS stock, 
    p.discount, 
    p.description
FROM 
    products p
LEFT JOIN 
    productData pd ON p.id = pd.productID
LEFT JOIN 
    categories c ON c.id = p.categoryID
GROUP BY 
    p.id
";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $products = array();
    while ($row = $result->fetch_assoc()) {
        $price = (float)$row['price'];
        $discount = (float)$row['discount'];
        $discountedPrice = $price - ($price * $discount / 100); 
        $products[] = array(
            "id" => (int)$row['id'],
            "title" => $row['title'],
            "image" => $row['image'],
            "name" => $row['name'],
            "category" => $row['categoryName'],
            "price" => $price,
            "stock" => (int)$row['stock'],
            "discountAmount" => $discount,
            "discountedPrice"=>round($discountedPrice, 2),
            "specification" => $row['description'],
            "date" => $row['date']
        );
    }

    echo json_encode($products);
} else {
    echo json_encode([]);
}

$conn->close();
?>
