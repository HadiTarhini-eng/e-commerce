<?php
include 'connection.php';

$imageDir = realpath('/home/vol16_1/infinityfree.com/if0_38001296/htdocs/images/products');
$uploadDir = realpath('/home/vol16_1/infinityfree.com/if0_38001296/htdocs/images/products');

$productName = $_POST['name'];
$price = $_POST['price'];
$discount = $_POST['discount'];
$categoryID = $_POST['category'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;
$scents = isset($_POST['scents']) ? $_POST['scents'] : [];
$date = date("d-m-Y");
$description = $_POST['specifications']; 
$productID = $_POST['productID'];
$removedImagesID = $_POST['removedImages'];
$productStock = isset($_POST['stock']) ? (int)$_POST['stock'] : 0;

// Check if the product exists
$stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
$stmt->bind_param("i", $productID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Update product image if provided
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
    }

    // Update product details
    $stmt = $conn->prepare("UPDATE products SET productName = ?, price = ?, discount = ?, categoryID = ?, description = ?, stock=? WHERE id = ?");
    $stmt->bind_param("sdiissi", $productName, $price, $discount, $categoryID, $description,$productStock, $productID);
    if (!$stmt->execute()) {
        die("Error updating product: " . $stmt->error);
    }

    // Remove deleted scent images
    if (!empty($removedImagesID)) {
        $removedImagesIDs = explode(',', $removedImagesID);
        $removedImagesIDs = array_map('intval', $removedImagesIDs); 
        $placeholders = implode(',', array_fill(0, count($removedImagesIDs), '?'));

        $sql = "DELETE FROM scentimages WHERE id IN ($placeholders)";
        $query = $conn->prepare($sql);
        if (!$query) {
            die("Prepare failed: " . $conn->error);
        }
        $query->bind_param(str_repeat('i', count($removedImagesIDs)), ...$removedImagesIDs);
        if (!$query->execute()) {
            die("Execute failed: " . $query->error);
        }
    }

    // Handle scents if provided
    if (!empty($scents)) {
        foreach ($scents as $scentIndex => $scent) {
            $currentScentID = isset($scent['currentScentId']) ? $scent['currentScentId'] : null;
            $scentID = $scent['scentID'];
            $stock = $scent['scentStock'];

            // Check if productdata entry exists for the current scent
            $stmt = $conn->prepare("SELECT id FROM productdata WHERE productID = ? AND scentID = ?");
            $stmt->bind_param("ii", $productID, $currentScentID);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($id);

            if ($stmt->fetch()) {
                $productDataID = $id;

                // Update existing entry
                $stmt = $conn->prepare("UPDATE productdata SET stock = ?, scentID = ? WHERE productID = ? AND scentID = ?");
                $stmt->bind_param("iiii", $stock, $scentID, $productID, $currentScentID);
                if (!$stmt->execute()) {
                    die("Error updating productData: " . $stmt->error);
                }
            } else {
                // Insert new entry
                $stmt = $conn->prepare("INSERT INTO productdata (productID, scentID, stock) VALUES (?, ?, ?)");
                $stmt->bind_param("iii", $productID, $scentID, $stock);
                if (!$stmt->execute()) {
                    die("Error inserting product data: " . $stmt->error);
                }
                $productDataID = $stmt->insert_id;
            }

            // Handle scent images
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
                        $scentFirstImage=  $_FILES['scents']['name'][$scentIndex]['scentFirstImage'];
                        $scentImageNamenew = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage));
                        $scentImageName = preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($imageName));
                        $scentTargetPath = $uploadDir . DIRECTORY_SEPARATOR . $scentImageName;
                        if (!move_uploaded_file($tmpName, $scentTargetPath)) {
                            die("Failed to move scent image to the target path.");
                        }
        
                        $dominant = ($scentImageName  == $scentImageNamenew) ? 1 : 0;
        
                        $stmt = $conn->prepare("INSERT INTO scentimages (productDataID, image, dominant) VALUES (?, ?, ?)");
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
    }

    echo "Product and scent data updated successfully!";
} else {
    echo "Product with the provided ID does not exist.";
}

$conn->close();
?>
