<?php
include 'connection.php';
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$productID = $data;  // Assuming the product ID is passed as a GET parameter

$stmt = $conn->prepare("
    SELECT p.id AS productID, p.productName, p.price, p.discount, p.categoryID, p.image AS productImage, p.createdAt, p.description, 
           s.id as scentID, s.scentName, pd.stock AS scentStock, si.image AS scentImage, si.dominant,si.id as scentImageID
    FROM products p
    JOIN productdata pd ON p.id = pd.productID
    JOIN scents s ON pd.scentID = s.id
    LEFT JOIN scentImages si ON pd.id = si.productDataID
    WHERE p.id = ?
    ORDER BY s.id, si.dominant DESC
");
$stmt->bind_param("i", $productID);
$stmt->execute();
$result = $stmt->get_result();

$product = null;
$scents = [];

while ($row = $result->fetch_assoc()) {
    if (!$product) {
        // Prepare the base product details
        $product = [
            'id' => $row['productID'],
            'name' => $row['productName'],
            'price' => (float)$row['price'],
            'discount' => (int)$row['discount'],
            'category' => $row['categoryID'],  // Assuming this is the category name
            'image' => $row['productImage'],
            'specifications' => $row['description'],
            'scents' => []
        ];
    }

    // Initialize scent data if it's a new scent
    if (!isset($scents[$row['scentID']])) {
        $scents[$row['scentID']] = [
            'scentID' => $row['scentID'],
            'scentName' => $row['scentName'],
            'scentStock' => (int)$row['scentStock'],
            'ScentImages' => [],  // Will hold all scent images
            'scentFirstImage' => []  // Will hold the dominant scent image
        ];
    }

    // Check if it's the dominant image for the scent
    if ($row['dominant'] == 1) {
        $scents[$row['scentID']]['scentFirstImage'][] = [
            'id' => $row['scentImageID'],
            'path' => $row['scentImage'],
        ];
    }

    // Add the scent image to the scent's images
    $scents[$row['scentID']]['ScentImages'][] = [
        'id' => $row['scentImageID'],
        'path' => $row['scentImage'],
    ];
}

// Add scents to product
$product['scents'] = array_values($scents);  // Reindex array to preserve keys

// Output the result as JSON
echo json_encode([$product]);

$stmt->close();
$conn->close();
?>
