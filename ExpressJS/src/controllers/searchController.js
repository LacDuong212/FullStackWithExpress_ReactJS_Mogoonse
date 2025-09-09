const { searchProducts } = require("../services/searchService");

const search = async (req, res) => {
  try {
    const { keyword, category, priceRange, sortPrice, page = 1, limit = 10 } = req.query;
    const results = await searchProducts({ keyword, category, priceRange, sortPrice, page, limit });

    // Return same structure as getProducts API
    res.json({
      success: true,
      data: {
        products: results,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(results.length / Number(limit)),
          totalItems: results.length
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error searching products"
    });
  }
};

module.exports = { search };
