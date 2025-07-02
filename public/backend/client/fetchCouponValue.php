<?php
include 'connection.php'; 

header('Content-Type: application/json');

$couponInput = isset($_GET['couponInput']) ? $_GET['couponInput'] : null;

if ($couponInput === null) {
    echo json_encode(["error" => "Missing couponInput parameter"]);
    exit;
}

$query = $conn->prepare("SELECT id, discount FROM coupons WHERE couponName = ?");
$query->bind_param("s", $couponInput);

$query->execute();
$result = $query->get_result();

if ($result && $row = $result->fetch_assoc()) {
    // Send both id and discount as JSON response
    echo json_encode([
        'id' => (int)$row['id'],
        'discount' => (int)$row['discount']
    ]);
} else {
    echo json_encode([]);
}

$conn->close();
?>
