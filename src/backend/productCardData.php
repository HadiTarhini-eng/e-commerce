<?php
include 'connection.php';

header('Content-Type: application/json');

$products = array();
$params = [];
$types = "";
$whereCondition = "";
$favCondition = "";

$userID = isset($_GET['userID']) ? (int)$_GET['userID'] : null;

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = (int)$_GET['id'];
    $whereCondition = "WHERE p.id = ?";
    $favCondition = "LEFT JOIN favorites f ON f.productID = p.id AND f.userID = ?";
    $params = [$userID, $id];
    $types = "ii";
} else {
    $favCondition = "LEFT JOIN favorites f ON f.productID = p.id AND f.userID = ?";
    $params = [$userID];
    $types = "i";
}

$query = $conn->prepare("
    SELECT p.id, p.productName, p.discount, p.price, p.description, p.categoryID, p.image, c.categoryName,
           pd.scentID AS scentID, pd.stock AS stock, s.scentName AS scentName, f.id AS isFavorited
           " . (isset($id) ? ", r.id AS reviewID, u.fullName AS username, r.description AS reviewComment, r.date AS reviewDate,
           si.image AS scentImage" : "") . "
    FROM products p
    LEFT JOIN ProductData pd ON pd.productID = p.id
    LEFT JOIN Scents s ON s.id = pd.scentID
    LEFT JOIN categories c ON p.categoryID = c.id
    " . $favCondition . "
    " . (isset($id) ? "
    LEFT JOIN reviews r ON p.id = r.productID
    LEFT JOIN users u ON u.id = r.userID
    LEFT JOIN scentImages si ON si.productDataID = pd.id" : "") . "
    $whereCondition
");

if (!empty($params)) {
    $query->bind_param($types, ...$params);
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
                "isFavorited" => !empty($row['isFavorited']) ? true : false,
                "scents" => [],
                "reviews" => [],
                "totalStock" => 0
            );
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

            if (isset($id) && $row['scentImage']) {
                if (!in_array($row['scentImage'], $products[$productID]['scents'][$row['scentID']]['ScentImages'])) {
                    $products[$productID]['scents'][$row['scentID']]['ScentImages'][] = $row['scentImage'];
                }
            }
        }

        if (isset($id) && $row['reviewID']) {
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
