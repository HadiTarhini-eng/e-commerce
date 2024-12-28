import React, { useState, useEffect } from 'react';
import ProductCard from '../cards/ProductCard'; // Assuming ProductCard is in the same directory
import { calculateDiscount } from '../../../../utils/discountUtils'; // Import the discount calculation function
import { useAuth } from '../../AuthContext';
import { fetchProductsData, toggleFavoriteStatus } from '../../../../api/clientApi';
import toast from 'react-hot-toast';

const ProductCardHolder = ({ selectedCategories, searchTerm, fromFavorites, onShowDrawer, updatedProductId }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  
  // Fetch the products data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProductsData(userId);
        // Initialize each product with a "favorite" status
        const initializedProducts = productsData.map((product) => ({
          ...product,
          isFavorited: product.isFavorited,
        }));
        setProducts(productsData);
      } catch (err) {
        setError(err.message); // Set error message if there's an issue
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, [userId]);

  const handleToggleFavorite = async (productId, title, currentFavoriteStatus) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isFavorited: !currentFavoriteStatus } // Toggle favorite status locally
          : product
      )
    );
  
    try {
      const newFavoriteStatus = !currentFavoriteStatus;
  
      // Call the API with the userId, productId, and favoriteStatus
      await toggleFavoriteStatus(userId, productId, newFavoriteStatus);
  
      // Show toast based on the action
      newFavoriteStatus
        ? toast.success(`${title} added to favorites!`)
        : toast.error(`${title} removed from favorites!`);
    } catch (error) {
      // Revert the favorite state in case of an error (rollback)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, isFavorited: currentFavoriteStatus }
            : product
        )
      );
      toast.error('Failed to update favorite status. Please try again.');
    }
  };
  
  
  // Filter products by search term and selected categories
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);

    return matchesSearchTerm && matchesCategory;
  });

  // If fromFavorites is true, filter out products that are not favorited
  const displayedProducts = fromFavorites
    ? filteredProducts.filter((product) => product.isFavorited)
    : filteredProducts;

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const categoryLabel = selectedCategories.length > 0
    ? `Filtered by: ${selectedCategories.join(', ')}`
    : 'All Products';

  return (
    <div className="w-full max-w-2xl mx-auto bg-palette-body-3 overflow-hidden mb-20">
      <div className="w-full font-bold text-black text-2xl p-4 flex flex-col items-start gap-4">
        {/* Title and Label (stacked vertically) */}
        <div className="flex flex-col">
          <div>Products</div>
          {/* Show category label only if fromFavorites is false */}
          {!fromFavorites && (
            <div className="text-sm text-dark-charcoal mt-1">{categoryLabel}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-0">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => {
            const { newPrice, oldPrice, chipText, chipColor, discountValue, createdAt } = calculateDiscount(product);

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                createdAt={createdAt}
                newPrice={newPrice}
                oldPrice={oldPrice}
                chipText={chipText}
                chipColor={chipColor}
                discountValue={discountValue}
                destination={product.destination}
                isFavorited={product.isFavorited}
                totalStock={product.totalStock}
                onShowDrawer={onShowDrawer}
                updatedProductId={updatedProductId}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductCardHolder;
