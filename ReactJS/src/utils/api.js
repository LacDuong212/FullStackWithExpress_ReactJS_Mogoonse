import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }

    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const forgotPasswordApi = (email, newPassword) => {
    const URL_API = "/v1/api/forgot-password";
    const data = {
        email, newPassword
    }
    return axios.post(URL_API, data);
}

const getProductsApi = (category, page = 1, limit = 10) => {
    let URL_API = `/v1/api/product?page=${page}&limit=${limit}`;
    if (category && category.trim() !== "") {
        URL_API += `&category=${encodeURIComponent(category)}`;
    }
    return axios.get(URL_API);
};

export {
    createUserApi, loginApi, getUserApi, forgotPasswordApi, getProductsApi
}