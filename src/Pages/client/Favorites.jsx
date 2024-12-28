import React, { useState } from 'react';
import ProductCardHolder from '../../components/client/home/holders/ProductCardHolder';
import SearchBar from '../../components/client/home/SearchBar';
import BottomDrawer from '../../components/client/home/BottomDrawer';

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  const updatedProductId = (newId) => {
    setProductId(newId);
  }

  // Function to toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen md:min-w-[710px] bg-palette-body-3 flex flex-col items-center w-full">
      {/* Search Bar */}
      <div className="w-full max-w-screen-lg px-4 mt-4">
        <SearchBar placeholder="Search in Favorites" onSearchChange={setSearchTerm} />
      </div>

      {/* Product Cards Holder */}
      <div className="w-full max-w-screen-lg">
        <ProductCardHolder 
          selectedCategories={[]}
          searchTerm={searchTerm} 
          fromFavorites={true}
          onShowDrawer={toggleDrawer} 
          updatedProductId={updatedProductId}
        />
      </div>

      {/* Bottom Drawer */}
      <div className="w-full max-w-screen-lg">
        <BottomDrawer
          isDrawerOpen={isDrawerOpen} 
          toggleDrawer={toggleDrawer}
          productId={productId}
        />
      </div>
    </div>
  );
};

export default Favorites;
