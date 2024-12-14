// Utility function to calculate the new price and generate chip text
export const calculateDiscount = (product) => {
    const { discount, oldPrice } = product;
  
    // Case when there is no discount (discount is null)
    if (discount === null) {
      return {
        newPrice: oldPrice,  // No discount, so the new price is the old price
        oldPrice: null,      // No old price when there's no discount
        chipText: "",        // No chip text when there's no discount
        chipColor: "",       // No chip color when there's no discount
      };
    }
  
    // Case when discount exists
    const discountAmount = (oldPrice * (discount / 100)).toFixed(2);  // Calculate discount amount
    const newPrice = (oldPrice - discountAmount).toFixed(2);  // Calculate new price after discount
    const chipText = `-${discount}%`;  // Text for chip
    const chipColor = "red";  // You can modify this logic to dynamically change based on discount range
  
    return {
      newPrice,
      oldPrice,
      chipText,
      chipColor,
    };
  };
  