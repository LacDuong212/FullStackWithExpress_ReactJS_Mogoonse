const Product = require("../models/product");
const esClient = require("../config/elasticSearch");

// ✅ Hàm tạo index nếu chưa tồn tại
const createIndexIfNotExists = async () => {
  const exists = await esClient.indices.exists({ index: "products" });
  if (!exists) {
    await esClient.indices.create({
      index: "products",
      body: {
        mappings: {
          properties: {
            name: { type: "text" },          // cho phép search fuzzy
            category: { type: "keyword" },   // filter theo category
            price: { type: "float" },        // filter / sort theo giá
            image: { type: "text", index: false } // chỉ lưu, không cần search
          }
        }
      }
    });
    console.log("📦 Đã tạo index products");
  }
};

// ✅ Hàm sync dữ liệu từ MongoDB sang Elasticsearch
const syncProducts = async () => {
  await createIndexIfNotExists(); // kiểm tra và tạo index nếu cần

  const products = await Product.find({});
  for (let p of products) {
    await esClient.index({
      index: "products",
      id: p._id.toString(),
      body: {
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image
      },
      refresh: true  // đảm bảo search được ngay sau khi sync
    });
  }
  console.log("✅ Sync xong sản phẩm từ MongoDB sang Elasticsearch");
};

module.exports = syncProducts;
