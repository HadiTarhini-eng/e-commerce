<?php
include 'connection.php';

header('Content-Type: application/json');

try {
    // Query to get the count of orders grouped by city
    $cityOrdersQuery = "
        SELECT 
            city, 
            COUNT(*) AS orderCount
        FROM orders
        GROUP BY city
        ORDER BY city
    ";

    $result = $conn->query($cityOrdersQuery);

    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }

    $cityData = [];
    $id = 1; // Unique ID for each city entry

    while ($row = $result->fetch_assoc()) {
        $cityData[] = [
            "id" => $id++,
            "category" => $row['city'],
            "data" => [
                [
                    "name" => "Orders",
                    "data" => (int)$row['orderCount']
                ]
            ]
        ];
    }

    echo json_encode($cityData);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
