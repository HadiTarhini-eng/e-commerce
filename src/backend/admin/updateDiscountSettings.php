<?php
include 'connection.php'; 

header('Content-Type: application/json');

$input = file_get_contents('php://input');

$data = json_decode($input, true);

        $firstOrderDiscount = (bool)$data['firstOrderDiscount'];  
        $freeDelivery = (bool)$data['freeDelivery'];             
        $deliveryThreshold = (int)$data['deliveryThreshold']; 
        $discountNumber = (int)$data['discountNumber'];          

        $query = $conn->prepare("UPDATE offers SET firstOrderDiscount = ?, freeDelivery = ?, deliveryThreshold = ?, discountNumber = ? WHERE id = 1");

        $query->bind_param("iiii", $firstOrderDiscount, $freeDelivery, $deliveryThreshold, $discountNumber);

        if ($query->execute()) {
            if ($query->affected_rows > 0) {
                echo json_encode(["success" => "Offer updated successfully."]);
            } else {
                echo json_encode(["error" => "No changes were made."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update offer."]);
        }

        $query->close();