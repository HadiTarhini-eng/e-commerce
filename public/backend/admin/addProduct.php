<?php
include 'connection.php';

$imageDir = realpath('../../../public/images/products');
$uploadDir = realpath('../../../public/images/products');

$productName = $_POST['name'];
$price = $_POST['price'];
$discount = $_POST['discount'];
$categoryID = $_POST['category'];
$image = $_FILES['image'];
$date = date("d-m-Y");
$description = $_POST['specifications']; 

$productStock = isset($_POST['stock']) ? (int)$_POST['stock'] : 0;

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

// Insert product data
$stmt = $conn->prepare("INSERT INTO products (productName, price, discount, categoryID, image, createdAt, description,stock) VALUES (?, ?, ?, ?, ?, ?, ?,?)");
$stmt->bind_param("sdiisssi", $productName, $price, $discount, $categoryID, $imageName, $date, $description,$productStock);
if (!$stmt->execute()) {
    die("Error inserting product: " . $stmt->error);
}
$productID = $stmt->insert_id;

// Handle scents
if (isset($_POST['scents']) && !empty($_POST['scents'])) {
    $scents = $_POST['scents'];

    foreach ($scents as $scentIndex => $scent) {
        $scentID = $scent['scentID'];
        $stock = $scent['scentStock'];

        $stmt = $conn->prepare("INSERT INTO productdata (productID, scentID, stock) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $productID, $scentID, $stock);
        if (!$stmt->execute()) {
            die("Error inserting product data: " . $stmt->error);
        }
        $productDataID = $stmt->insert_id;

        if (isset($_FILES['scents']['name'][$scentIndex]['ScentImages'])) {
            foreach ($_FILES['scents']['name'][$scentIndex]['ScentImages'] as $index => $imageName) {
                if ($_FILES['scents']['error'][$scentIndex]['ScentImages'][$index] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['scents']['tmp_name'][$scentIndex]['ScentImages'][$index];
                    $imageType = exif_imagetype($tmpName);
                    if ($imageType !== IMAGETYPE_PNG) {
                        die("Only PNG images are allowed for scent images.");
                    }

                    if (!is_writable($uploadDir)) {
                        die("Directory is not writable for scent images.");
                    }

                    $scentFirstImage = $_FILES['scents']['name'][$scentIndex]['scentFirstImage'];
                    $scentImageNamenew = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage));
                    $scentImageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($imageName));
                    $scentTargetPath = $uploadDir . DIRECTORY_SEPARATOR . $scentImageName;
                    if (!move_uploaded_file($tmpName, $scentTargetPath)) {
                        die("Failed to move scent image to the target path.");
                    }

                    $dominant = ($scentImageName == $scentImageNamenew) ? 1 : 0;

                    $stmt = $conn->prepare("INSERT INTO scentimages (productDataID, image, dominant) VALUES (?, ?, ?)");
                    $stmt->bind_param("isi", $productDataID, $scentImageName, $dominant);
                    if (!$stmt->execute()) {
                        die("Error inserting scent image: " . $stmt->error);
                    }
                }
            }
        }
    }
}

echo "Product and scent data inserted successfully!";
$conn->close();
?>
