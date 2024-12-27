<?php
include 'connection.php';

header('Content-Type: application/json');

$productID = isset($_GET['productID']) ? $_GET['productID'] : null;

if (!$productID) {
    http_response_code(400);
    echo json_encode(["error" => "Product ID is required."]);
    $conn->close();
    exit();
}

$query = "SELECT r.id, u.fullName, r.description 
          FROM reviews r 
          LEFT JOIN users u ON u.id = r.userID
          WHERE productID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $productID);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    http_response_code(500); 
    echo json_encode(["error" => "Failed to execute query."]);
    $stmt->close();
    $conn->close();
    exit();
}

$reviews = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            "id" => (int) $row['id'],
            "name" => $row['fullName'],
            "review" => $row['description'],
        ];
    }
}

echo json_encode($reviews);

$stmt->close();
$conn->close();
?>
