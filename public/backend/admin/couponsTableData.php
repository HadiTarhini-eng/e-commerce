<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "
    SELECT 
        coupons.id,
        coupons.couponName, 
        coupons.discount,
        COUNT(orders.couponID) AS couponUsageCount
    FROM 
        coupons
    LEFT JOIN 
        orders ON coupons.id = orders.couponID
    GROUP BY 
        coupons.id
";

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute query."]);
    $conn->close();
    exit();
}

$coupons = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $coupons[] = [
            "id" => $row['id'],
            "name" => $row['couponName'],
            "value" => $row['discount'],
            "used" => (int) $row['couponUsageCount']
        ];
    }
}

echo json_encode($coupons);

$conn->close();
?>
