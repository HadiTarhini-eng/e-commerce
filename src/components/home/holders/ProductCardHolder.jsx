import React, { useState, useEffect } from 'react';
import ProductCard from '../cards/ProductCard'; // Assuming ProductCard is in the same directory
import Search from '../SearchBar'; // Import the Search component

const ProductCardHolder = ({ selectedCategories }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

  // Fetch the products data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/productCardData.json'); // Make sure the file is accessible
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setProducts(data.products); // Set the products from the JSON response
      } catch (err) {
        setError(err.message); // Set any error message
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchProducts();
  }, []);

  // Filter products by search term and selected categories
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()); // Search in both title and category

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

    // Generate a label for selected categories
    const categoryLabel = selectedCategories.length > 0
    ? `Filtered by: ${selectedCategories.join(', ')}`
    : 'All Products';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mt-8">
      {/* Title */}
      <div className="font-bold text-rich-pink text-2xl mb-4">
        Products
        <div className="text-sm text-dark-charcoal mt-1">{categoryLabel}</div>
      </div>

      {/* Search Component */}
      <Search placeholder="Search for products..." onSearchChange={setSearchTerm} />

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              newPrice={product.newPrice}
              oldPrice={product.oldPrice}
              rating={product.rating}
              chipText={product.chipText}
              chipColor={product.chipColor}
              destination={product.destination} // Passing the destination prop
            />
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductCardHolder;
