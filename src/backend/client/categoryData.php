<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT * FROM categories";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $categories = array();

    while ($row = $result->fetch_assoc()) {
       $categoryID= $row['id'];

       if (!isset($categories[$categoryID])) {
        $categories[$categoryID] = array(
             "id" => (int)$row['id'],
             "title" => $row['categoryName'],
             "image" => $row['image'],
        );
    }
    }

    echo json_encode(array_values($categories));
} else {
    echo json_encode([]);
}

$conn->close();
?>
