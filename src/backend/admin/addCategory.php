<?php
include 'connection.php'; // Include your database connection file

header('Content-Type: application/json');

// Retrieve data from the form
$categoryName = $_POST['name'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;

$imageDir = realpath('../../../public/images/categories'); 

// Check if the images directory exists and is writable
if (!$imageDir || !is_writable($imageDir)) {
    echo json_encode(["error" => "Images directory is not writable or does not exist."]);
    exit();
}

$imageName = null;

// Process image if uploaded
if ($image && $image['error'] === UPLOAD_ERR_OK) {

    $tmpName = $image['tmp_name'];
    $imageType = exif_imagetype($tmpName);

    // Validate the image type
    if ($imageType !== IMAGETYPE_PNG) {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG images are allowed."]);
        exit();
    }

    // Sanitize the image name
    $imageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($image['name']));
    $targetPath = $imageDir . DIRECTORY_SEPARATOR . $imageName;

    // Skip upload if the file already exists
    if (!file_exists($targetPath)) {
        // Move the uploaded file
        if (!move_uploaded_file($tmpName, $targetPath)) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to move the uploaded image to the target path."]);
            exit();
        }
    }
}

// Insert category into the database
$queryStr = "INSERT INTO categories (categoryName, image) VALUES (?, ?)";
$query = $conn->prepare($queryStr);

// Use `NULL` for the image column if no image is uploaded
$query->bind_param("ss", $categoryName, $imageName);

if ($query->execute()) {
    echo json_encode(["success" => "Category added successfully.", "categoryId" => $query->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add category."]);
}

$query->close();
$conn->close();
?>
