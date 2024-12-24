import React from "react";

const ActionButtonCell = ({ onClick, value }) => {
  let buttonColor = 'blue'; // default
  // if(value === 'Delete') {
  //   buttonColor = 'indigo';
  // }

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-md text-white font-semibold transition-all shadow-sm 
                  bg-${buttonColor}-600 hover:bg-${buttonColor}-700 focus:outline-none`}
    >
      {value}
    </button>
  );
};

export default ActionButtonCell;
