<?php
include 'connection.php';

header('Content-Type: application/json');

// Get the scentId from the URL
$requestUri = $_SERVER['REQUEST_URI']; // Get the full request URI
$parts = explode('/', $requestUri); // Split the URI by slashes

// Extract scentId from the URL (the last part)
$scentId = (int)$parts[count($parts) - 1];

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Extract scentName from the input
$scentName = $data['name']='blue'; // Name of the scent

// Check if scentId and scentName are provided
if (empty($scentId) || empty($scentName)) {
    http_response_code(400);  // Bad request
    echo json_encode(["error" => "Missing scent ID or name."]);
    exit();
}

// Prepare SQL query to update the scent in the database
$query = $conn->prepare("UPDATE scents SET scentName = ? WHERE id = ?");
$query->bind_param("si", $scentName, $scentId); // "si" for string and integer

// Execute the query
if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "Scent updated successfully."]);
    } else {
        http_response_code(404);  // Not found
        echo json_encode(["error" => "No scent found with id $scentId."]);
    }
} else {
    http_response_code(500);  // Server error
    echo json_encode(["error" => "Failed to update scent."]);
}

$query->close();
$conn->close();
?>
