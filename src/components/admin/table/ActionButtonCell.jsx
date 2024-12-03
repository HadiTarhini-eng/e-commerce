import React from "react";

const ActionButtonCell = ({ onClick }) => {
    return (
        <button className="btn btn-primary" onClick={onClick}>Delete</button>
    );
  };

export default ActionButtonCell;