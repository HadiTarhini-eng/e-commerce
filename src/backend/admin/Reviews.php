<?php
include 'connection.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$id=(int)$data['id'];

$query = "SELECT r.id as id , u.fullName as fullName, r.description as description ,r.date as date
          FROM reviews r 
          LEFT JOIN users u ON u.id = r.userID
          WHERE r.productID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            "id" => (int) $row['id'],
            "name" => $row['fullName'],
            "review" => $row['description'],
            "date"=> $row['date'],
        ];
    }
}

echo json_encode($reviews);

$stmt->close();
$conn->close();
?>
