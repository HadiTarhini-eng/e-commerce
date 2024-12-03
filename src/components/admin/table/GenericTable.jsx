import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImageCell from './ProductImageCell';
import BadgeCell from './BadgeCell';
import ActionButtonCell from './ActionButtonCell';
import toast from 'react-hot-toast';

const GenericTable = ({ columns, data }) => {
  const navigate = useNavigate();
  
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter rows based on the search query
  const filteredData = data.filter((row) => {
    return columns.some((column) => {
      const cellValue = row[column.accessor]?.toString().toLowerCase() || ''; // Make sure it's a string for comparison
      return cellValue.includes(searchQuery.toLowerCase()); // Check if search term matches any column value
    });
  });

  // Dynamically render cells based on the column configuration
  const renderCell = (cell, column) => {
    if (column.Cell === "ProductImageCell") {
      return <ProductImageCell value={cell.value} />;
    } else if (column.Cell === "BadgeCell") {
      return <BadgeCell value={cell.value} />;
    } else if (column.Cell === "ActionButtonCell") {
      return (
        <ActionButtonCell 
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking the action button
            toast.error("Row has been deleted!"); // Perform action
          }} 
        />
      );
    }
    // Handle case where there is no specific cell renderer
    return cell.value; // This will just render the value of the cell directly if no special renderer is specified
  };

  // Dynamically render destination based on the row title
  const renderDestination = (rowData) => {
    if (rowData.title === "Product") {
      return `/productAdmin/${rowData.id}`;
    }
    return `/default/${rowData.id}`;
  };

  return (
    <div className="overflow-x-auto">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search in table..."
          className="w-full p-3 border rounded-md"
        />
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className="px-4 py-2" style={{ width: column.width }}>
                <span className="flex items-center">
                  {column.Header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {filteredData.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(renderDestination(row))}
              className="cursor-pointer hover:bg-gray-100"
            >
              {columns.map((column) => (
                <td key={column.id} className="border px-4 py-2">
                  {renderCell({ value: row[column.accessor] }, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
