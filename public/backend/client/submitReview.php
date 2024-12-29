<?php
include 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (isset($data['productId'], $data['comment'], $data['date'], $data['userId'])) {
        $productId = $data['productId'];
        $comment = $data['comment'];
        $date = $data['date'];
        $userId = $data['userId'];

        $query = $conn->prepare("
            INSERT INTO reviews (productID, userID, description, date) 
            VALUES (?, ?, ?, ?)
        ");

        $query->bind_param("iiss", $productId, $userId, $comment, $date);

        if ($query->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Review added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add review",
                "error" => $query->error
            ]);
        }

        $query->close();
    } else {

        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: productId, comment, date, userId"
        ]);
    }
} else {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request method. Use POST."
    ]);
}

$conn->close();
?>
