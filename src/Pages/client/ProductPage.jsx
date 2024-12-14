import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../../components/client/product/ProductInfo';
import AddToCart from '../../components/client/product/AddToCart';
import Description from '../../components/client/product/Description';
import ReviewContainer from '../../components/client/product/ReviewContainer';
import { fetchProductById } from '../../api/ClientApi';
import { calculateDiscount } from '../../utils/discountUtils';  // Import the discount calculation utility

// Sample product data
const scentsData = [
  { id: "product1", scentName: "Mint", scentImage: "/product1.png" },
  { id: "product2", scentName: "Lavender", scentImage: "/product2.png" },
  { id: "product3", scentName: "Rose", scentImage: "/product3.png" }
];

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedScent, setSelectedScent] = useState(null);
  console.log(selectedScent);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an inner async function and call it immediately
    const fetchData = async () => {
      try {
        const selectedProduct = await fetchProductById(id);
        setProduct(selectedProduct); // Set the selected product in state
      } catch (err) {
        setError(err.message); // Set error message if there is an issue
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = (newReview) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [...prevProduct.reviews, newReview],
    }));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Get the discount details using the utility function
  const { newPrice, oldPrice, chipText, chipColor } = calculateDiscount(product);

  // Update the product object with the modified data
  const updatedProduct = {
    ...product,
    newPrice,        // Add the new price after discount calculation
    oldPrice,        // Keep the original price if discount exists
    chipText,        // Add chip text (e.g., "% Sale")
    chipColor,       // Add chip color (e.g., "green")
  };

  // Determine if there are scents
  const hasScents = scentsData && scentsData.length > 0;

  const slides = hasScents
    ? scentsData.map((scent) => ({
        id: scent.id,
        image: scent.scentImage,
        name: scent.scentName
      }))
    : [{ id: 0, image: updatedProduct.image }];

  return (
    <div className="min-h-screen bg-palette-body-3 flex flex-col items-center w-full mt-10">
      {/* Product Info */}
      <div className="w-full max-w-lg">
        <ProductInfo
          images={slides}
          title={updatedProduct.title}
          newPrice={updatedProduct.newPrice}  // Pass the modified price
          oldPrice={updatedProduct.oldPrice}  // Pass the modified price
          chipText={updatedProduct.chipText}  // Pass the modified chip text
          chipColor={updatedProduct.chipColor}  // Pass the modified chip color
          setSelectedScent={setSelectedScent} 
          hasScents={hasScents}
        />
      </div>

      {/* Add To Cart */}
      <div className="w-full max-w-lg px-4 mt-4 bg-palette-white p-2">
        <AddToCart product={updatedProduct} selectedScent={selectedScent} hasScents={hasScents} />
      </div>

      {/* Description */}
      <div className="w-full max-w-screen-lg">
        <Description description={product.description} />
      </div>

      {/* Review Container */}
      <div className="w-full max-w-screen-lg mb-20">
        <ReviewContainer reviews={product.reviews} productId={product.id} onSubmitReview={handleSubmitReview} />
      </div>
    </div>
  );
};

export default ProductPage;
