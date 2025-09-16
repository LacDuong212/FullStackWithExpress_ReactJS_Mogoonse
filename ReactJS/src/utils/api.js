import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
};

const forgotPasswordApi = (email, newPassword) => {
    const URL_API = "/v1/api/forgot-password";
    const data = { email, newPassword };
    return axios.post(URL_API, data);
};

const getProductsApi = (category, page = 1, limit = 10) => {
    let URL_API = `/v1/api/product?page=${page}&limit=${limit}`;
    if (category && category.trim() !== "") {
        URL_API += `&category=${encodeURIComponent(category)}`;
    }
    return axios.get(URL_API);
};

const searchProductsApi = ({ keyword, category, priceRange, sortPrice, page = 1, limit = 10 }) => {
    let URL_API = `/v1/api/search?page=${page}&limit=${limit}`;
    if (keyword && keyword.trim() !== "") {
        URL_API += `&keyword=${encodeURIComponent(keyword)}`;
    }
    if (category && category.trim() !== "") {
        URL_API += `&category=${encodeURIComponent(category)}`;
    }
    if (priceRange) {
        URL_API += `&priceRange=${priceRange}`;
    }
    if (sortPrice) {
        URL_API += `&sortPrice=${sortPrice}`;
    }
    return axios.get(URL_API);
};

// Product detail API
const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/product/${id}`;
    return axios.get(URL_API);
};

const getProductStatsApi = (id) => {
    const URL_API = `/v1/api/product/${id}/stats`;
    return axios.get(URL_API);
};

// User interaction APIs
const getViewedProductsApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/user/viewed-products?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

const getFavoriteProductsApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/user/favorite-products?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

const toggleFavoriteApi = (productId) => {
    const URL_API = `/v1/api/product/${productId}/favorite`;
    return axios.post(URL_API);
};

// Review APIs
const getProductReviewsApi = (productId, page = 1, limit = 10, rating, sortBy = 'newest') => {
    let URL_API = `/v1/api/product/${productId}/reviews?page=${page}&limit=${limit}&sortBy=${sortBy}`;
    if (rating) {
        URL_API += `&rating=${rating}`;
    }
    return axios.get(URL_API);
};

const createReviewApi = (productId, rating, comment, images = []) => {
    const URL_API = `/v1/api/product/${productId}/review`;
    const data = { rating, comment, images };
    return axios.post(URL_API, data);
};

const updateReviewApi = (reviewId, rating, comment, images = []) => {
    const URL_API = `/v1/api/review/${reviewId}`;
    const data = { rating, comment, images };
    return axios.put(URL_API, data);
};

const deleteReviewApi = (reviewId) => {
    const URL_API = `/v1/api/review/${reviewId}`;
    return axios.delete(URL_API);
};

const markReviewHelpfulApi = (reviewId) => {
    const URL_API = `/v1/api/review/${reviewId}/helpful`;
    return axios.post(URL_API);
};

const getUserReviewsApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/user/reviews?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

export {
    createUserApi,
    loginApi,
    getUserApi,
    forgotPasswordApi,
    getProductsApi,
    searchProductsApi,
    getProductByIdApi,
    getProductStatsApi,
    getViewedProductsApi,
    getFavoriteProductsApi,
    toggleFavoriteApi,
    getProductReviewsApi,
    createReviewApi,
    updateReviewApi,
    deleteReviewApi,
    markReviewHelpfulApi,
    getUserReviewsApi
};
