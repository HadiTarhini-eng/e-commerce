import React, { useState } from 'react';

const product = {
    name: 'Premium Wireless Headphones',
    category: 'Headphones',
    price: 349.99,
    oldPrice: 399.99,
    discount: 10,
    description: 'Experience premium sound quality and industry-leading noise cancellation with these wireless headphones.',
    colors: ['#000000', '#808080', '#0033cc'],  // black, gray, blue
    images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080',
        'https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8aGVhZHBob25lfGVufDB8MHx8fDE3MjEzMDM2OTB8MA&ixlib=rb-4.0.3&q=80&w=1080',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080',
        'https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080'
    ]
};

const ProductDetailsPage = () => {
    // State for managing the main image
    const [mainImage, setMainImage] = useState(product.images[0]);

    // Function to handle the image change when clicking thumbnails
    const handleImageChange = (src) => {
        setMainImage(src);
    };

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap -mx-4">
                    {/* Product Images */}
                    <div className="w-full md:w-1/2 px-4 mb-8">
                        <img
                            src={mainImage}
                            alt="Product"
                            className="w-full h-auto rounded-lg shadow-md mb-4"
                            id="mainImage"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2 px-4">
                        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-4">Category: {product.category}</p>
                        <div className="mb-4">
                            <span className="text-2xl font-bold mr-2">${product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                                <span className="text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                            )}
                        </div>

                        {product.discount && <span className="text-gray-500">Discount: {product.discount}%</span>}

                        <h3 className="text-xl font-bold mr-2 mt-4 mb-2">Specifications:</h3>
                        <p className="text-gray-700 mb-6">{product.description}</p>

                        {/* Quantity Input */}
                        <div className="mb-6">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value="1"
                                className="w-12 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Color/Scents Options */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Scents/Colors:</h3>
                            <div className="flex space-x-2">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}`}
                                        style={{ backgroundColor: color }}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Image Thumbnails */}
                        <div className="mt-4">
                            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-16 sm:w-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                        onClick={() => handleImageChange(image)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            {/* Reviews section can go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
