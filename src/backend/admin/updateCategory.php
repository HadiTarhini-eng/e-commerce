<?php
include 'connection.php'; 

header('Content-Type: application/json');

// Retrieve data from the form
$categoryId = (int)$_POST['id'];
$categoryName = $_POST['title'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;

$imageDir = realpath('../../../public/images/categories'); 

if (!$imageDir) {
    echo json_encode(["error" => "Failed to locate the images directory."]);
    exit();
}

$imageName = null;
$targetPath = null;

// Check if the category exists
$checkCategoryQuery = $conn->prepare("SELECT id FROM categories WHERE id = ?");
$checkCategoryQuery->bind_param("i", $categoryId);
$checkCategoryQuery->execute();
$checkCategoryQuery->store_result();

if ($checkCategoryQuery->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "No category found with id $categoryId."]);
    exit();
}

$checkCategoryQuery->close();

// Process image if uploaded
if ($image && $image['error'] === UPLOAD_ERR_OK) {

    $tmpName = $image['tmp_name'];
    $imageType = exif_imagetype($tmpName);

    if ($imageType !== IMAGETYPE_PNG) {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG images are allowed."]);
        exit();
    }

    if (!is_writable($imageDir)) {
        http_response_code(500);
        echo json_encode(["error" => "Directory is not writable."]);
        exit();
    }

    $imageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($image['name'])); 
    $targetPath = $imageDir . DIRECTORY_SEPARATOR . $imageName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to move the uploaded image to the target path."]);
        exit();
    }
}

$queryStr = "UPDATE categories SET categoryName = ?";
$params = [$categoryName];

if ($imageName) {
    $queryStr .= ", image = ?";
    $params[] = $imageName;
}

$queryStr .= " WHERE id = ?";
$params[] = $categoryId;

$query = $conn->prepare($queryStr);
$query->bind_param(str_repeat("s", count($params) - 1) . "i", ...$params);

if ($query->execute()) {
    if ($query->affected_rows > 0) {
        echo json_encode(["success" => "Category updated successfully."]);
    } else {
        echo json_encode(["success" => "Category updated, but no changes detected."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update category."]);
}

$query->close();
$conn->close();
?>
