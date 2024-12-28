<?php
include 'connection.php';
$input = file_get_contents("php://input");
$data = json_decode($input, true);
var_dump($data);
die;
$imageDir = realpath('../../../public/images/products');
$uploadDir = realpath('../../../public/images/products');
$dominantColumn = "dominant";

$productName = $_POST['name'];
$price = $_POST['price'];
$discount = $_POST['discount'];
$categoryID = $_POST['category'];
$image = $_FILES['image'];
$scents = $_POST['scents'];
$date = date("d-m-Y");
$description = $_POST['specifications']; 

if ($image && $image['error'] === UPLOAD_ERR_OK) {
    $tmpName = $image['tmp_name'];
    $imageType = exif_imagetype($tmpName);
    if ($imageType !== IMAGETYPE_PNG) {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG images are allowed for the product image."]);
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
        echo json_encode(["error" => "Failed to move the uploaded product image."]);
        exit();
    }
}

$stmt = $conn->prepare("INSERT INTO products (productName, price, discount, categoryID, image, createdAt, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdiisss", $productName, $price, $discount, $categoryID, $imageName, $date, $description);
if (!$stmt->execute()) {
    die("Error inserting product: " . $stmt->error);
}
$productID = $stmt->insert_id;

foreach ($scents as $scentIndex => $scent) {
    $scentID = $scent['scentID'];
    $stock = $scent['scentStock'];

    $stmt = $conn->prepare("INSERT INTO productData (productID, scentID, stock) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $productID, $scentID, $stock);
    if (!$stmt->execute()) {
        die("Error inserting product data: " . $stmt->error);
    }
    $productDataID = $stmt->insert_id;
         
    if (isset($_FILES['scents']['name'][$scentIndex]['ScentImages'])) {
        foreach ($_FILES['scents']['name'][$scentIndex]['ScentImages'] as $index => $imageName) {
            if ($_FILES['scents']['error'][$scentIndex]['ScentImages'][$index] === UPLOAD_ERR_OK) {

                var_dump( $scentFirstImage);
                $tmpName = $_FILES['scents']['tmp_name'][$scentIndex]['ScentImages'][$index];
                $imageType = exif_imagetype($tmpName);
                if ($imageType !== IMAGETYPE_PNG) {
                    die("Only PNG images are allowed for scent images.");
                }

                if (!is_writable($uploadDir)) {
                    die("Directory is not writable for scent images.");
                }
                $scentFirstImage=  $_FILES['scents']['name'][$scentIndex]['scentFirstImage'];
                $scentImageNamenew = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage));
                $scentImageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($imageName));
                $scentTargetPath = $uploadDir . DIRECTORY_SEPARATOR . $scentImageName;
                if (!move_uploaded_file($tmpName, $scentTargetPath)) {
                    die("Failed to move scent image to the target path.");
                }

                $dominant = ($scentImageName  == $scentImageNamenew) ? 1 : 0;

                $stmt = $conn->prepare("INSERT INTO scentImages (productDataID, image, $dominantColumn) VALUES (?, ?, ?)");
                $stmt->bind_param("isi", $productDataID, $scentImageName, $dominant);
                if (!$stmt->execute()) {
                    die("Error inserting scent image: " . $stmt->error);
                }
            }
        }
    } else {
        echo "No scent images found for scent ID: $scentID. Skipping image insertion.<br>";
    }
}

echo "Product and scent data inserted successfully!";
$conn->close();
?>
