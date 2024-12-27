import React from "react";

const ImageCell = ({ value }) => {
  return (
    <img src={`/images/categories/${value}`} alt="Image" style={{ width: "50px", height: "50px" }} />
  );
};

export default ImageCell;