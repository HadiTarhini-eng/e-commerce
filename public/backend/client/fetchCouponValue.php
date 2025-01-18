<?php
include 'connection.php'; 

header('Content-Type: application/json');

$couponInput = isset($_GET['couponInput']) ? (int)$_GET['couponInput'] : null;

if ($couponInput === null) {
    echo json_encode(["error" => "Missing couponInput parameter"]);
    exit;
}

$query = $conn->prepare("SELECT discount  FROM coupons WHERE couponName = ?");
$query->bind_param("s", $couponInput);

$query->execute();
$result = $query->get_result();

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode((int)$row['discount']);
} else {
    echo json_encode([]);
}


$conn->close();
?>
