<?php
include 'connection.php';

header('Content-Type: application/json');

try {
    // Query to get the counts of orders for statusID 1, 2, 3, and 4
    $statusCountsQuery = "
        SELECT 
            statusID AS id, 
            COUNT(*) AS data
        FROM orders
        WHERE statusID IN (1, 2, 3, 4)
        GROUP BY statusID
        ORDER BY statusID
    ";

    $result = $conn->query($statusCountsQuery);

    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }

    $statusData = [];

    while ($row = $result->fetch_assoc()) {
        $statusData[] = [
            "id" => (int)$row['id'],
            "data" => (int)$row['data']
        ];
    }

    echo json_encode($statusData);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
