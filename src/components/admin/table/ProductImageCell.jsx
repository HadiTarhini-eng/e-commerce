import React from "react";

const ProductImageCell = ({ value }) => {
  return (
    <img src={value} alt="Product" style={{ width: "50px", height: "50px" }} />
  );
};

export default ProductImageCell;