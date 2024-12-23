// Utility function to calculate the new price and generate chip text
export const calculateDiscount = (product) => {
  const { discount, oldPrice, createdAt } = product;

  // Helper function to check if a date is within the last 7 days
  const isNewProduct = (dateString) => {
    const currentDate = new Date();
    const productDate = new Date(dateString.split("-").reverse().join("-")); // Convert to 'YYYY-MM-DD' format for Date parsing
    const differenceInDays = (currentDate - productDate) / (1000 * 60 * 60 * 24);
    return differenceInDays <= 7;
  };

  // Check if the product is new and discount is null
  if (discount === null && isNewProduct(createdAt)) {
    return {
      newPrice: oldPrice,  // No discount, so the new price is the old price
      oldPrice: null,      // No old price when there's no discount
      chipText: "New",     // Chip text for new products
      chipColor: "#14d414",  // Chip color for new products
      discountValue: "0"
    };
  }

  // Case when discount exists
  if (discount !== null && discount !== 0) {
    const discountAmount = (oldPrice * (discount / 100)).toFixed(1);  // Calculate discount amount
    const newPrice = (oldPrice - discountAmount).toFixed(1);  // Calculate new price after discount
    const chipText = `-${discount}%`;  // Text for chip
    const chipColor = "red";  // You can modify this logic to dynamically change based on discount range
    const discountValue = `${discount}`;

    return {
      newPrice,
      oldPrice,
      chipText,
      chipColor,
      discountValue
    };
  }

  // Default return if no conditions are met
  return {
    newPrice: oldPrice,
    oldPrice: null,
    chipText: "",
    chipColor: "",
    discountValue: "0"
  };
};
