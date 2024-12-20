<?php
include 'connection.php'; 

header('Content-Type: application/json');

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;

if ($userId === null) {
    echo json_encode(["error" => "Missing userId parameter"]);
    exit;
}

$query = $conn->prepare("SELECT COUNT(*) AS orderCount FROM orders WHERE userID = ?");
$query->bind_param("i", $userId);

$query->execute();
$result = $query->get_result();

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode((int)$row['orderCount']);
} else {
    echo json_encode(["error" => "Failed to retrieve order count"]);
}


$conn->close();
?>
