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
    const response = await axios.get('/data/admin/productTableData.json'); 
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
    const response = await axios.get('/data/admin/ordersTableData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order table data');
  }
};


///////////// POST ///////////////////// Orders TABLE ///////////// POST /////////////////////

// Post a new order Status
export const postOrderStatus = async (newOrderStatus) => {
  try {
    const response = await axios.post('/api/orderStatus', newOrderStatus); 
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
    const response = await axios.get('/data/admin/clientsTableData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching client table data');
  }
};


///////////// POST ///////////////////// Client TABLE ///////////// POST /////////////////////

// Post client data updates
export const postClientUpdates = async (newdata) => {
  try {
    const response = await axios.post('/api/clientUpdates', newdata); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new client updates');
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
    const response = await axios.get('/data/admin/scentsTableData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching scent table data');
  }
};


///////////// POST ///////////////////// Scent TABLE ///////////// POST /////////////////////

// Post scent data updates
export const postScentUpdates = async (newdata) => {
  try {
    const response = await axios.post('/api/scentUpdates', newdata); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new scent updates');
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
    const response = await axios.get('/data/admin/categoryTableData.json'); 
    return response.data;
  } catch (error) {
    throw new Error('Error fetching category table data');
  }
};


///////////// POST ///////////////////// Category TABLE ///////////// POST /////////////////////

// Post category data updates
export const postCategoryUpdates = async (newdata) => {
  try {
    const response = await axios.post('/api/categoryUpdates', newdata); 
    return response.data;
  } catch (error) {
    throw new Error('Error adding new category updates');
  }
};