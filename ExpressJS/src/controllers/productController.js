const { getProducts } = require("../services/productService");

const getAllProducts = async (req, res, next) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const data = await getProducts(category, page, limit);
        return res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllProducts };