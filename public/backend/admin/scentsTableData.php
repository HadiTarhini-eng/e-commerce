<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT id, scentName as name FROM scents";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $scents = array();

    while ($row = $result->fetch_assoc()) {
        $scents[] = array(
            "id" => (int)$row['id'],
            "name" => $row['name']
        );
    }

    echo json_encode($scents);
} else {
    echo json_encode([]);
}

$conn->close();
?>
