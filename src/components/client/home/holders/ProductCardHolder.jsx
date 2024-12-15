import React, { useState, useEffect } from 'react';
import ProductCard from '../cards/ProductCard'; // Assuming ProductCard is in the same directory
import { calculateDiscount } from '../../../../utils/discountUtils'; // Import the discount calculation function
import { fetchProductsData } from '../../../../api/clientApi';

const ProductCardHolder = ({ selectedCategories, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the products data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProductsData();
        // Initialize each product with a "favorite" status
        const initializedProducts = productsData.map((product) => ({
          ...product,
          isFavorited: false, // Default value; update if needed
        }));
        setProducts(initializedProducts);
      } catch (err) {
        setError(err.message); // Set error message if there's an issue
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, []);

  // Filter products by search term and selected categories
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);

    return matchesSearchTerm && matchesCategory;
  });

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
          <div className="text-sm text-dark-charcoal mt-1">{categoryLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-0">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const { newPrice, oldPrice, chipText, chipColor } = calculateDiscount(product);

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                newPrice={newPrice}
                oldPrice={oldPrice}
                chipText={chipText}
                chipColor={chipColor}
                destination={product.destination}
                isFavorited={product.isFavorited}
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
