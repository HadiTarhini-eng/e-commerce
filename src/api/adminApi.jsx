import axios from "axios";

///////////// FETCH ///////////////////// SIDENAV ///////////// FETCH /////////////////////

// Fetch Navbar Data
export const fetchNavbarData = async () => {
  try {
    const response = await axios.get('/data/admin/navbarData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching navbar data');
  }
};
  
// Fetch Sidebar Data
export const fetchSidebarData = async () => {
  try {
      const response = await axios.get('/data/admin/sidebarData.json'); 
      return response.data;
  } catch (error) {
      throw new Error('Error fetching sidebar data');
  }
};


///////////// FETCH ///////////////////// DASHBOARD ///////////// FETCH /////////////////////

// Fetch Card Data
export const fetchCardData = async () => {
  try {
    const response = await axios.get('/data/admin/cardData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching card data');
  }
};


///////////// FETCH ///////////////////// PRODUCTS TABLE ///////////// FETCH /////////////////////
  
// Fetch Product Table Data
export const fetchProductColumnData = async () => {
  try {
    const response = await axios.get('/data/admin/productColumns.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product columns');
  }
};  

// Fetch Product Table Data
export const fetchProductTableData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/productTableData.php'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product table data');
  }
};  

// Fetch Product Table Data
export const fetchCategoryOptions = async () => {
  try {
    const response = await axios.get('/data/categoryData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching category options data');
  }
};


///////////// POST ///////////////////// PRODUCTS TABLE ///////////// POST /////////////////////

// Post a new product
export const postProduct = async (newProduct) => {
  try {
    const response = await axios.post('/api/products', newProduct); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new product');
  }
};

// Deleet product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete('/api/product/', productId );
    return response.data; // Handle success response (optional)
  } catch (error) {
    throw new Error('Error deleting productId');
  }
};


///////////// FETCH ///////////////////// Orders TABLE ///////////// FETCH /////////////////////
  
// Fetch Orders Table Data
export const fetchOrdersColumnData = async () => {
  try {
    const response = await axios.get('/data/admin/ordersColumns.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order columns');
  }
};  

// Fetch Orders Table Data
export const fetchOrdersTableData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/ordersTableData.php'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order table data');
  }
};

// Fetch Orders Table Data
export const fetchStatusOptions = async () => {
  try {
    const response = await axios.get('/data/orderStatus.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order table data');
  }
};


///////////// POST ///////////////////// Orders TABLE ///////////// POST /////////////////////

// Post a new order Status
export const postOrderStatus = async (newOrderStatus) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/updateStatus.php', newOrderStatus); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new order status');
  }
};


///////////// FETCH ///////////////////// Client TABLE ///////////// FETCH /////////////////////
  
// Fetch Clients Table Data
export const fetchClientsColumnData = async () => {
  try {
    const response = await axios.get('/data/admin/clientsColumns.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching client columns');
  }
};  

// Fetch Clients Table Data
export const fetchClientsTableData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/clientsTableData.php'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching client table data');
  }
};


///////////// POST ///////////////////// Client TABLE ///////////// POST /////////////////////

// Post client data updates
export const postClientDelete = async (clientId) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/deleteClient.php', clientId); 
    return response.data;
  } catch (error) {
    throw new Error('Error deleting client');
  }
};


///////////// FETCH ///////////////////// Scent TABLE ///////////// FETCH /////////////////////
  
// Fetch Scents Table Data
export const fetchScentsColumnData = async () => {
  try {
    const response = await axios.get('/data/admin/scentsColumns.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching scent columns');
  }
};  

// Fetch Scents Table Data
export const fetchScentsTableData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/scentsTableData.php'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching scent table data');
  }
};


///////////// POST ///////////////////// Scent TABLE ///////////// POST /////////////////////

// Post scent updates
export const postScentUpdates = async (updatedScent) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/updateScent.php', updatedScent);
    return response.data;
  } catch (error) {
    throw new Error('Error updating scent');
  }
};

// Post add new scent
export const addScent = async (newScent) => {
  try {
    const response = await fetch('http://localhost/e-commerce/src/backend/admin/addScent.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newScent),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding scent:', error);
    throw error;
  }
};

