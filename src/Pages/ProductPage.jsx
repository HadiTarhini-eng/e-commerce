import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/product/ProductInfo';
import AddToCart from '../components/product/AddToCart';
import Description from '../components/product/Description';
import ReviewContainer from '../components/product/ReviewContainer';
import SubmitReview from '../components/product/SubmitReview';
import { fetchProductById } from '../api/api';
import { calculateDiscount } from '../utils/discountUtils';  // Import the discount calculation utility

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center w-full mt-12">
      {/* Product Info */}
      <div className="w-full max-w-lg px-4 mt-4">
        <ProductInfo
          image={updatedProduct.image}
          title={updatedProduct.title}
          newPrice={updatedProduct.newPrice}  // Pass the modified price
          oldPrice={updatedProduct.oldPrice}  // Pass the modified price
          chipText={updatedProduct.chipText}  // Pass the modified chip text
          chipColor={updatedProduct.chipColor}  // Pass the modified chip color
        />
      </div>

      {/* Add To Cart */}
      <div className="w-full max-w-lg px-4 mt-4">
        <AddToCart product={updatedProduct} />
      </div>

      {/* Description */}
      <div className="w-full max-w-screen-lg px-4">
        <Description description={product.description} />
      </div>

      {/* Review Container */}
      <div className="w-full max-w-screen-lg px-4">
        <ReviewContainer reviews={product.reviews} />
      </div>

      {/* Submit Review */}
      <div className="w-full max-w-screen-lg px-4 mb-20">
        <SubmitReview productId={product.id} onSubmitReview={handleSubmitReview} />
      </div>
    </div>
  );
};

export default ProductPage;
