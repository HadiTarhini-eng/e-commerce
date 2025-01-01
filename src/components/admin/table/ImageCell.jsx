import React from "react";

const ImageCell = ({ value, type }) => {
  return (
    <img src={`/images/${type}/${value}`} alt="Image" style={{ width: "50px", height: "50px" }} />
  );
};

export default ImageCell;