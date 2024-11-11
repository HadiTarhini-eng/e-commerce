import React, { useState } from 'react';

const Description = ({ description }) => {

  return (
    <div className="mt-8">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">Description</h2>

      {/* Description Text */}
      <p className="mt-4 text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
};

export default Description;
