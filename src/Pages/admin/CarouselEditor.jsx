import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Carousel from '../../components/client/home/Carousel';
import { fetchCarouselData, fetchProducts, saveCarouselData } from '../../api/adminApi';

const CarouselEditor = () => {
  const [carousels, setCarousels] = useState([]);
  const [products, setProducts] = useState([]); // State to hold product data
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState({}); 
console.log(carousels)
  // Fetch carousel data and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const carouselData = await fetchCarouselData();
        const productData = await fetchProducts();
        
        setCarousels(carouselData);
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle carousel data changes
  const handleCarouselChange = (id, field, value) => {
    setCarousels(
      carousels.map((carousel) =>
        carousel.id === id ? { ...carousel, [field]: value } : carousel
      )
    );
  };

  // Handle image change with preview
  const handleImageChange = (id, file) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;
    setImagePreview(prev => ({ ...prev, [id]: previewUrl }));
    handleCarouselChange(id, 'image', file);
  };

  // Handle adding a new carousel
  const handleAddCarousel = () => {
    setCarousels([  // Adding a new carousel to the list
      ...carousels,
      {
        id: carousels.length + 1,
        image: "",
        header: "",
        paragraph: "",
        showHeader: true,
        showParagraph: true,
        showButton: true,
        buttonText: "Click Me",  // Default button text
        buttonColor: "#000000", // Default button color
        buttonPath: "/new/page"
      }
    ]);
  };

  // Handle removing a carousel
  const handleRemoveCarousel = (id) => {
    if (carousels.length <= 2) {
      alert("You must have at least 2 slides.");
      return;
    }
    setCarousels(carousels.filter((carousel) => carousel.id !== id));
  };

  // Handle save changes (POST request to save carousel data)
  const handleSaveChanges = async () => {
    try {
      await saveCarouselData(carousels);
      alert('Changes saved successfully');
    } catch (error) {
      console.error('Error saving carousel data:', error);
      alert('Error saving changes');
    }
  };

  // Handle select product and update the button path
  const handleProductSelect = (carouselId, productId) => {
    const newPath = `/products/${productId}`;
    handleCarouselChange(carouselId, 'buttonPath', newPath);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <div className="mt-6">
        <Carousel slides={carousels} settings={{}} isAdmin={true} />
      </div>

      <div className="space-y-4">
        {carousels.map((carousel) => (
          <div key={carousel.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Slide {carousel.id}</h3>
            {/* Display Image Preview */}
            {imagePreview[carousel.id] && (
              <div className="mt-2">
                <img
                  src={imagePreview[carousel.id]}
                  alt="Image Preview"
                  className="w-full h-auto rounded-md max-w-[200px]"
                />
              </div>
            )}

            {/* Image Upload for Background */}
            <div className="mb-4">
              <InputField
                type="file"
                title="Upload Background Image"
                id={`image-upload-${carousel.id}`}
                onChange={(e) => handleImageChange(carousel.id, e.target.files[0])}
              />
            </div>

            {/* Visibility Toggles */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={carousel.showHeader}
                  onChange={() => handleCarouselChange(carousel.id, 'showHeader', !carousel.showHeader)}
                  className="mr-2"
                />
                <label className="block text-sm">Show Header</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={carousel.showParagraph}
                  onChange={() => handleCarouselChange(carousel.id, 'showParagraph', !carousel.showParagraph)}
                  className="mr-2"
                />
                <label className="block text-sm">Show Paragraph</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={carousel.showButton}
                  onChange={() => handleCarouselChange(carousel.id, 'showButton', !carousel.showButton)}
                  className="mr-2"
                />
                <label className="block text-sm">Show Button</label>
              </div>
            </div>

            {/* Header Input - Conditional */}
            {carousel.showHeader && (
              <div className="mt-4">
                <label className="block text-sm">Slide Header</label>
                <input
                  type="text"
                  value={carousel.header}
                  onChange={(e) => handleCarouselChange(carousel.id, 'header', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            )}

            {/* Paragraph Input - Conditional */}
            {carousel.showParagraph && (
              <div className="mt-4">
                <label className="block text-sm">Slide Paragraph</label>
                <textarea
                  value={carousel.paragraph}
                  onChange={(e) => handleCarouselChange(carousel.id, 'paragraph', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded"
                />
              </div>
            )}

            {/* Button Text and Path - Conditional */}
            {carousel.showButton && (
              <>
                <div className="mt-4">
                  <label className="block text-sm">Button Background Color</label>
                  <input
                    type="color"
                    value={carousel.buttonColor}
                    onChange={(e) => handleCarouselChange(carousel.id, 'buttonColor', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm">Button Text</label>
                  <input
                    type="text"
                    value={carousel.buttonText}
                    onChange={(e) => handleCarouselChange(carousel.id, 'buttonText', e.target.value)}
                    className="p-2 w-full border border-gray-300 rounded"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm">Button Path (URL)</label>
                  <select
                    value={carousel.buttonPath.replace('/products/', '')} // Show the product name
                    onChange={(e) => handleProductSelect(carousel.id, e.target.value)}
                    className="p-2 w-full border border-gray-300 rounded"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Remove Carousel Button */}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleRemoveCarousel(carousel.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                disabled={carousels.length <= 2} // Disable remove button if less than 2 slides
              >
                Remove Slide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Carousel Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleAddCarousel}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Add Carousel
        </button>
      </div>

      {/* Save Changes Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CarouselEditor;
