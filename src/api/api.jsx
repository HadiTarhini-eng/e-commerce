import axios from "axios";

///////////// FETCH ///////////////////// HOME PAGE ///////////// FETCH /////////////////////

// Fetch Carousel Data
export const fetchCarouselData = async () => {
    const carouselResponse = await axios.get('/data/carouselData.json');
    const carouselJson = carouselResponse.data.carousels;
    return carouselJson;
};

// Fetch Categories Data based on the current page
export const fetchCategoriesData = async (page) => {
    let url = '';

    if (page === 'Home') {
        url = '/data/categoryData.json';
    } else if (page === 'Payment') {
        url = '/data/paymentTypeData.json';
    }

    const response = await axios.get(url);
    return response.data; // Return the response data
};

// Fetch Products Data
export const fetchProductsData = async () => {
    const response = await axios.get('/data/productCardData.json'); // Fetch the product data
    if (response.status !== 200) {
      throw new Error('Failed to fetch products'); // Throw error if the response is not OK
    }
    return response.data.products; // Return the products from the response
};

// Fetch Ads Data
export const fetchAdsData = async () => {
    const response = await axios.get('/data/adsData.json'); // Fetch the ads data
    if (response.status !== 200) {
      throw new Error('Failed to fetch ads data'); // Throw an error if the response status is not 200
    }
    return response.data.ads; // Return the ads from the response
};


///////////// FETCH ///////////////////// PRODUCT PAGE ///////////// FETCH /////////////////////

// Fetch Product by ID
export const fetchProductById = async (id) => {
    const response = await axios.get('/data/productCardData.json'); // Fetch all products data
    if (response.status !== 200) {
      throw new Error('Failed to fetch products data'); // Throw an error if the response is not OK
    }
  
    const selectedProduct = response.data.products.find((product) => product.id === parseInt(id));
    if (!selectedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
  
    return selectedProduct; // Return the selected product
};


///////////// POST ///////////////////// CHECKOUT PAGE ///////////// POST /////////////////////

// POST Request to submit the order (personal info + cart data)
export const submitOrder = async (payload) => {
    try {
      const response = await axios.post('/data/checkout.json', payload); // Your backend endpoint
      if (response.status !== 200) {
        throw new Error('Failed to submit order');
      }
      return response.data; // You can handle the response if needed
    } catch (error) {
      throw new Error('Error while submitting order: ' + error.message);
    }
  };