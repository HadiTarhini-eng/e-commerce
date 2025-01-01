<?php
include 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$productID = $data; // Assuming the product ID is passed as a JSON body

$stmt = $conn->prepare("
    SELECT 
        p.id AS productID, 
        p.productName, 
        p.price, 
        p.discount, 
        p.categoryID, 
        p.image AS productImage, 
        p.description, 
        p.stock,
        s.id AS scentID, 
        s.scentName, 
        pd.stock AS scentStock, 
        si.image AS scentImage, 
        si.dominant, 
        si.id AS scentImageID
    FROM products p
    LEFT JOIN productdata pd ON p.id = pd.productID
    LEFT JOIN scents s ON pd.scentID = s.id
    LEFT JOIN scentimages si ON pd.id = si.productDataID
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
            'category' => $row['categoryID'], // Assuming this is the category ID
            'image' => $row['productImage'],
            'specifications' => $row['description'],
            'stock' => (int)$row['stock'], // Add the main product stock
            'scents' => []
        ];
    }

    if (!empty($row['scentID'])) {
        // Initialize scent data if it's a new scent
        if (!isset($scents[$row['scentID']])) {
            $scents[$row['scentID']] = [
                'scentID' => $row['scentID'],
                'scentName' => $row['scentName'],
                'scentStock' => (int)$row['scentStock'],
                'ScentImages' => [],  // Will hold all scent images
                'scentFirstImage' => [] // Will hold the dominant scent image
            ];
        }

        // Check if it's the dominant image for the scent
        if ($row['dominant'] == 1 && !empty($row['scentImage'])) {
            $scents[$row['scentID']]['scentFirstImage'][] = [
                'id' => $row['scentImageID'],
                'path' => $row['scentImage'],
            ];
        }

        // Add the scent image to the scent's images
        if (!empty($row['scentImage'])) {
            $scents[$row['scentID']]['ScentImages'][] = [
                'id' => $row['scentImageID'],
                'path' => $row['scentImage'],
            ];
        }
    }
}

// Add scents to product
if ($product) {
    $product['scents'] = array_values($scents); // Reindex array to preserve keys
}

// Output the result as JSON
header('Content-Type: application/json');
echo json_encode($product ? [$product] : ['error' => 'Product not found']);

$stmt->close();
$conn->close();
?>
