import React from "react";

const ImageCell = ({ value, imageType }) => {
  return (
    <img src={`/images/${imageType}/${value}`} alt="Image" style={{ width: "50px", height: "50px" }} />
  );
};

export default ImageCell;