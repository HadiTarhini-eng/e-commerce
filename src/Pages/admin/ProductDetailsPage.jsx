import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchProductData } from '../../api/adminApi';
import InputField from '../../components/InputField';
import { calculateDiscount } from '../../utils/discountUtils';

const ProductDetailsPage = () => {
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [selectedScent, setSelectedScent] = useState(null);

    // Fetch the product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productId = 1; // Replace this with dynamic ID if needed
                const productData = await fetchProductData(productId); 
                setProduct({
                    ...productData,
                    discount: 0, // Default discount value set to 0
                });
                setMainImage(productData.image);
            } catch (error) {
                console.error('Error fetching product data', error);
            }
        };

        fetchProduct();
    }, []);

    // Handle input changes and calculate new price automatically
    const handleInputChange = (e, id) => {
        const { value } = e.target;
        
        // Make sure that number inputs can't go below 0
        const newValue = Math.max(0, value); // Ensures values don't go below 0

        setProduct(prev => {
            const updatedProduct = { ...prev, [id]: newValue };
            if (id === 'price' || id === 'discount') {
                const discountData = calculateDiscount(updatedProduct); // Calculate new price
                updatedProduct.newPrice = discountData.newPrice;
                updatedProduct.discountValue = discountData.discountValue;
            }
            return updatedProduct;
        });
    };

    // Handle scent name changes (Editable)
    const handleScentNameChange = (scentID, name) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID ? { ...scent, scentName: name } : scent
            )
        }));
    };

    // Handle scent input changes (for each scent's stock)
    const handleScentChange = (scentID, field, value) => {
        const newValue = Math.max(0, value); // Ensure scent stock can't go below 0
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID ? { ...scent, [field]: newValue } : scent
            )
        }));
    };

    // Handle file input (image changes for scents)
    const handleFileChange = (e, scentID) => {
        const file = e.target.files[0];
        const newImagePath = URL.createObjectURL(file);
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID
                    ? { ...scent, ScentImages: [...scent.ScentImages, { id: Date.now(), path: newImagePath }] }
                    : scent
            )
        }));
    };

    // Remove scent image
    const handleRemoveImage = (scentID, imageID) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID
                    ? { ...scent, ScentImages: scent.ScentImages.filter(img => img.id !== imageID) }
                    : scent
            )
        }));
    };

    // Add new scent
    const handleAddScent = () => {
        setProduct(prev => ({
            ...prev,
            scents: [...prev.scents, { scentID: Date.now().toString(), scentName: '', ScentImages: [], scentStock: 0 }]
        }));
    };

    // Remove scent
    const handleRemoveScent = (scentID) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.filter(scent => scent.scentID !== scentID)
        }));
    };

    // Save changes
    const handleSaveChanges = async () => {
        try {
            const productId = 1; // Replace with dynamic productId if needed
            await axios.put(`/api/products/${productId}`, product); // Adjust URL and method as needed
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error saving product data", error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col -mx-4">

                    {/* Product Image */}
                    <div className="w-full md:w-1/2 px-4 mb-8">
                        <img
                            src={mainImage}
                            alt="Product"
                            className="w-full h-auto rounded-lg shadow-md mb-4"
                        />
                        <InputField
                            type="file"
                            title="Change Product Image"
                            id="image"
                            onChange={(e) => handleFileChange(e, null)}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2 px-4">
                        <InputField
                            type="text"
                            title="Product Name"
                            placeholder="Product Name"
                            id="name"
                            value={product.name}
                            onChange={handleInputChange}
                        />

                        {/* Price, Discount */}
                        <div>
                            <span className="text-2xl font-bold mr-2">
                                {/* ${product.newPrice.toFixed(2)} */}
                            </span>
                            {product.oldPrice && (
                                <span className="text-gray-500 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <InputField
                            type="number"
                            title="Price"
                            placeholder="Price"
                            id="price"
                            value={product.price}
                            onChange={handleInputChange}
                        />
                        <InputField
                            type="number"
                            title="Discount"
                            placeholder="Discount"
                            id="discount"
                            value={product.discount}
                            onChange={handleInputChange}
                            min="0" // Ensure it can't go below 0
                        />

                        {/* Scents */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Scents:</h3>
                            {product.scents.map((scent, idx) => (
                                <div key={scent.scentID} className="flex items-center space-x-2 mb-2">
                                    <InputField
                                        type="text"
                                        title={`Scent ${idx + 1}`}
                                        value={scent.scentName}
                                        onChange={(e) => handleScentNameChange(scent.scentID, e.target.value)}
                                        placeholder="Scent Name"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScent(scent.scentID)}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddScent}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Add Scent
                            </button>

                            {/* Scent Image Thumbnails */}
                            {selectedScent && (
                                <div>
                                    {product.scents
                                        .find(scent => scent.scentID === selectedScent)
                                        .ScentImages.map((image, idx) => (
                                            <div key={image.id} className="flex items-center space-x-2">
                                                <img src={image.path} alt={`Scent Image ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(selectedScent, image.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    <InputField
                                        type="file"
                                        title="Add Scent Image"
                                        id="scentImage"
                                        onChange={(e) => handleFileChange(e, selectedScent)}
                                    />

                                    {/* Stock Input for Scent */}
                                    <div className="mt-4">
                                        <InputField
                                            type="number"
                                            title="Scent Stock"
                                            placeholder="Stock"
                                            id="scentStock"
                                            value={product.scents.find(scent => scent.scentID === selectedScent).scentStock}
                                            onChange={(e) => handleScentChange(selectedScent, 'scentStock', e.target.value)}
                                            min="0" // Ensure stock can't go below 0
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSaveChanges}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
