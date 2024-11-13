import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/product/ProductInfo';
import AddToCart from '../components/product/AddToCart';
import Description from '../components/product/Description';
import ReviewContainer from '../components/product/ReviewContainer';
import SubmitReview from '../components/product/SubmitReview';

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the product data from products.json
    fetch('/data/productCardData.json')
      .then((response) => response.json())
      .then((data) => {
        // Find the product with the matching ID
        const selectedProduct = data.products.find((product) => product.id === parseInt(id));
        setProduct(selectedProduct);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleSubmitReview = (newReview) => {
    
    // Update the reviews array for the product in the state or make an API call to save the review
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [...prevProduct.reviews, newReview],
    }));
  };

  if (!product) {
    return <div>Loading...</div>; // If product is not found yet
  }

  return (
    <div className="min-h-screen bg-light-cream flex flex-col items-center w-full mt-12">
      {/* Product Info */}
      <div className="w-full max-w-lg px-4 mt-4">
        <ProductInfo
          image={product.image}
          title={product.title}
          newPrice={product.newPrice}
          oldPrice={product.oldPrice}
          chipText={product.chipText}
          chipColor={product.chipColor}
        />
      </div>

      {/* Add To Cart */}
      <div className="w-full max-w-lg px-4 mt-4">
        <AddToCart />
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
