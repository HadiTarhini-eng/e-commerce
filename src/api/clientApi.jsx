import axios from "axios";

///////////// FETCH ///////////////////// HOME PAGE ///////////// FETCH /////////////////////

// Fetch Carousel Data
export const fetchCarouselData = async () => {
    const carouselResponse = await axios.get('/data/client/carouselData.json');
    const carouselJson = carouselResponse.data.carousels;
    return carouselJson;
};

// Fetch Categories Data based on the current page
export const fetchCategoriesData = async (page) => {
    let url = '';

    if (page === 'Home') {
        url = 'http://localhost/e-commerce/src/backend/categoryData.php';
    } else if (page === 'Payment') {
        url = 'http://localhost/e-commerce/src/backend/paymentTypeData.php';
    }

    try {
        const response = await axios.get(url);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Or handle the error as needed
    }


};

// Fetch Products Data
export const fetchProductsData = async () => {
    const response = await axios.get('http://localhost/e-commerce/src/backend/productCardData.php'); // Fetch the product data
    if (response.status !== 200) {
      throw new Error('Failed to fetch products'); // Throw error if the response is not OK
    }
    return response.data.products; // Return the products from the response
};

// Fetch Ads Data
export const fetchAdsData = async () => {
    const response = await axios.get('/data/client/adsData.json'); // Fetch the ads data
    if (response.status !== 200) {
      throw new Error('Failed to fetch ads data'); // Throw an error if the response status is not 200
    }
    return response.data.ads; // Return the ads from the response
};


///////////// FETCH ///////////////////// PRODUCT PAGE ///////////// FETCH /////////////////////

// Fetch Product by ID
export const fetchProductById = async (id) => {
    const response = await axios.get('http://localhost/e-commerce/src/backend/productCardData.php'); // Fetch all products data
    if (response.status !== 200) {
      throw new Error('Failed to fetch products data'); // Throw an error if the response is not OK
    }
  
    const selectedProduct = response.data.products.find((product) => product.id === parseInt(id));
    if (!selectedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
  
    return selectedProduct; // Return the selected product
};


///////////// FETCH ///////////////////// Orders PAGE ///////////// FETCH /////////////////////

// Fetch Order Details by ID
export const fetchOrderDetailsById = async (orderID) => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/orderDetails.php');
    const order = response.data.find(order => order.orderID === orderID);
    return order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Fetch Order History Data
export const fetchOrderHistory = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/orders.php');
    return response.data; // Return the order history data
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

// Fetch Order Track by ID
export const fetchOrderTrackById = async (orderID) => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/orderHistory.php');
    const order = response.data.find(order => order.orderID === orderID);
    return order ? order.steps : null; // Return the order steps if found
  } catch (error) {
    console.error('Error fetching order track:', error);
    throw error;
  }
};


///////////// FETCH ///////////////////// CHECKOUT PAGE ///////////// FETCH /////////////////////

// Fetch Form Fields Data
export const fetchFormFields = async () => {
  try {
    const response = await axios.get('/data/client/formFields.json');
    return response.data; // Return the form fields data
  } catch (error) {
    console.error('Error fetching form fields:', error);
    throw error;
  }
};

// Fetch Payment Methods Data
export const fetchPaymentMethods = async () => {
  try {
    const response = await axios.get('/data/client/paymentMethods.json');
    return response.data; // Return the payment methods data
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Fetch Delivery Methods Data
export const fetchDeliveryMethods = async () => {
  try {
    const response = await axios.get('/data/client/deliveryMethods.json');
    return response.data; // Return the delivery methods data
  } catch (error) {
    console.error('Error fetching delivery methods:', error);
    throw error;
  }
};


///////////// POST ///////////////////// PURCHASE PAGE ///////////// POST /////////////////////

// submitOrder function in the API file
export const submitOrder = async (payload) => {
  console.log(payload);
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/submitOrder.php', payload);
    if (response.status !== 200) {
      throw new Error('Failed to submit order');
    }
    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error while submitting order:', error);
    throw error; // Propagate the error to the calling function
  }
};
