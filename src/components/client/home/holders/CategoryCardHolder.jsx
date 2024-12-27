import React, { useEffect, useState } from 'react';
import CategoryCard from '../cards/CategoryCard'; // Import CategoryCard component
import { fetchCategoriesData } from '../../../../api/ClientApi';

const CategoryCardHolder = ({ page, title, onCategorySelection }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle skeleton

  // Fetch categories from the JSON file
  useEffect(() => {
    // Define an inner async function and call it immediately
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategoriesData(page);
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchData();
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
    <div className="w-full max-w-2xl mx-auto bg-palette-body-3 rounded-lg overflow-hidden mt-2">
      {/* Categories Heading */}
      {/* <h2 className="text-2xl font-semibold text-taupe-brown mb-6">{title}</h2> */}

      {/* Category Grid */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-6 gap-2">
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
