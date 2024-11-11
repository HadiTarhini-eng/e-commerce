import React, { useEffect, useState } from 'react';
import CategoryCard from '../cards/CategoryCard'; // Import CategoryCard component

const CategoryCardHolder = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the JSON file
  useEffect(() => {
    // Fetch the data (assuming CategoriesData.json is in the 'public' folder)
    fetch('/data/categoryData.json')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Handle the onClick for each category
  const handleCategoryClick = (category) => {
    console.log(`${category.title} clicked!`);
    // Add any other functionality you need here
  };

  return (
    <div className="w-full max-w-screen-md mx-auto my-6 p-4">
      {/* Categories Heading */}
      <h2 className="text-2xl font-semibold text-rich-pink mb-6">Categories</h2>

      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            image={category.image}
            title={category.title}
            onClick={() => handleCategoryClick(category)} // Handle the onClick event
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCardHolder;
