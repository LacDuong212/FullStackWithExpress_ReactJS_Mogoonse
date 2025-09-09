const esClient = require("../config/elasticSearch");

const searchProducts = async ({ keyword, category, priceRange, sortPrice, page = 1, limit = 10 }) => {
  const must = [];
  const filter = [];

  // 🔎 Tìm theo tên (fuzzy search)
  if (keyword) {
    must.push({
      match: {
        name: {
          query: keyword,
          fuzziness: "AUTO"
        }
      }
    });
  }

  // 📂 Lọc theo danh mục
  if (category) {
    filter.push({ term: { category } });
  }

  // 💰 Lọc theo khoảng giá
  if (priceRange) {
    let range = {};
    switch (priceRange) {
      case "100":
        range = { lte: 100000 };
        break;
      case "200":
        range = { lte: 200000 };
        break;
      case "500":
        range = { lte: 500000 };
        break;
      case "1000":
        range = { lte: 1000000 };
        break;
      case "2000":
        range = { lte: 2000000 };
        break;
    }
    if (Object.keys(range).length > 0) {
      filter.push({ range: { price: range } });
    }
  }

  // ↕️ Sắp xếp theo giá
  let sort = [];
  if (sortPrice === "asc") {
    sort.push({ price: { order: "asc" } });
  } else if (sortPrice === "desc") {
    sort.push({ price: { order: "desc" } });
  }

  const from = (page - 1) * limit;

  // ✅ Không destructure { body } nữa
  const response = await esClient.search({
    index: "products",
    from,
    size: limit,
    sort,
    query: {
      bool: {
        must,
        filter
      }
    }
  });

  // Tránh lỗi undefined
  const hits = response.hits?.hits || [];

  return hits.map(hit => ({
    id: hit._id,
    ...hit._source
  }));
};

module.exports = { searchProducts };
