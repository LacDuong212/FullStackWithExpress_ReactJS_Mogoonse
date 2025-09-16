const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: String,
    description: String,
    // Thống kê sản phẩm
    viewCount: {
        type: Number,
        default: 0
    },
    favoriteCount: {
        type: Number,
        default: 0
    },
    purchaseCount: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    // Tags để tìm sản phẩm tương tự
    tags: [String],
    // Thông tin bổ sung
    brand: String,
    stock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index để tối ưu tìm kiếm
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model("Product", productSchema);
