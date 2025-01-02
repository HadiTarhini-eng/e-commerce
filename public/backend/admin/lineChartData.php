<?php
include 'connection.php';

header('Content-Type: application/json');

try {
    // Get the current year
    $currentYear = date("Y");

    // Query to get monthly data for the current year
    $monthlyDataQuery = "
        SELECT 
            MONTH(STR_TO_DATE(Date, '%d-%m-%Y')) AS month,
            COUNT(id) AS orderCount,
            SUM(totalPrice) AS totalProfit
        FROM orders
        WHERE YEAR(STR_TO_DATE(Date, '%d-%m-%Y')) = ?
        GROUP BY MONTH(STR_TO_DATE(Date, '%d-%m-%Y'))
        ORDER BY MONTH(STR_TO_DATE(Date, '%d-%m-%Y'))
    ";

    $stmt = $conn->prepare($monthlyDataQuery);
    $stmt->bind_param("i", $currentYear);
    $stmt->execute();
    $result = $stmt->get_result();

    // Initialize an array with default values (0 orders, 0 profit) for each month
    $monthlyData = [];
    $monthNames = [
        1 => "Jan", 2 => "Feb", 3 => "Mar", 4 => "Apr", 5 => "May", 
        6 => "Jun", 7 => "Jul", 8 => "Aug", 9 => "Sep", 10 => "Oct", 
        11 => "Nov", 12 => "Dec"
    ];

    // Loop through all months (1 to 12)
    for ($month = 1; $month <= 12; $month++) {
        // Set default values (0 orders, 0 profit) for each month
        $monthlyData[$month] = [
            "id" => $month,
            "month" => $monthNames[$month],
            "data" => [
                [
                    "name" => "orders",
                    "data" => 0
                ],
                [
                    "name" => "profit",
                    "data" => 0.0
                ]
            ]
        ];
    }

    // Populate the months with actual data from the query result
    while ($row = $result->fetch_assoc()) {
        $month = (int)$row['month'];
        $monthlyData[$month]['data'][0]['data'] = (int)$row['orderCount'];
        $monthlyData[$month]['data'][1]['data'] = (float)$row['totalProfit'];
    }

    echo json_encode(array_values($monthlyData));

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
