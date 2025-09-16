const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
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
    // Loại tương tác: 'view', 'favorite', 'purchase'
    interactionType: {
        type: String,
        enum: ['view', 'favorite', 'purchase'],
        required: true
    },
    // Thời gian tương tác
    interactedAt: {
        type: Date,
        default: Date.now
    },
    // Metadata bổ sung
    metadata: {
        // Cho view: thời gian xem, trang xem
        viewDuration: Number, // seconds
        pageSource: String,
        // Cho purchase: số lượng, giá
        quantity: Number,
        purchasePrice: Number
    }
}, {
    timestamps: true
});

// Index để tối ưu truy vấn
userInteractionSchema.index({ userId: 1, productId: 1, interactionType: 1 });
userInteractionSchema.index({ userId: 1, interactionType: 1, interactedAt: -1 });
userInteractionSchema.index({ productId: 1, interactionType: 1 });

// Compound index để tránh duplicate
userInteractionSchema.index({ userId: 1, productId: 1, interactionType: 1 }, { unique: true });

module.exports = mongoose.model('UserInteraction', userInteractionSchema);
