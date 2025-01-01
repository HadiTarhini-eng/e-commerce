import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Carousel from '../../components/client/home/Carousel';
import { fetchCarouselData, fetchProducts, saveCarouselData } from '../../api/adminApi';
import toast from 'react-hot-toast';

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
        buttonPath: "/new/page",
        headerBgOpacity: 1,
        paragraphBgOpacity: 1,
        headerBgPadding: 4,
        paragraphBgBorderRadius: 8,
      }
    ]);
  };

  // Handle removing a carousel
  const handleRemoveCarousel = (id) => {
    if (carousels.length <= 2) {
      toast.error("You must have at least 2 slides.");
      return;
    }
    setCarousels(carousels.filter((carousel) => carousel.id !== id));
  };

  // Handle save changes (POST request to save carousel data)
  const handleSaveChanges = async () => {
    try {
      await saveCarouselData(carousels);
      toast.success('Changes saved successfully');
      // window.location.reload();
    } catch (error) {
      console.error('Error saving carousel data:', error);
      toast.error('Error saving changes');
    }
  };

  // Handle select product and update the button path
  const handleProductSelect = (carouselId, productId) => {
    const newPath = `/product/${productId}`;
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
        {carousels.map((carousel, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Slide {carousel.id}</h3>

            <div className='grid grid-cols-[2fr_4fr] gap-4'>
              <div className='justify-self-center items-center'>
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

                {/* Display fetched image */}
                {carousel.image && (
                  <div className="mt-2">
                    <img
                      src={`/images/carousel/${carousel.image}`}
                      alt=""
                      className="w-full h-auto rounded-md max-w-[250px]"
                    />
                  </div>
                )}

                {/* Image Upload for Background */}
                <div className="mb-4">
                  <InputField
                    type="file"
                    title="Upload Background Image"
                    id={`image-upload-${carousel.id}`}
                    placeholder={'PNG, JPG, JPEG'}
                    onChange={(e) => handleImageChange(carousel.id, e.target.files[0])}
                    fromCarousel={true}
                  />
                </div>
              </div>

              {/* Visibility Toggles */}
              <div className='mr-14'>
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
                  <>
                    <div className="mt-4">
                      <label className="block text-sm">Slide Header</label>
                      <input
                        type="text"
                        value={carousel.header}
                        onChange={(e) => handleCarouselChange(carousel.id, 'header', e.target.value)}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                    </div>
            
                    {/* Header Background Opacity */}
                    <div className="mt-4">
                      <label className="block text-sm">Header Background Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={carousel.headerBgOpacity}
                        onChange={(e) => handleCarouselChange(carousel.id, 'headerBgOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Padding */}
                    <div className="mt-4">
                      <label className="block text-sm">Header Padding</label>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={carousel.padding}
                        onChange={(e) => handleCarouselChange(carousel.id, 'headerBgPadding', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>

                    {/* Border Radius */}
                    <div className="mt-4">
                      <label className="block text-sm">Header Border Radius</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={carousel.borderRadius}
                        onChange={(e) => handleCarouselChange(carousel.id, 'headerBgBorderRadius', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {/* Paragraph Input - Conditional */}
                {carousel.showParagraph && (
                  <>
                    <div className="mt-4">
                      <label className="block text-sm">Slide Paragraph</label>
                      <textarea
                        value={carousel.paragraph}
                        onChange={(e) => handleCarouselChange(carousel.id, 'paragraph', e.target.value)}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                    </div>

                    {/* Paragraph Background Opacity */}
                    <div className="mt-4">
                      <label className="block text-sm">Paragraph Background Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={carousel.paragraphBgOpacity}
                        onChange={(e) => handleCarouselChange(carousel.id, 'paragraphBgOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Padding */}
                    <div className="mt-4">
                      <label className="block text-sm">Paragraph Padding</label>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={carousel.padding}
                        onChange={(e) => handleCarouselChange(carousel.id, 'paragraphBgPadding', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>

                    {/* Border Radius */}
                    <div className="mt-4">
                      <label className="block text-sm">Paragraph Border Radius</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={carousel.borderRadius}
                        onChange={(e) => handleCarouselChange(carousel.id, 'paragraphBgBorderRadius', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>
                  </>
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
                        value={carousel.buttonPath.replace('/product/', '')} // Show the product name
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
              </div>
            </div>

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
      <div className="mt-4 grid">
        <button
          onClick={handleAddCarousel}
          className="px-2 mr-4 py-2 bg-green-500 text-white rounded-full max-w-fit justify-self-end"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Save Changes Button */}
      <div className="mt-4 grid">
        <button
          onClick={handleSaveChanges}
          className="mt-4 bg-blue-500 bg-palette-button text-white font-bold text-xl px-4 py-2 rounded-lg max-w-[200px] justify-self-center"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CarouselEditor;