// Post delete scent
export const deleteScent = async (scentId) => {
  try {
    const response = await axios.delete('/api/scents/', scentId );
    return response.data; // Handle success response (optional)
  } catch (error) {
    throw new Error('Error deleting scent');
  }
};


///////////// FETCH ///////////////////// Category TABLE ///////////// FETCH /////////////////////
  
// Fetch Category Table Data
export const fetchCategoryColumnData = async () => {
  try {
    const response = await axios.get('/data/admin/categoryColumns.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching category columns');
  }
};  

// Fetch Category Table Data
export const fetchCategoryTableData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/categoryTableData.php'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching category table data');
  }
};


///////////// POST ///////////////////// Category TABLE ///////////// POST /////////////////////

// Post category data updates
export const postCategoryUpdates = async (newdata) => {
  try {
    const formData = new FormData();
    
    // Append the regular data to the FormData object
    formData.append('id', newdata.id);
    formData.append('name', newdata.name);

    // Append the file to FormData, ensure you're appending the file object correctly
    if (newdata.image) {
      formData.append('image', newdata.image);  // image is the File object
    }

    // Send the request with the FormData
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/updateCategory.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the request is treated as a file upload
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Error adding new category updates: ' + error.message);
  }
};

// Post add category
export const addCategory = async (newdata) => {
  try {
    const response = await axios.post('/api/categoryUpdates', newdata); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new category');
  }
};

// Post delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/deleteCategory.php', categoryId );
    return response.data; 
  } catch (error) {
    throw new Error('Error deleting category');
  }
};


///////////// FETCH ///////////////////// Discount Settings ///////////// FETCH /////////////////////

// Fetch Discount Settings
export const fetchDiscountSettings = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/discountSettings.php'); // Replace with actual API URL
    return response.data; // Assume data structure { firstOrderDiscount, freeDelivery, deliveryThreshold }
  } catch (error) {
    throw new Error('Error fetching discount settings');
  }
};


///////////// POST ///////////////////// Discount Settings ///////////// POST /////////////////////

// Post Discount Settings
export const postDiscountSettings = async (settings) => {
  try {
    const response = await axios.post('http://localhost/e-commerce/src/backend/admin/updateDiscountSettings.php', settings); // Replace with actual API URL
    return response.data;
  } catch (error) {
    throw new Error('Error saving discount settings');
  }
};


///////////// FETCH ///////////////////// Carousel Data ///////////// FETCH /////////////////////

// Fetch Carousel Data
export const fetchCarouselData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/carouselData.php');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching carousel data');
  }
};

// Fetch Product Data
export const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/productsData.php'); // Assuming this returns product list with id and name
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product data');
  }
};


///////////// POST ///////////////////// Carousel Data ///////////// POST /////////////////////

// Save Carousel Data
export const saveCarouselData = async (carouselData) => {
  try {
    const response = await axios.post('/api/save-carousel', carouselData);
    return response.data;
  } catch (error) {
    throw new Error('Error saving carousel data');
  }
};


///////////// FETCH ///////////////////// Order Summary ///////////// FETCH /////////////////////

// Fetch Order Summary Data
export const fetchOrderSummaryData = async () => {
  try {
    const response = await axios.get('http://localhost/e-commerce/src/backend/admin/orderSummary.php');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order summary data');
  }
};


///////////// FETCH ///////////////////// BADGE ///////////// FETCH /////////////////////

// Fetch Order Status Data
export const fetchStatusData = async () => {
  try {
    const response = await axios.get('/data/orderStatus.json'); // Use axios to fetch the status data
    return response.data; // Return the fetched data
  } catch (error) {
    throw new Error('Error fetching status data'); // Handle error
  }
};


///////////// FETCH ///////////////////// Product Details ///////////// FETCH /////////////////////

export const fetchProductData = async (productId) => {
  try {
    const response = await axios.get('/data/admin/productDetails.json');  // Adjust the path based on your project setup
    const products = response.data; // The products from the JSON file

    // Find the product based on the productId
    const product = products.find(p => p.id === productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return product; // Return the found product data
  } catch (error) {
    console.error('Error fetching product data', error);
    throw new Error('Error fetching product data');
  }
};
