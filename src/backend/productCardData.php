<?php
include 'connection.php';

header('Content-Type: application/json');

$products = array();
$params = [];
$whereCondition = "";

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $whereCondition = "WHERE p.id = ?";
    $params[] = $id;
}

$query = $conn->prepare("
    SELECT p.id, p.productName, p.discount, p.price, p.description, p.categoryID, p.image, c.categoryName,
           r.id AS reviewID, u.fullName AS username, r.description AS reviewComment, r.date AS reviewDate,
           pd.scentID AS scentID, si.image AS scentImage, pd.stock AS stock, s.scentName AS scentName
    FROM products p
    LEFT JOIN ProductData pd ON pd.productID = p.id
    LEFT JOIN Scents s ON s.id = pd.scentID
    LEFT JOIN scentImages si ON si.productDataID = pd.id
    LEFT JOIN categories c ON p.categoryID = c.id
    LEFT JOIN reviews r ON p.id = r.productID
    LEFT JOIN users u ON u.id = r.userID
    $whereCondition
");

if (!empty($params)) {
    $query->bind_param("i", $params[0]);
}

$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
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
                "scents" => [],
                "reviews" => [],
                "totalStock" => 0
            );
        }

        if ($row['reviewID']) {
            $existingReviews = array_column($products[$productID]['reviews'], 'id');
            if (!in_array($row['reviewID'], $existingReviews)) {
                $products[$productID]['reviews'][] = array(
                    "id" => $row['reviewID'],
                    "name" => $row['username'],
                    "comment" => $row['reviewComment'],
                    "date" => $row['reviewDate']
                );
            }
        }

        if ($row['scentID']) {
            if (!isset($products[$productID]['scents'][$row['scentID']])) {
                $products[$productID]['scents'][$row['scentID']] = array(
                    "scentID" => $row['scentID'],
                    "scentName" => $row['scentName'],
                    "ScentImages" => [],
                    "scentStock" => (int)$row['stock']
                );

                $products[$productID]['totalStock'] += (int)$row['stock'];
            }

            if ($row['scentImage']) {
                $products[$productID]['scents'][$row['scentID']]['ScentImages'][] = $row['scentImage'];
            }
        }
    }

    foreach ($products as &$product) {
        $product['scents'] = array_values($product['scents']);
    }

    echo json_encode(array("products" => array_values($products)));
} else {
    echo json_encode(array("products" => []));
}

$conn->close();
?>
