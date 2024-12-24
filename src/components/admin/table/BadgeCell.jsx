import React, { useEffect, useState } from "react";
import { fetchStatusData } from "../../../api/adminApi";

const BadgeCell = ({ value }) => {
  const [badgeColor, setBadgeColor] = useState('');

  // Function to fetch status data and get the color based on the status
  const getStatusColor = async (status) => {
    try {
      const data = await fetchStatusData(); // Call the fetchStatusData function
      // Find the status object based on the status value
      const statusObj = data.find(item => item.status === status);
      return statusObj ? statusObj.color : "#6B7280"; // Default to gray if no match found
    } catch (error) {
      console.error("Error fetching status data:", error);
      return "#6B7280"; // Default to gray in case of an error
    }
  };

  // Set the color when the component mounts or when the value changes
  useEffect(() => {
    const fetchColor = async () => {
      const color = await getStatusColor(value);
      setBadgeColor(color);
    };

    fetchColor();
  }, [value]); // Re-fetch if the value changes

  return (
    <div
      className={`rounded-xl text-center py-0.5 px-2.5 font-bold border border-transparent text-sm text-white transition-all shadow-sm`}
      style={{ backgroundColor: badgeColor }}
    >
      {value}
    </div>
  );
};

export default BadgeCell;
