<?php
include 'connection.php';

$imageDir = realpath('../../../public/images/products');
$uploadDir = realpath('../../../public/images/products');
$dominantColumn = "dominant";

$productName = $_POST['name'];
$price = $_POST['price'];
$discount = $_POST['discount'];
$categoryID = $_POST['category'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;
$scents = $_POST['scents'];
$date = date("d-m-Y");
$description = $_POST['specifications']; 
$productID = $_POST['productID'];
$currentScentID=$_POST['productID'];


$stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
$stmt->bind_param("i", $productID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {

    if (isset($image) && $image['error'] === UPLOAD_ERR_OK) {
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
    
        $stmt = $conn->prepare("UPDATE products SET image = ? WHERE id = ?");
        $stmt->bind_param("si", $imageName, $productID);
        if (!$stmt->execute()) {
            die("Error updating product image: " . $stmt->error);
        }
    } else {

        echo "No valid image uploaded. Skipping image update.<br>";
    }

  
    $stmt = $conn->prepare("UPDATE products SET productName = ?, price = ?, discount = ?, categoryID = ?, description = ? WHERE id = ?");
    $stmt->bind_param("sdiiss", $productName, $price, $discount, $categoryID, $description, $productID);
    if (!$stmt->execute()) {
        die("Error updating product: " . $stmt->error);
    }

    foreach ($scents as $scentIndex => $scent) {
        $scentID = $scent['scentID'];
        $stock = $scent['scentStock'];

        $stmt = $conn->prepare("SELECT id FROM productData WHERE productID = ? AND scentID = ?");
        $stmt->bind_param("ii", $productID, $currentScentID);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
  
            $productDataID=$row['id'];
            $stmt = $conn->prepare("UPDATE productData SET stock = ?, scentID = ? WHERE productID = ? AND scentID = ?");
            $stmt->bind_param("iiiii", $stock, $scentID, $productID, $currentScentID);
            if (!$stmt->execute()) {
                die("Error updating productData: " . $stmt->error);
            }
        } else {
 
            $stmt = $conn->prepare("INSERT INTO productData (productID, scentID, stock) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $productID, $scentID, $stock);
            if (!$stmt->execute()) {
                die("Error inserting product data: " . $stmt->error);
            }
            $productDataID = $stmt->insert_id;
        }

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

                    $scentFirstImage = isset($_FILES['scents']['name'][$scentIndex]['scentFirstImage']) ? $_FILES['scents']['name'][$scentIndex]['scentFirstImage']:$_POST['scents'][$scentIndex]['scentFirstImage'];
                    $scentImageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($imageName));
                    $scentTargetPath = $uploadDir . DIRECTORY_SEPARATOR . $scentImageName;
                    if (!move_uploaded_file($tmpName, $scentTargetPath)) {
                        die("Failed to move scent image to the target path.");
                    }

                    $dominant = ($scentImageName == preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage))) ? 1 : 0;

                    $stmt = $conn->prepare("SELECT id FROM scentImages WHERE productDataID = ? ");
                    $stmt->bind_param("i", $productDataID);
                    $stmt->execute();
                    $stmt->store_result();

                    if ($stmt->num_rows > 0) {

                        $stmt = $conn->prepare("UPDATE scentImages SET image = ?, $dominantColumn = ? WHERE productDataID = ?");
                        $stmt->bind_param("sii", $scentImageName, $dominant, $productDataID);
                        if (!$stmt->execute()) {
                            die("Error updating scent image: " . $stmt->error);
                        }
                    } else {

                        $stmt = $conn->prepare("INSERT INTO scentImages (productDataID, image, $dominantColumn) VALUES (?, ?, ?)");
                        $stmt->bind_param("isi", $productDataID, $scentImageName, $dominant);
                        if (!$stmt->execute()) {
                            die("Error inserting scent image: " . $stmt->error);
                        }
                    }
                }
            }
        } else {
            echo "No scent images found for scent ID: $scentID. Skipping image update.<br>";
        }
    }

    echo "Product and scent data updated successfully!";
} else {
    echo "Product with the provided ID does not exist.";
}

$conn->close();
?>
