<?php
include 'connection.php'; 
header('Content-Type: application/json');


$input = file_get_contents('php://input');
$data = json_decode($input, true);


if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

try {

    $query = $conn->prepare("SELECT id, fullName, phone, type, password FROM users WHERE email = ?");
    $query->bind_param("s", $email);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashedPassword = trim($row['password']);

        if (password_verify($password, $hashedPassword)) {
            echo json_encode([
                "success" => true,
                "message" => "Sign-in successful",
                "user" => [
                    "id" => $row['id'],
                    "fullName" => $row['fullName'],
                    "phone" => $row['phone'],
                    "userType" => $row['type']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Email not found"]);
    }

    $query->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error. Please try again later."]);
    error_log("Error in sign-in: " . $e->getMessage());
}
?>
