import React from "react";

const FilterColumn = ({ column }) => {
  return (
    <input
      type="text"
      placeholder={`Search ${column.id}`}
      onChange={(e) => column.setFilter(e.target.value)}   // FIX THIS
      style={{ width: "100%" }}
    />
  );
};

export default FilterColumn;