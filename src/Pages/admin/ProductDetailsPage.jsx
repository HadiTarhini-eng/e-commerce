import React, { useState, useEffect } from 'react';
import { fetchCategoryOptions, fetchProductData, postProductData, updateProductData } from '../../api/adminApi';
import InputField from '../../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        discount: 0,
        image: null,
        imageURL: '',
        scents: [],
    });
    const navigate = useNavigate();
    console.log(product)

    // Fetch the product data
    useEffect(() => {
        if (id !== 'add') {
            const fetchProduct = async () => {
                try {
                    const productData = await fetchProductData(id);
                    setProduct({
                        ...productData,
                    });
        
                    const optionsResponse = await fetchCategoryOptions();
                    setCategoryOptions(optionsResponse);
                } catch (error) {
                    console.error('Error fetching product data', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    // Handle input changes and calculate new price automatically
    const handleInputChange = (e, id) => {
        const { value } = e.target;

        // Make sure that number inputs can't go below 0
        const newValue = id === 'name' ? value : Math.max(0, value); // Ensure values don't go below 0 for non-name fields

        setProduct(prev => ({
            ...prev,
            [id]: newValue
        }));
    };

    const calculateDiscountedPrice = (price, discount) => {
        const discountedPrice = price - (price * (discount / 100));
        return discountedPrice % 1 === 0 ? discountedPrice.toFixed(0) : discountedPrice.toFixed(2);
    };

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categoryOptions.find(category => category.id === parseInt(categoryId));
        setProduct(prev => ({
            ...prev,
            category: selectedCategory ? selectedCategory.title : '', // Update the category field
        }));
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

    const handleFileChange = (e, scentID) => {
        const file = e.target.files[0];
        const newImagePath = URL.createObjectURL(file); // Create temporary URL for display

        if (scentID === 'mainImage') {
            setProduct(prev => ({
                ...prev,
                image: file, // Save the actual file object in the 'image' field of the product
                imageURL: newImagePath // Save the temporary URL for display purposes
            }));
        } else {
            setProduct(prev => ({
                ...prev,
                scents: prev.scents.map(scent =>
                    scent.scentID === scentID
                        ? { ...scent, ScentImages: [...scent.ScentImages, { id: Date.now(), file: file, imageURL: newImagePath }] }
                        : scent
                )
            }));
        }
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

    // Handle scent first image selection
    const handleScentFirstImageChange = (scentID, image) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID
                    ? { ...scent, scentFirstImage: image } // Set the selected image as the first image
                    : scent
            )
        }));
    };

    // Function to save changes
    const handleSaveChanges = async () => {
        try {
            let result;
            if (id === 'add') {
                result = await postProductData(product); // Create a new product
                toast.success("Product created successfully!");
                navigate('/productTable'); // Redirect to products list after successful addition
            } else {
                result = await updateProductData(product); // Update an existing product
                toast.success("Product updated successfully!");
                navigate('/productTable');
            }
        } catch (error) {
            console.error("Error saving product data", error);
            toast.error("There was an error saving the product data.");
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
                            src={product.imageURL}
                            alt="Product"
                            className="w-full h-auto rounded-lg shadow-md mb-4"
                        />
                        <InputField
                            type="file"
                            title="Change Product Image"
                            id="image"
                            onChange={(e) => handleFileChange(e, 'mainImage')}
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
                            onChange={(e) => handleInputChange(e, 'name')}
                        />

                        {/* Category Select Input */}
                        <div>
                            <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">Select Category</label>
                            <select
                                id="categorySelect"
                                name="category"
                                value={product.category} // Use product state for category
                                onChange={(e) => handleCategoryChange(e.target.value)} // Call the handleCategoryChange function
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option disabled value="">Select a category</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price, Discount */}
                        <div>
                            <span className="text-2xl font-bold mr-2">
                                ${calculateDiscountedPrice(product.price, product.discount)}
                            </span>
                            {product.price && (
                                <span className="text-gray-500 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <InputField
                            type="number"
                            title="Price"
                            placeholder="Price"
                            id="price"
                            value={product.price}
                            onChange={(e) => handleInputChange(e, 'price')}
                        />
                        <InputField
                            type="number"
                            title="Discount"
                            placeholder="Discount"
                            id="discount"
                            value={product.discount}
                            onChange={(e) => handleInputChange(e, 'discount')}
                            min="0"
                        />

                        {/* Scents */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Scents:</h3>
                            {product.scents.map((scent, idx) => (
                                <div key={scent.scentID} className="flex flex-col mb-4">
                                    <InputField
                                        type="text"
                                        title={`Scent ${idx + 1}`}
                                        value={scent.scentName}
                                        onChange={(e) => handleScentNameChange(scent.scentID, e.target.value)}
                                        placeholder="Scent Name"
                                    />

                                    {/* Displaying scent images with border on select */}
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {scent.ScentImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`relative cursor-pointer p-1 border-2 rounded-lg ${scent.scentFirstImage?.id === image.id ? 'border-blue-500' : 'border-gray-300'}`}
                                                onClick={() => handleScentFirstImageChange(scent.scentID, image)}
                                            >
                                                <img
                                                    src={image.imageURL}
                                                    alt="Scent"
                                                    className="w-24 h-24 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(scent.scentID, image.id)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stock Input for Scent */}
                                    <div className="mt-4">
                                        <InputField
                                            type="number"
                                            title="Scent Stock"
                                            placeholder="Stock"
                                            id="scentStock"
                                            value={scent.scentStock}
                                            onChange={(e) => handleScentChange(scent.scentID, 'scentStock', e.target.value)}
                                            min="0" // Ensure stock can't go below 0
                                        />
                                    </div>

                                    {/* Add First Image for Scent */}
                                    <InputField
                                        type="file"
                                        title="Add Image"
                                        id={`scentImage-${scent.scentID}`}
                                        onChange={(e) => handleFileChange(e, scent.scentID)}
                                    />

                                    {/* Remove Scent */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScent(scent.scentID)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Remove Scent
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
