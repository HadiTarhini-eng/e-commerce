import { fetchData, postData } from './apiHandler';

// Fetch Carousel Data
export const fetchCarouselData = async () => {
    return await fetchData('getCarouselData');
};

// Fetch Categories Data (for Home page)
export const fetchCategoriesData = async () => {
  const page = 'Home';
  return await fetchData('getCategoriesHomeData', { page });
};

// Fetch Categories Data (for Payment page)
export const fetchCategoriesDataForPayment = async () => {
  const page = 'Payment';
  return await fetchData('getCategoriesPaymentData', { page });
};

// Fetch Products Data
export const fetchProductsData = async () => {
    return await fetchData('getProductsData');
};

// Fetch Ads Data
export const fetchAdsData = async () => {
    return await fetchData('getAdsData');
};

// Fetch Product by ID
export const fetchProductById = async (id) => {
    return await fetchData('getProductById', { id });
};

// POST Request to submit the order (personal info + cart data)
export const submitOrder = async (payload) => {
    return await postData('submitOrder', payload);
};
