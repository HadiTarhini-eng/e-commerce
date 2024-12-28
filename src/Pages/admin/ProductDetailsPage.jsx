import React, { useState, useEffect } from 'react';
import { postRemoveScent, fetchCategoryOptions, fetchProductData, postProductData, updateProductData, fetchScentOptions } from '../../api/adminApi';
import InputField from '../../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [scentOptions, setScentOptions] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        discount: 0,
        image: null,
        imageURL: '',
        category: '',
        specifications: '',
        reviews: [],
        scents: [],
    });
    const [productSubmit, setProductSubmit] = useState({});
    const [scentFirstImage, setscentFirstImage] = useState({});
    const navigate = useNavigate();
    console.log(product)

    // Fetch the product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id !== 'add') {
                    const productData = await fetchProductData(id);
                    setProduct({
                        ...productData,
                    });

                    const scentFirstImageMap = {};
                    if (productData.scents && Array.isArray(productData.scents)) {
                        productData.scents.forEach((scent) => {
                            if (scent.scentID && scent.scentFirstImage) {
                                scentFirstImageMap[scent.scentID] = scent.scentFirstImage; // Map scent ID to scentFirstImage ID
                            }
                            setscentFirstImage(scentFirstImageMap);
                        });
                    }
                }
                const categoryOptionsResponse = await fetchCategoryOptions();
                setCategoryOptions(categoryOptionsResponse);

                const scentOptionsResponse = await fetchScentOptions();
                setScentOptions(scentOptionsResponse);
            } catch (error) {
                console.error('Error fetching product data', error);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle input changes and calculate new price automatically
    const handleInputChange = (e, id) => {
        const { value } = e.target;

        // Make sure that number inputs can't go below 0
        const newValue = id === 'name' || 'specifications' ? value : Math.max(0, value); // Ensure values don't go below 0 for non-name fields

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
        console.log(categoryId)
        setProduct(prev => ({
            ...prev,
            category: categoryId, // Update the category field
        }));
    };

    // Handle scent name changes
    const handleScentNameChange = (scentID, selectedScentID) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.map(scent =>
                scent.scentID === scentID
                    ? { ...scent, scentID: selectedScentID }
                    : scent
            ),
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

    // Handle file input changes separately
    const handleFileChange = (e, id) => {
        console.log(id)
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const fileName = file.name; // Get the file name

            // Read the file as a Data URL (for preview purposes) and as binary (for database storage)
            const reader = new FileReader();

            reader.onloadend = () => {
                const imagePreviewURL = reader.result; // Data URL for preview purposes

                if (id === 'mainImage') {
                    setProduct((prev) => ({
                        ...prev,
                        image: file, // Save the actual file object
                        imageURL: imagePreviewURL // Save Data URL for preview
                    }));
                } else {
                    setProduct((prev) => ({
                        ...prev,
                        scents: prev.scents.map((scent) =>
                            scent.scentID === id
                                ? {
                                    ...scent,
                                    ScentImages: [
                                        ...scent.ScentImages,
                                        {
                                            id: Date.now(),
                                            file: file, // Save the actual file object
                                            imageURL: imagePreviewURL // Save Data URL for preview
                                        }
                                    ]
                                }
                                : scent
                        )
                    }));
                }
            };

            // Read the file as a Data URL for preview
            reader.readAsDataURL(file);
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
        // Check if the last scent in the array has an empty scentID
        const lastScent = product.scents[product.scents.length - 1];
        if (lastScent && lastScent.scentID === "" && lastScent.scentStock === 0 && lastScent.scentName === "") {
            toast.error("Please select a name for the previous scent before adding a new one.");
            return; // Stop if the previous scent has an empty scentID
        }

        setProduct(prev => ({
            ...prev,
            scents: [
                ...prev.scents,
                { scentID: '', scentName: '', ScentImages: [], scentStock: 0 }
            ]
        }));
    };

    // Remove scent
    const handleRemoveScent = async (scentID) => {
        setProduct(prev => ({
            ...prev,
            scents: prev.scents.filter(scent => scent.scentID !== scentID)
        }));

        try {
            const result = await postRemoveScent(scentID, id);
            toast.success("Scent removed successfully!");
        } catch (error) {
            console.error("Error removing scent data", error);
            toast.error("There was an error removing the scent.");
        }
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

    // Function to validate product details
    const validateProduct = () => {
        // General validation
        if (!product.name) {
            toast.error("Product name is required!");
            return false;
        }
        if (!product.category) {
            toast.error("Category is required!");
            return false;
        }
        if (product.price < 0) {
            toast.error("Price cannot be less than 0!");
            return false;
        }
        if (product.discount < 0) {
            toast.error("Discount cannot be less than 0!");
            return false;
        }
        if (!product.specifications) {
            toast.error("Specifications are required!");
            return false;
        }

        // Validate product image
        if (!product.image) {
            toast.error("Product image is required!");
            return false;
        }

        // Validate that at least one scent image is selected
        if (product.scents.some(scent => scent.ScentImages.length === 0)) {
            toast.error("Each scent must have at least one image!");
            return false;
        }

        // Validate scent selection
        for (const scent of product.scents) {
            if (!scent.scentID) {
                toast.error("Each scent must have a valid scent name!");
                return false;
            }
        }

        return true;
    };

    // Handle Save Changes
    const handleSaveChanges = async () => {
        const isValid = validateProduct();
        if (!isValid) return; // Stop if validation fails

        setProductSubmit({
            ...product,
            imageURL: undefined,
        });

        try {
            let result;
            if (id === 'add') {
                result = await postProductData(product); // Create a new product
                toast.success("Product created successfully!");
                navigate('/productTable'); // Redirect to products list after successful addition
                window.location.reload();
            } else {
                result = await updateProductData(product, id); // Update an existing product
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
        <div className="bg-white p-5 pb-1">
            <div className="container mx-auto px-4 pt-8">
                <div className="flex flex-col mx-4">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Product Details</h2>
                    <div className='grid grid-cols-[2fr_4fr] gap-4'>
                        <div className='justify-self-center items-center'>
                            {/* Product Details */}
                            {/* Product Image */}
                            <h2 className="text-lg font-bold text-gray-800 pb-2 mb-4">Image:</h2>
                            <div className="w-full px-4 mb-8">
                                <img
                                    src={product.image && id !== 'add' ? `/images/products/${product.image}` : product.imageURL}
                                    alt="Product"
                                    className="w-full h-auto object-contain bg-white rounded-lg shadow-md mb-4 min-w-[250px] max-w-[250px] max-h-[250px]"
                                />
                                <InputField
                                    type="file"
                                    title="Change Product Image"
                                    id="image"
                                    onChange={(e) => handleFileChange(e, 'mainImage')}
                                    fromProduct={true}
                                />
                            </div>
                        </div>

                        <div className='mr-14'>
                            {/* Product Details */}
                            <h2 className="text-lg font-bold text-gray-800 pb-2">Name:</h2>
                            <InputField
                                type="text"
                                title="Product Name"
                                placeholder="Product Name"
                                id="name"
                                value={product.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />

                            {/* Category Select Input */}
                            <h2 className="text-lg font-bold text-gray-800 pb-2 mt-4">Category:  {product.category}</h2>
                            <div>
                                <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">Select Category:</label>
                                <select
                                    id="categorySelect"
                                    name="category"
                                    value={product.category} // Use product state for category
                                    onChange={(e) => handleCategoryChange(e.target.value)} // Call the handleCategoryChange function
                                    className="mt-1 w-fit block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a category</option>
                                    {categoryOptions.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Specifications */}
                            <h2 className="text-lg font-bold text-gray-800 pb-2 mt-4">Specifications:</h2>
                            <InputField
                                type="textarea"
                                title=""
                                placeholder="Write..."
                                id="price"
                                value={product.specifications}
                                onChange={(e) => handleInputChange(e, 'specifications')}
                            />

                            {/* Price, Discount */}
                            <h2 className="text-lg font-bold text-gray-800 pb-2 mt-4">Price:</h2>
                            <div className='flex flex-row gap-4'>
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
                                />
                                <div className='ml-10'>
                                    <span className="text-3xl text-palette-button font-bold mr-2">
                                        ${calculateDiscountedPrice(product.price, product.discount)}
                                    </span>
                                    {product.price && (
                                        <span className="text-gray-500 line-through">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-12">Scents</h2>
                    {/* Scents */}
                    <div className='mt-4 pb-0'>
                        {product.scents.map((scent, idx) => (
                            <div key={idx} className="flex flex-col mb-4 mx-5 border-2 border-gray-200 rounded-lg p-4">
                                <div className='grid grid-cols-[2fr_2fr] p-4 gap-4'>
                                    {/* Scent Name */}
                                    <div>
                                        <label htmlFor={`scent-select-${scent.id}`} className="text-sm font-medium">
                                            {`Scent ${idx + 1}`}
                                        </label>
                                        <select
                                            id={`scent-select-${scent.scentID}`}
                                            value={scent.scentID}
                                            onChange={(e) => handleScentNameChange(scent.scentID, e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            {/* Placeholder option */}
                                            <option value="" disabled>
                                                Scent Name
                                            </option>
                                            {/* Map options */}
                                            {scentOptions.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Stock Input for Scent */}
                                    <div className="">
                                        <InputField
                                            type="number"
                                            title="Scent Stock"
                                            placeholder="Stock"
                                            id="scentStock"
                                            value={scent.scentStock}
                                            className="w-fit"
                                            onChange={(e) => handleScentChange(scent.scentID, 'scentStock', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='mt-4 grid grid-cols-[2fr_2fr] p-4 gap-4'>
                                    {/* Add First Image for Scent */}
                                    <InputField
                                        type="file"
                                        title="Add Image"
                                        id={`scentImage-${scent.scentID}`}
                                        onChange={(e) => handleFileChange(e, scent.scentID)}
                                    />

                                    {/* Displaying scent images with border on select */}
                                    <div className="flex flex-wrap gap-4 mt-2 max-h-fit">
                                        {scent.ScentImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`relative cursor-pointer p-1 border-2 rounded-lg ${(scent.scentFirstImage?.id === image.id ||
                                                    (Array.isArray(scent.scentFirstImage) && scent.scentFirstImage[0]?.id === image.id))
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300'
                                                    }`}
                                                onClick={() => handleScentFirstImageChange(scent.scentID, image)}
                                            >
                                                <img
                                                    src={image.path ? `/images/products/${image.path}` : image.imageURL}
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
                                </div>

                                <div className="mt-4 grid">
                                    {/* Remove Scent */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScent(scent.scentID)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded max-w-[140px] justify-self-end"
                                    >
                                        Remove Scent
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Scent */}
                    <div className="mt-4 grid">
                        <button
                            type="button"
                            onClick={handleAddScent}
                            className="px-2 mr-4 py-2 bg-green-500 text-white rounded-full max-w-fit justify-self-end"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 grid">
                        <button
                            onClick={handleSaveChanges}
                            className="mt-4 bg-blue-500 bg-palette-button text-white font-bold text-xl px-4 py-2 rounded-lg max-w-[200px] justify-self-center"
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
