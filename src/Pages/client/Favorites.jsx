import React, { useState } from 'react';
import ProductCardHolder from '../../components/client/home/holders/ProductCardHolder';
import SearchBar from '../../components/client/home/SearchBar';

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-palette-body-3 flex flex-col items-center w-full mt-10">
      {/* Search Bar */}
      <div className="w-full max-w-screen-lg px-4 mt-4">
        <SearchBar placeholder="Search in Blush&eacute;" onSearchChange={setSearchTerm} />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg">
        <ProductCardHolder 
          selectedCategories={selectedCategories}
          searchTerm={searchTerm}
          fromFavorites={true}
        />
      </div>
    </div>
  );
};

export default Favorites;
