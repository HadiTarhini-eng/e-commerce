<?php
include 'connection.php'; 

header('Content-Type: application/json');


$categoryName = $_POST['title'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;

$imageDir = realpath('/home/vol16_1/infinityfree.com/if0_38001296/htdocs/images/categories'); 


if (!$imageDir || !is_writable($imageDir)) {
    echo json_encode(["error" => "Images directory is not writable or does not exist."]);
    exit();
}

$imageName = null;


if ($image && $image['error'] === UPLOAD_ERR_OK) {

    $tmpName = $image['tmp_name'];
    $imageType = exif_imagetype($tmpName);

    if ($imageType !== IMAGETYPE_PNG) {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG images are allowed."]);
        exit();
    }

    $imageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($image['name']));
    $targetPath = $imageDir . DIRECTORY_SEPARATOR . $imageName;

    if (!file_exists($targetPath)) {

        if (!move_uploaded_file($tmpName, $targetPath)) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to move the uploaded image to the target path."]);
            exit();
        }
    }
}

$queryStr = "INSERT INTO categories (categoryName, image) VALUES (?, ?)";
$query = $conn->prepare($queryStr);

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
