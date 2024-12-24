<?php
include 'connection.php';

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$categoryId = (int)$data['id'];
$categoryName = $data['name'];
$image = $_FILES['image'];

$imageDir = '../../images/category/';
$imageName = basename($image['name']);

if ($image['error'] === UPLOAD_ERR_OK) {
    $tmpName = $image['tmp_name'];

    $imageType = exif_imagetype($tmpName);
    if ($imageType !== IMAGETYPE_PNG) {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG images are allowed."]);
        exit();
    }

    $targetPath = $imageDir . $imageName;
    if (file_exists($targetPath)) {
        $imageName = time() . '_' . $imageName;
        $targetPath = $imageDir . $imageName;
    }

    if (!move_uploaded_file($tmpName, $targetPath)) {
        http_response_code(500); 
        echo json_encode(["error" => "Failed to move the uploaded image."]);
        exit();
    }
} else {
    http_response_code(400); 
    echo json_encode(["error" => "Failed to upload image."]);
    exit();
}

$query = $conn->prepare("UPDATE categories SET categoryName = ?, image = ? WHERE id = ?");
$query->bind_param("ssi", $categoryName, $imageName, $categoryId);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "Category updated successfully."]);
    } else {
        http_response_code(404); 
        echo json_encode(["error" => "No category found with id $categoryId."]);
    }
} else {
    http_response_code(500); 
    echo json_encode(["error" => "Failed to update category."]);
}

$query->close();
$conn->close();
?>
