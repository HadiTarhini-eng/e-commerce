import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCell from './ImageCell';
import BadgeCell from './BadgeCell';
import ActionButtonCell from './ActionButtonCell';
import toast from 'react-hot-toast';

const GenericTable = ({ columns, data, rowClickable, actionClick, deleteAction, showSelection, disableButton  }) => {
  const navigate = useNavigate();

  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState('');
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);

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
    if (column.Cell === "ImageCell") {
      return <ImageCell value={cell.value} />;
    } else if (column.Cell === "BadgeCell") {
      return <BadgeCell value={cell.value} />;
    } else if (column.Cell === "ActionButtonCell") {
      // If `disableButton` is true, don't render the button
      if (row.disableButton) {
        return null; // No button shown if status is "Canceled" or "Delivered"
      }
      return (
        <ActionButtonCell 
          value={`${deleteAction ? 'Delete' : 'Edit'}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking the action button
            if(actionClick) {
              actionClick(row);
            }
          }} 
        />
      );
    } else if (column.Cell === "stockCell" && cell.value === 0) {
      // Check if the column is 'stock' and value is 0, apply red color
      return <span style={{ color: 'red' }}>{cell.value}</span>;
    }

    // Handle case where there is no specific cell renderer
    return cell.value; // This will just render the value of the cell directly if no special renderer is specified
  };

  // Dynamically render destination based on the row title
  const renderDestination = (rowData) => {
    if (rowData.title === "Product") {
      return `/productAdmin/${rowData.id}`;
    } else if(rowData.title === "Order") {
      return `/orderSummary/${rowData.id}`
    }
    return `/default/${rowData.id}`;
  };

  // Handle row click logic based on rowClickable prop
  const handleRowClick = (row) => {
    if (rowClickable) {
      navigate(renderDestination(row));
    }
  };

  // Handle checkbox click for selecting/deselecting a row
  const handleCheckboxChange = (e, rowId) => {
    if (e.target.checked) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  // Handle select/deselect all rows
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allRowIds = filteredData.map(row => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
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
            {/* Conditionally render header checkbox based on showSelection prop */}
            {showSelection && (
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredData.length}
                  onChange={handleSelectAllChange}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2" style={{ width: column.width }}>
                <span className="flex items-center">
                  {column.Header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(row)}
              className={`${rowClickable ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
            >
              {/* Conditionally render row checkbox based on showSelection prop */}
              {showSelection && (
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => handleCheckboxChange(e, row.id)}
                  />
                </td>
              )}
              {columns.map((column, index) => (
                <td key={index} className="border px-4 py-2">
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
