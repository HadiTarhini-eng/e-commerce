import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // Assuming ProductCard is in the same directory

const ProductCardHolder = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="font-bold text-black text-xl mb-4 font-['Plus_Jakarta_Sans']">Products</div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
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
        ))}
      </div>
    </div>
  );
};

export default ProductCardHolder;
