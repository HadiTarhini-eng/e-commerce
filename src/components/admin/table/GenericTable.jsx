import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImageCell from './ProductImageCell';
import BadgeCell from './BadgeCell';
import ActionButtonCell from './ActionButtonCell';
import toast from 'react-hot-toast';

const GenericTable = ({ columns, data, rowClickable, actionClick, editAction }) => {
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
  const renderCell = (cell, column, row) => {
    if (column.Cell === "ProductImageCell") {
      return <ProductImageCell value={cell.value} />;
    } else if (column.Cell === "BadgeCell") {
      return <BadgeCell value={cell.value} />;
    } else if (column.Cell === "ActionButtonCell") {
      return (
        <ActionButtonCell 
          value={`${editAction ? 'Edit' : 'More'}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking the action button
            if(actionClick) {
              actionClick(row);
            }
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

  // Handle row click logic based on rowClickable prop
  const handleRowClick = (row) => {
    if (rowClickable) {
      navigate(renderDestination(row));
    }
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
              onClick={() => handleRowClick(row)}
              className={`${rowClickable ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
            >
              {columns.map((column) => (
                <td key={column.id} className="border px-4 py-2">
                  {renderCell({ value: row[column.accessor] }, column, row)}
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
