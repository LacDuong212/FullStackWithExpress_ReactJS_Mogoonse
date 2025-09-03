const Product = require("../models/product");

const getProducts = async (category, page = 1, limit = 10) => {
    const query = category ? {category} : {}

    const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    return {
        products,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total/ limit),
            totalItems: total
        }
    }
}

module.exports = { getProducts }