const { getProducts } = require("../services/productService");
const Product = require("../models/product");
const UserInteraction = require("../models/userInteraction");
const Review = require("../models/review");

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

// Lấy chi tiết sản phẩm và tăng view count
// 
const getProductById = async (req, res, next) => {
    console.log("u<<<<<<<<");
    try {
        const id = req.params.id;
        const userId = req.user?.id;

        // Lấy thông tin sản phẩm
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }
        console.log("uihuhhuudhudhuudiiiiiii<<<<<<<<<");

        // Tăng view count nếu user đã đăng nhập
        if (userId) {
            await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
            
            // Lưu interaction
            await UserInteraction.findOneAndUpdate(
                { userId, productId: id, interactionType: 'view' },
                { 
                    userId,
                    productId: id,
                    interactionType: 'view',
                    interactedAt: new Date()
                },
                { upsert: true }
            );
        }

        // Lấy thông tin bổ sung
        const [reviews, similarProducts] = await Promise.all([
            Review.find({ productId: id, status: 'approved' })
                .populate('userId', 'name')
                .sort({ createdAt: -1 })
                .limit(5),
            getSimilarProducts(id, product.category, product.tags)
        ]);

        return res.status(200).json({
            success: true,
            data: {
                product,
                reviews,
                similarProducts
            }
        });
    } catch (error) {
        next(error);
    }
};

// Lấy sản phẩm tương tự
const getSimilarProducts = async (productId, category, tags) => {
    try {
        const query = {
            _id: { $ne: productId },
            isActive: true
        };

        // Tìm sản phẩm cùng category hoặc có tags tương tự
        if (category) {
            query.$or = [
                { category },
                { tags: { $in: tags || [] } }
            ];
        }

        return await Product.find(query)
            .sort({ favoriteCount: -1, viewCount: -1 })
            .limit(6);
    } catch (error) {
        console.error('Error getting similar products:', error);
        return [];
    }
};

// Lấy sản phẩm đã xem
const getViewedProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const interactions = await UserInteraction.find({
            userId,
            interactionType: 'view'
        })
        .populate('productId')
        .sort({ interactedAt: -1 })
        .skip(skip)
        .limit(limit);

        const products = interactions
            .map(interaction => interaction.productId)
            .filter(product => product && product.isActive);

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Lấy sản phẩm yêu thích
const getFavoriteProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const interactions = await UserInteraction.find({
            userId,
            interactionType: 'favorite'
        })
        .populate('productId')
        .sort({ interactedAt: -1 })
        .skip(skip)
        .limit(limit);

        const products = interactions
            .map(interaction => interaction.productId)
            .filter(product => product && product.isActive);

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Thêm/xóa sản phẩm yêu thích
const toggleFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Kiểm tra đã yêu thích chưa
        const existingFavorite = await UserInteraction.findOne({
            userId,
            productId,
            interactionType: 'favorite'
        });

        if (existingFavorite) {
            // Xóa khỏi yêu thích
            await UserInteraction.findByIdAndDelete(existingFavorite._id);
            await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: -1 } });
            
            return res.status(200).json({
                success: true,
                message: "Đã xóa khỏi danh sách yêu thích",
                isFavorite: false
            });
        } else {
            // Thêm vào yêu thích
            await UserInteraction.create({
                userId,
                productId,
                interactionType: 'favorite'
            });
            await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: 1 } });
            
            return res.status(200).json({
                success: true,
                message: "Đã thêm vào danh sách yêu thích",
                isFavorite: true
            });
        }
    } catch (error) {
        next(error);
    }
};

// Lấy thống kê sản phẩm
const getProductStats = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [product, reviews, interactions] = await Promise.all([
            Product.findById(id),
            Review.find({ productId: id, status: 'approved' }),
            UserInteraction.find({ productId: id })
        ]);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        const stats = {
            viewCount: product.viewCount,
            favoriteCount: product.favoriteCount,
            purchaseCount: product.purchaseCount,
            reviewCount: reviews.length,
            averageRating: product.averageRating,
            ratingDistribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length
            }
        };

        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getAllProducts, 
    getProductById, 
    getViewedProducts, 
    getFavoriteProducts, 
    toggleFavorite, 
    getProductStats 
};