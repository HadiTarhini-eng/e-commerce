export const formatNumber = (value) => {
    // Format the number to 2 decimal places
    const formattedValue = value.toFixed(2);
  
    // If the value is an integer, remove the decimal places
    if (parseFloat(formattedValue) % 1 === 0) {
      return parseInt(formattedValue, 10);
    }
  
    return formattedValue;
  };
  