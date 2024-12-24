<?php
include 'connection.php';

header('Content-Type: application/json');

$query = "SELECT * FROM payments";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $payments = array();

    while ($row = $result->fetch_assoc()) {
       $paymentID= $row['id'];

       if (!isset($payments[$paymentID])) {
        $payments[$paymentID] = array(
             "id" => (int)$row['id'],
             "title" => $row['paymentName'],
             "image" => $row['image'],
        );
    }
    }

    echo json_encode(array_values($payments));
} else {
    echo json_encode(array("payments" => []));
}

$conn->close();
?>
