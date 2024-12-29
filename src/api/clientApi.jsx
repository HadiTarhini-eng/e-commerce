
import axios from "axios";

///////////// FETCH ///////////////////// HOME PAGE ///////////// FETCH /////////////////////

// Fetch Carousel Data
export const fetchCarouselData = async () => {
    const carouselResponse = await axios.get('http://localhost/e-commerce/public/backend/client/carousel.php');
    const carouselJson = carouselResponse.data.carousels;
    return carouselJson;
};

// Fetch Categories Data based on the current page
export const fetchCategoriesData = async (page) => {
    let url = '';

    if (page === 'Home') {
        url = 'http://localhost/e-commerce/public/backend/client/categoryData.php';
    } else if (page === 'Payment') {
        url = 'http://localhost/e-commerce/public/backend/client/paymentTypeData.php';
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
export const fetchProductsData = async (userId) => {
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/productCardData.php', {
      params: { userId }
    }); // Fetch the product data
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

// Fetch Product by ID with userId
export const fetchProductById = async (id, userId) => {
  const response = await axios.get('http://localhost/e-commerce/public/backend/client/productCardData.php', {
    params: { id, userId }
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch products data');
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
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/orderDetails.php',{
      params: { orderID }
    });
    const order = response.data.find(order => order.orderID === orderID);
    return order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Fetch Order History Data with userId
export const fetchOrderHistory = async (userId) => {
  try {
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/orders.php', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw new Error('Failed to fetch order data');
  }
};

// Fetch Order Track Step
export const fetchOrderTrackSteps = async () => {
  try {
    const response = await axios.get('/data/client/trackingSteps.json');
    return response.data; // Return the order history data
  } catch (error) {
    console.error('Error fetching track steps:', error);
    throw error;
  }
};

// Fetch Order Track by ID
export const fetchOrderTrackById = async (orderID) => {
  try {
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/orderHistory.php',{
      params: { orderID }
    });
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

// Fetch delivery threshold
export const fetchDeliveryThreshold = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/deliveryThreshold.php');
    return response.data; // Return the delivery threshold data
  } catch (error) {
    console.error('Error fetching delivery threshold:', error);
    throw error;
  }
}

// Fetch user data
export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get('/data/client/userDetailsData.json');
    return response.data; // Return the user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// fetch visa card status
export const fetchVisaCardStatus = async () => {
  try {
    const response = await axios.get('/data/client/visaCardStatus.json');
    return response.data; // Return the visa card status
  } catch (error) {
    console.error('Error fetching visa card status:', error);
    throw error;
  }
}

///////////// POST ///////////////////// PURCHASE PAGE ///////////// POST /////////////////////

// submitOrder function in the API file
export const submitOrder = async (payload) => {
  console.log(payload);  // Debugging: check the payload
  try {
    const response = await axios.post('http://localhost/e-commerce/public/backend/client/submitOrder.php', payload);
    if (response.status !== 200) {
      throw new Error('Failed to submit order');
    }
    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error while submitting order:', error);
    throw error; // Propagate the error to the calling function
  }
};


///////////// POST ///////////////////// USERS PAGE ///////////// POST /////////////////////

// Updated postSignInData function
export const postSignInData = async (credentials) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/public/backend/client/signIn.php', credentials);
    if (response.status !== 200) {
      throw new Error('Failed to sign in');
    }
    // Check if the response status is 'success' and return user data
    if (response.status ===200) {
      return response.data.user; // Return the user details (id, full_name, phone, user_type)
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

// Post Signup Data (simulating an API call to sign up a user)
export const postSignUpData = async (userData) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/public/backend/client/signUp.php', userData); //edit this as you like
    if (response.status !== 200) {
      throw new Error('Failed to sign up');
    }
    return response.data; // Return the response (mocking success)
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error; // Propagate the error
  }
};


///////////// POST ///////////////////// FAVORITE ///////////// POST /////////////////////

// Post Favorite Status Data (send product id and favorite status to backend)
export const toggleFavoriteStatus = async (userId, productId, favoriteStatus) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/public/backend/client/favoriteStatus.php', {
      userId, // Send userId along with productId and favoriteStatus
      productId,
      favoriteStatus,
    });

    if (response.status !== 200) {
      throw new Error('Failed to update favorite status');
    }

    return response.data; // Return the response from the server (could be a success message or updated data)
  } catch (error) {
    console.error('Error while updating favorite status:', error);
    throw error; // Propagate the error to the calling function
  }
};


///////////// POST ///////////////////// REVIEW ///////////// POST /////////////////////

// Submit Review Data (send product id and review details to backend)
export const submitReview = async (productId, reviewData) => {
  try {
    // Send the productId, review data, and userId to the backend
    const response = await axios.post('http://localhost/e-commerce/public/backend/client/submitReview.php', {
      productId,
      comment: reviewData.comment,
      date: reviewData.date,
      userId: reviewData.userId
    });

    if (response.status !== 200) {
      throw new Error('Failed to submit review');
    }

    return response.data; // Return the response from the server (could be success message or review data)
  } catch (error) {
    console.error('Error while submitting review:', error);
    throw error; // Propagate the error to the calling function
  }
};


///////////// FETCH ///////////////////// PRODUCT PAGE ///////////// FETCH /////////////////////

// Fetch Product by ID with userId
export const fetchOrderNumber = async (userId) => {
  const response = await axios.get('http://localhost/e-commerce/public/backend/client/nbOfOrders.php', {
    params: { userId }
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch order number');
  }

  return response.data; // Return the order number
};

// fetch first offer data
export const fetchFirstOrderOffer = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/public/backend/client/firstOffer.php');
    return response.data; // Return the first offer data
  } catch (error) {
    console.error('Error fetching first offer:', error);
    throw error;
  }
}