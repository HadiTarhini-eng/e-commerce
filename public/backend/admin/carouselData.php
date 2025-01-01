<?php
include 'connection.php';

header('Content-Type: application/json');

$sql = "
    SELECT 
        id,
        image,
        header,
        paragraph,
        showHeader,
        showParagraph,
        showButton,
        buttonText,
        buttonColor,
        buttonPath,
        headerBgOpacity,
        headerBgPadding,
        headerBgBorderRadius,
        paragraphBgOpacity,
        paragraphBgPadding,
        paragraphBgBorderRadius
    FROM carousel;
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $carouselData = [];
    while ($row = $result->fetch_assoc()) {

        $row['showHeader'] = $row['showHeader'] == 1;
        $row['showParagraph'] = $row['showParagraph'] == 1;
        $row['showButton'] = $row['showButton'] == 1;

        $carouselData[] = $row;
    }
    echo json_encode($carouselData);
} else {
    echo json_encode([]); 
}

$conn->close();
?>
