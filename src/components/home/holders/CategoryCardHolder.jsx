import React, { useEffect, useState } from 'react';
import CategoryCard from '../cards/CategoryCard'; // Import CategoryCard component

const CategoryCardHolder = ({ page, title, onCategorySelection }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle skeleton

  // Fetch categories from the JSON file
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let data;
        if (page === 'Home') {
          data = await fetch('/data/categoryData.json').then((res) => res.json());
        } else if (page === 'Payment') {
          data = await fetch('/data/paymentTypeData.json').then((res) => res.json());
        }
        setCategories(data);
        setIsLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false); // Stop loading in case of error
      }
    };

    fetchCategories();
  }, [page]); // Re-run effect when `page` changes

  // Skeleton Loader for Category Cards
  const SkeletonLoader = () => (
    <div className="w-full p-4 max-w-[16rem] bg-white shadow-md rounded-md cursor-pointer animate-pulse">
      <div className="flex justify-center mb-2">
        <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
      </div>
      <div className="w-24 h-4 bg-gray-300 mx-auto rounded-md"></div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mt-8">
      {/* Categories Heading */}
      <h2 className="text-2xl font-semibold text-taupe-brown mb-6">{title}</h2>

      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? // If loading, display skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : // If loaded, display actual category cards
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                title={category.title}
                onClick={() => onCategorySelection(category.title)} // Pass category title to the parent handler
              />
            ))}
      </div>
    </div>
  );
};

export default CategoryCardHolder;
