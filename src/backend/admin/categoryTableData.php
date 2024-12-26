<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT id, categoryName AS name, image FROM categories";
$result = $conn->query($query);

if (!$result) {
    http_response_code(500); 
    echo json_encode(["error" => "Failed to execute query."]);
    $conn->close();
    exit();
}

$categories = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            "id" => (int) $row['id'],
            "title" => $row['name'],
            "image" => $row['image'],
        ];
    }
}

echo json_encode($categories);

$conn->close();
?>
