const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    // Trạng thái review
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    // Thông tin bổ sung
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    // Ảnh đính kèm
    images: [String],
    // Reply từ admin/seller
    reply: {
        content: String,
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        repliedAt: Date
    }
}, {
    timestamps: true
});

// Index để tối ưu truy vấn
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Một user chỉ review một lần cho mỗi sản phẩm
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Virtual để tính điểm trung bình
reviewSchema.virtual('product', {
    ref: 'Product',
    localField: 'productId',
    foreignField: '_id',
    justOne: true
});

reviewSchema.virtual('user', {
    ref: 'user',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Review', reviewSchema);
