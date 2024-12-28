import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../../components/client/product/ProductInfo';
import AddToCart from '../../components/client/product/AddToCart';
import Description from '../../components/client/product/Description';
import ReviewContainer from '../../components/client/product/ReviewContainer';
import { calculateDiscount } from '../../utils/discountUtils';
import { fetchProductById } from '../../api/ClientApi';
import { useAuth } from '../../components/client/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedScent, setSelectedScent] = useState(null);
  const [error, setError] = useState(null);
  const [isScentSelected, setIsScentSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedProduct = await fetchProductById(id, userId);
        setProduct(selectedProduct);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleSubmitReview = (newReview) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [...prevProduct.reviews, newReview],
    }));
    window.location.reload();
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const { newPrice, oldPrice, chipText, chipColor, discountValue } = calculateDiscount(product);

  const updatedProduct = {
    ...product,
    newPrice,
    oldPrice,
    chipText,
    chipColor,
    discountValue
  };

  // Filter out scents that are out of stock
  const availableScents = product.scents;
  const hasScents = availableScents.length > 0;

  // Get the selected scent's data (images) if a scent is selected
  const selectedScentData = availableScents.find(scent => scent.scentID === selectedScent?.scentID);

  // If there's a selected scent, use its images
  const slides = selectedScentData
    ? selectedScentData.ScentImages.map(image => ({
        id: selectedScentData.scentID,
        image,
        name: selectedScentData.scentName,
      }))
    : hasScents
    ? availableScents.map(scent => ({
        id: scent.scentID,
        image: scent.ScentImages[0], // You can use the first image of each scent here if you want
        name: scent.scentName,
      }))
    : [{ id: 0, image: updatedProduct.image }];

  return (
    <div className="min-h-screen md:min-w-[710px] bg-palette-body-3 flex flex-col items-center w-full">
      {/* Product Info */}
      <div className="w-full max-w-lg">
        <ProductInfo
          images={slides}
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
          setIsScentSelected={setIsScentSelected}
        />
      </div>

      {/* Add To Cart */}
      <div className="w-full max-w-lg px-4 mt-4 bg-palette-white p-2">
        <AddToCart product={updatedProduct} selectedScent={selectedScent} hasScents={hasScents} isScentSelected={isScentSelected} />
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
