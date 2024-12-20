import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductInfo from "../product/ProductInfo";
import AddToCart from "../product/AddToCart";
import { calculateDiscount } from "../../../utils/discountUtils";
import { useAuth } from "../AuthContext";
import { fetchProductById } from "../../../api/ClientApi";

const BottomDrawer = ({ isDrawerOpen, toggleDrawer, productId }) => {
  const { userId } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedScent, setSelectedScent] = useState(null);
  const [isScentSelected, setIsScentSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User not logged in');
        }
        const product = await fetchProductById(productId, userId);
        setSelectedProduct(product);
      } catch (err) {
        setError(err.message);
      }
    };

    if (productId && userId) {
      fetchData();
    }
  }, [productId, userId]);

  if (error) {
    return (
      <div className="error-message">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="loading-message hidden">
        <p>Loading product details...</p>
      </div>
    );
  }

  // update discount value 
  const { newPrice, oldPrice, chipText, chipColor, discountValue } = calculateDiscount(selectedProduct);
  const updatedProduct = {
    ...selectedProduct,
    newPrice,
    oldPrice,
    chipText,
    chipColor,
    discountValue
  };

  // Filter out scents that are out of stock
  const availableScents = selectedProduct.scents.filter(scent => scent.scentStock > 0);
  const hasScents = availableScents.length > 0;

  // Get the selected scent's data (images) if a scent is selected
  const selectedScentData = availableScents.find(scent => scent.scentID === selectedScent?.scentID);

  // If there's a selected scent, use its images
  const ImageSlides = selectedScentData
    ? selectedScentData.ScentImages.map(image => ({
        id: selectedScentData.scentID,
        image,
        name: selectedScentData.scentName,
      }))
    : hasScents
    ? availableScents.map(scent => ({
        id: scent.scentID,
        image: scent.ScentImages[0], // Use the first image of each scent
        name: scent.scentName,
      }))
    : [{ id: 0, image: updatedProduct.image }];

  return (
    <div>
      {/* Drawer */}
      {(isDrawerOpen && selectedProduct) && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 w-full h-[50%] overflow-y-auto transition-transform bg-palette-white transform-none"
        >
          {/* Header */}
          <div className="bg-palette-body-4 flex justify-center align-center w-full">
            <h5
              id="drawer-bottom-label"
              className="inline-flex items-center my-2 text-xl font-semibold text-gray-500 dark:text-gray-400"
            >
              Product Details
            </h5>
            <button
              type="button"
              onClick={toggleDrawer}
              className="absolute right-0 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="mt-2">
            <ProductInfo
              images={ImageSlides}
              dominant={updatedProduct.image}
              title={updatedProduct.title}
              newPrice={updatedProduct.newPrice}
              oldPrice={updatedProduct.oldPrice}
              chipText={updatedProduct.chipText}
              chipColor={updatedProduct.chipColor}
              setSelectedScent={setSelectedScent}
              hasScents={hasScents}
              productId={updatedProduct.id}
              scents={availableScents}
              favorite={updatedProduct.isFavorited}
              isInBottomDrawer={true}
              setIsScentSelected={setIsScentSelected}
            />
          </div>

          {/* Add To Cart */}
          <div className="w-full max-w-lg px-4 bg-palette-white">
            <AddToCart
               product={updatedProduct} 
               selectedScent={selectedScent} 
               hasScents={hasScents}
               isScentSelected={isScentSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomDrawer;
