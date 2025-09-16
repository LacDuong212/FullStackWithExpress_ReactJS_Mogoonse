const Review = require("../models/review");
const Product = require("../models/product");
const UserInteraction = require("../models/userInteraction");

// Tạo review mới
const createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, rating, comment, images } = req.body;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Kiểm tra đã review chưa
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá sản phẩm này rồi"
            });
        }

        // Kiểm tra đã mua sản phẩm chưa (optional)
        const purchaseRecord = await UserInteraction.findOne({
            userId,
            productId,
            interactionType: 'purchase'
        });

        // Tạo review
        const review = await Review.create({
            userId,
            productId,
            rating,
            comment,
            images: images || [],
            isVerifiedPurchase: !!purchaseRecord
        });

        // Cập nhật thống kê sản phẩm
        await updateProductReviewStats(productId);

        return res.status(201).json({
            success: true,
            message: "Đánh giá đã được gửi thành công",
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách review của sản phẩm
const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

        const skip = (page - 1) * limit;
        const query = { productId, status: 'approved' };

        // Filter theo rating
        if (rating) {
            query.rating = parseInt(rating);
        }

        // Sort options
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'highest':
                sort = { rating: -1 };
                break;
            case 'lowest':
                sort = { rating: 1 };
                break;
            case 'helpful':
                sort = { helpfulCount: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const [reviews, totalReviews] = await Promise.all([
            Review.find(query)
                .populate('userId', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Review.countDocuments(query)
        ]);

        // Tính thống kê rating
        const ratingStats = await Review.aggregate([
            { $match: { productId: productId, status: 'approved' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ]);

        const ratingDistribution = {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        };

        ratingStats.forEach(stat => {
            ratingDistribution[stat._id] = stat.count;
        });

        return res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                },
                ratingDistribution
            }
        });
    } catch (error) {
        next(error);
    }
};

// Cập nhật review
const updateReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;
        const { rating, comment, images } = req.body;

        const review = await Review.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review không tồn tại hoặc bạn không có quyền chỉnh sửa"
            });
        }

        // Cập nhật review
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { rating, comment, images: images || [] },
            { new: true }
        );

        // Cập nhật thống kê sản phẩm
        await updateProductReviewStats(review.productId);

        return res.status(200).json({
            success: true,
            message: "Review đã được cập nhật",
            data: updatedReview
        });
    } catch (error) {
        next(error);
    }
};

// Xóa review
const deleteReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;

        const review = await Review.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review không tồn tại hoặc bạn không có quyền xóa"
            });
        }

        await Review.findByIdAndDelete(reviewId);

        // Cập nhật thống kê sản phẩm
        await updateProductReviewStats(review.productId);

        return res.status(200).json({
            success: true,
            message: "Review đã được xóa"
        });
    } catch (error) {
        next(error);
    }
};

// Đánh dấu review hữu ích
const markReviewHelpful = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review không tồn tại"
            });
        }

        // Tăng helpful count
        await Review.findByIdAndUpdate(reviewId, { $inc: { helpfulCount: 1 } });

        return res.status(200).json({
            success: true,
            message: "Đã đánh dấu review hữu ích"
        });
    } catch (error) {
        next(error);
    }
};

// Lấy review của user
const getUserReviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const [reviews, totalReviews] = await Promise.all([
            Review.find({ userId })
                .populate('productId', 'name image price')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ userId })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Hàm helper: Cập nhật thống kê review của sản phẩm
const updateProductReviewStats = async (productId) => {
    try {
        const reviews = await Review.find({ productId, status: 'approved' });
        
        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                reviewCount: 0,
                averageRating: 0
            });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            reviewCount: reviews.length,
            averageRating: Math.round(averageRating * 10) / 10 // Làm tròn 1 chữ số thập phân
        });
    } catch (error) {
        console.error('Error updating product review stats:', error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getUserReviews
};
