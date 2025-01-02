<?php
include 'connection.php';

header('Content-Type: application/json');

try {
    // Most Favorited Product
    $mostFavQuery = "
        SELECT p.productName, COUNT(f.productID) AS favCount
        FROM favorites f
        JOIN products p ON f.productID = p.id
        GROUP BY f.productID
        ORDER BY favCount DESC
        LIMIT 1
    ";
    $mostFavResult = $conn->query($mostFavQuery);
    $mostFav = $mostFavResult->fetch_assoc();
    $mostFavoredProduct = [
        "title" => "Most Favorited Product",
        "total" => $mostFav ? $mostFav['productName'] . " (" . $mostFav['favCount'] . ")" : "No favorites yet"
    ];

    // Total Profit
    $totalProfitQuery = "SELECT SUM(totalPrice) AS totalProfit FROM orders";
    $totalProfitResult = $conn->query($totalProfitQuery);
    $totalProfit = $totalProfitResult->fetch_assoc()['totalProfit'] ?? 0;

    $totalProfitData = [
        "title" => "Total Profit",
        "total" => "$" . number_format($totalProfit / 1000, 1) . "K"
    ];

    // Total Products
    $totalProductsQuery = "SELECT COUNT(*) AS totalProducts FROM products";
    $totalProductsResult = $conn->query($totalProductsQuery);
    $totalProducts = $totalProductsResult->fetch_assoc()['totalProducts'] ?? 0;

    $totalProductsData = [
        "title" => "Total Product",
        "total" => $totalProducts
    ];

    // Total Users
    $totalUsersQuery = "SELECT COUNT(*) AS totalUsers FROM users";
    $totalUsersResult = $conn->query($totalUsersQuery);
    $totalUsers = $totalUsersResult->fetch_assoc()['totalUsers'] ?? 0;

    $totalUsersData = [
        "title" => "Total Users",
        "total" => $totalUsers
    ];

    // Combine all data
    $dashboardData = [
        $mostFavoredProduct,
        $totalProfitData,
        $totalProductsData,
        $totalUsersData
    ];

    echo json_encode($dashboardData);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
