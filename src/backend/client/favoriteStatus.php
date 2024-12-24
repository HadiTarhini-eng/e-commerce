<?php
include 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (isset($data['userId'], $data['productId'], $data['favoriteStatus'])) {
        $productId = $data['productId'];
        $userId = $data['userId'];
        $favoriteStatus = $data['favoriteStatus'];
           if ($favoriteStatus==true){
            $query = $conn->prepare("
            INSERT INTO favorites (productID, userID) 
            VALUES (?, ?)
        ");

        $query->bind_param("ii", $productId, $userId);

        if ($query->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "fav added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add fav",
                "error" => $query->error
            ]);
        }
           }else{
            $query = $conn->prepare("
            delete from  favorites where productID=?
        ");

        $query->bind_param("i", $productId);

        if ($query->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "fav deleted successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to delete fav",
                "error" => $query->error
            ]);
        }
           }
    

        $query->close();
    } 

$conn->close();
?>
