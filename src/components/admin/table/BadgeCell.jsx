import React from "react";

const BadgeCell = ({ value }) => {
  return (
    <span className={`badge ${value === "Discounted" ? "bg-red-500" : "bg-green-500"}`}>
      {value}
    </span>
  );
};

export default BadgeCell;