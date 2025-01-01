<?php
include 'connection.php'; 

header('Content-Type: application/json');

$imageDir = realpath('../../../public/images/carousel');
if (!$imageDir || !is_writable($imageDir)) {
    echo json_encode(["error" => "Carousel image directory is not writable or does not exist."]);
    exit();
}

$deleteQuery = "DELETE FROM carousel";
if (!$conn->query($deleteQuery)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete existing carousel data."]);
    exit();
}

$carousels = $_POST['carousels']; 
if (!is_array($carousels)) {
    echo json_encode(["error" => "Carousel data is not in the correct format."]);
    exit();
}

$queryStr = "INSERT INTO carousel (id, header, paragraph, showHeader, showParagraph, showButton,
 buttonText, buttonColor, buttonPath, image,headerBgOpacity,headerBgPadding,headerBgBorderRadius,paragraphBgOpacity,paragraphBgPadding,paragraphBgBorderRadius) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)";
$query = $conn->prepare($queryStr);

if (!$query) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare the query."]);
    exit();
}

$currentId = 1;

foreach ($carousels as $index => $carousel) {
    $id = $currentId++;
    
    $header = $carousel['header'] ?? null;
    $paragraph = $carousel['paragraph'] ?? null;
    $showHeader = isset($carousel['showHeader']) && $carousel['showHeader'] == 'true' ? 1 : 0;
    $showParagraph = isset($carousel['showParagraph']) && $carousel['showParagraph'] == 'true' ? 1 : 0;
    $showButton = isset($carousel['showButton']) && $carousel['showButton'] == 'true' ? 1 : 0;
    $buttonText = $carousel['buttonText'] ?? null;
    $buttonColor = $carousel['buttonColor'] ?? null;
    $buttonPath = $carousel['buttonPath'] ?? null;

    $headerBgOpacity = $carousel['headerBgOpacity'] ?? 0;
    $headerBgPadding = $carousel['headerBgPadding'] ?? 0;
    $headerBgBorderRadius = $carousel['headerBgBorderRadius'] ?? 0;

    $paragraphBgPadding = $carousel['paragraphBgPadding'] ?? 0;
    $paragraphBgOpacity = $carousel['paragraphBgOpacity'] ?? 0;
    $paragraphBgBorderRadius = $carousel['paragraphBgBorderRadius'] ?? 0;


    $imageName = null;
    if (isset($_FILES['carousels']['name'][$index]['image'])) {
        $file = $_FILES['carousels']['name'][$index]['image'];
        $tmpName = $_FILES['carousels']['tmp_name'][$index]['image'];
        $imageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($file));
        $targetPath = $imageDir . DIRECTORY_SEPARATOR . $imageName;

        $fileExtension = pathinfo($file, PATHINFO_EXTENSION);
        if (strtolower($fileExtension) != 'jpg' && strtolower($fileExtension) != 'jpeg' && strtolower($fileExtension) != 'png') {
            echo json_encode(["error" => "Invalid image file type. Only JPG, JPEG, and PNG allowed."]);
            exit();
        }

        echo json_encode(["info" => "Uploading image: " . $imageName]);

        if (!file_exists($targetPath)) {
            if (!move_uploaded_file($tmpName, $targetPath)) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to upload image for carousel ID: $id."]);
                exit();
            }
        } else {
            echo json_encode(["info" => "Image already exists: " . $imageName]);
        }
    } else {
        $imageName = $carousel['image'] ?? null;
    }

    $query->bind_param(
        "issiiissssdiidii",
        $id,
        $header,
        $paragraph,
        $showHeader,
        $showParagraph,
        $showButton,
        $buttonText,
        $buttonColor,
        $buttonPath,
        $imageName,
        $headerBgOpacity,
        $headerBgPadding,
        $headerBgBorderRadius,
        $paragraphBgOpacity,
        $paragraphBgPadding,
        $paragraphBgBorderRadius
    );

    if (!$query->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to insert data for carousel ID: $id."]);
        exit();
    }
}


$query->close();
$conn->close();

echo json_encode(["success" => "Carousel data updated successfully."]);
?>
