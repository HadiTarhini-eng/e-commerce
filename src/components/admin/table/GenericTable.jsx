import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCell from './ImageCell';
import BadgeCell from './BadgeCell';
import ActionButtonCell from './ActionButtonCell';

const GenericTable = ({
  columns,
  data,
  rowClickable,
  actionClickEdit,
  actionClickAdd,
  actionClickDiscount,
  actionDelete,
  editAction,
  deleteAction,
  showSelection,
  disableButton,
  showSearch,
  showAdd,
  showDiscount,
  addName,
  showReview,
  reviewAction,
  onSelectionChange, // Add the new onSelectionChange prop
  imageType,
}) => {
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
  const renderCell = (cell, column, row, imageType) => {
    
    if (column.Cell === "ImageCell") {
      return <ImageCell value={cell.value} type={imageType} />;
    } else if (column.Cell === "BadgeCell") {
      return <BadgeCell value={cell.value} />;
    } else if (column.Cell === "ActionButtonCell") {
      // If `disableButton` is true, don't render the buttons
      if (row.disableButton) {
        return null; // No button shown if status is "Canceled" or "Delivered"
      }
  
      return (
        <div className="flex space-x-2">
          {editAction && (
            <ActionButtonCell 
              value="Edit" 
              onClick={(e) => {
                e.stopPropagation();
                actionClickEdit && actionClickEdit(row, 'edit'); // Pass action type here
              }}
            />
          )}
          {deleteAction && (
            <ActionButtonCell 
              value="Delete" 
              onClick={(e) => {
                e.stopPropagation();
                actionDelete && actionDelete(row.id); // Call the delete action handler with row ID
              }}
            />          
          )}
          {showReview && (
            <ActionButtonCell 
              value="Review" 
              onClick={(e) => {
                e.stopPropagation();
                reviewAction && reviewAction(row.id);
              }}
            />          
          )}
        </div>
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
      return `/orderSummary/${rowData.id}`;
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
    let newSelectedRows;
    if (e.target.checked) {
      newSelectedRows = [...selectedRows, rowId];
    } else {
      newSelectedRows = selectedRows.filter(id => id !== rowId);
    }
    setSelectedRows(newSelectedRows);

    // Notify parent component about the selection change
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  // Handle select/deselect all rows
  const handleSelectAllChange = (e) => {
    let newSelectedRows;
    if (e.target.checked) {
      newSelectedRows = filteredData.map(row => row.id);
    } else {
      newSelectedRows = [];
    }
    setSelectedRows(newSelectedRows);

    // Notify parent component about the selection change
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className='flex flex-row gap-2'>
        {showSearch && (
        // Search Bar
        <div className="mb-4 w-full flex justify-end">
          <div className="w-[40%] min-w-[200px] px-2 flex items-center border rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search in table..."
              className="w-full p-3 py-2 outline-none"
            />
          </div>
        </div>
        )}
        {showAdd && (
          //show add
          <div className='flex flex-col gap-4'>
          <button
            onClick={() => actionClickAdd()} 
            className="min-w-[160px] bg-palette-button flex items-center justify-center gap-2 flex-row font-bold text-white px-3 py-2 rounded-xl hover:bg-palette-mimi-pink-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add {addName}
          </button>
        </div>
        )}
        {showDiscount && (
          //show add
          <div className='flex flex-col gap-4'>
          <button
            onClick={() => actionClickDiscount()} 
            className="min-w-[160px] bg-palette-button flex items-center justify-center gap-2 flex-row font-bold text-white px-3 py-2 rounded-xl hover:bg-palette-mimi-pink-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Discount
          </button>
        </div>
        )}
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
              <th key={index} className={`border bg-gray-200 px-8 py-2 w-${column.width}`}>
                <span className="flex items-center justify-center">
                  {column.Header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {filteredData.slice().reverse().map((row, index) => (
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
                <td key={index} className="text-center justify-items-center border px-4 py-2">
                  {renderCell({ value: row[column.accessor] }, column, row, imageType)}
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
