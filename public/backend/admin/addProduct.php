<?php
$date = date("d-m-Y");
$description = $_POST['specifications']; 
$productID = $_POST['productID'];
$currentScentID=$_POST['productID'];
$removedImagesID=$_POST['removedImages'];

$stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
$stmt->bind_param("i", $productID);
          if ($stmt->num_rows > 0) {
        die("Error updating product: " . $stmt->error);
    }

        $removedImagesIDs = explode(',', $removedImagesID);
        $removedImagesIDs = array_map('intval', $removedImagesIDs); 


        $placeholders = implode(',', array_fill(0, count($removedImagesIDs), '?'));

        $sql = "DELETE FROM scentimages WHERE id IN ($placeholders)";
        $query = $conn->prepare($sql);

        if (!$query) {
            die("Prepare failed: " . $conn->error);
        }

        $query->bind_param(str_repeat('i', count($removedImagesIDs)), ...$removedImagesIDs);

        if ($query->execute()) {
            echo "Deleted successfully!";
        } else {
            die("Execute failed: " . $query->error);
        }


    foreach ($scents as $scentIndex => $scent) {
        $currentScentID=$_POST['scents'][$scentIndex]['currentScentId'];
        $scentID = $scent['scentID'];
        $stock = $scent['scentStock'];

          if ($stmt->num_rows > 0) {
        $stmt->bind_param("ii", $productID, $currentScentID);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id);
        if ($stmt->fetch()) {
  
            $productDataID=$id;

            $stmt = $conn->prepare("UPDATE productData SET stock = ?, scentID = ? WHERE productID = ? AND scentID = ?");
            $stmt->bind_param("iiii", $stock, $scentID, $productID, $currentScentID);
            if (!$stmt->execute()) {
                die("Error updating productData: " . $stmt->error);
            }
              if ($stmt->num_rows > 0) {

                    $dominant = ($scentImageName == preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage))) ? 1 : 0;

                    if($dominant==1){
                        $stmt = $conn->prepare("update scentimages set dominant=0 where productDataID=?");
                        $stmt->bind_param("i", $productDataID);
                        if (!$stmt->execute()) {
                            die("Error inserting scent image: " . $stmt->error);
                        }
                    }

                   

                        $stmt = $conn->prepare("INSERT INTO scentimages (productDataID, image, $dominantColumn) VALUES (?, ?, ?)");
                        $stmt->bind_param("isi", $productDataID, $scentImageName, $dominant);
                        if (!$stmt->execute()) {
                            die("Error inserting scent image: " . $stmt->error);
                        }
                    
                }
            }
        }else {
            echo "No scent images found for scent ID: $scentID. Skipping image update.<br>";
            if (isset($_POST['scents'][$scentIndex]['ScentImages'])) {
                foreach ($_POST['scents'][$scentIndex]['ScentImages'] as $index => $imageName) {
                    $scentImageName = $_POST['scents'][$scentIndex]['ScentImages'][$index];
        
                    if (isset($_POST['scents'][$scentIndex]['scentFirstImage']) &&$_POST['scents'][$scentIndex]['scentFirstImage']!= 'undefined') {
                        $scentFirstImage = $_POST['scents'][$scentIndex]['scentFirstImage'];
        
                        var_dump($scentImageName);
                        var_dump($scentFirstImage);
        
                        // Sanitize and compare to determine dominance
                        $dominant = ($scentImageName == preg_replace("/[^a-zA-Z0-9\-_\.]/", "_", basename($scentFirstImage))) ? 1 : 0;
        
                        $stmt = $conn->prepare("UPDATE scentimages SET dominant = ? WHERE productDataID = ? AND image = ?");
                        $stmt->bind_param("iis", $dominant, $productDataID, $scentImageName);
        
                        $stmt->execute();
                    } else {
                        echo "scentFirstImage is undefined. Skipping dominance update for this image.<br>";
                    }
                }
            }
        }        
    }

    echo "Product and scent data updated successfully!";
