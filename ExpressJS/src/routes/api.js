const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleForgotPassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { 
    getAllProducts, 
    getProductById, 
    getViewedProducts, 
    getFavoriteProducts, 
    toggleFavorite, 
    getProductStats 
} = require("../controllers/productController");
const { 
    createReview, 
    getProductReviews, 
    updateReview, 
    deleteReview, 
    markReviewHelpful, 
    getUserReviews 
} = require("../controllers/reviewController");
const { search } = require("../controllers/searchController");

const routerAPI = express.Router();

// Public routes
routerAPI.get("/product", getAllProducts);
routerAPI.get("/product/:id", getProductById);
routerAPI.get("/product/:id/stats", getProductStats);
routerAPI.get("/product/:productId/reviews", getProductReviews);
routerAPI.get("/search", search);

// Protected routes
routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

// User routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", handleForgotPassword);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Product interaction routes
routerAPI.get("/user/viewed-products", getViewedProducts);
routerAPI.get("/user/favorite-products", getFavoriteProducts);
routerAPI.post("/product/:productId/favorite", toggleFavorite);

// Review routes
routerAPI.post("/product/:productId/review", createReview);
routerAPI.put("/review/:reviewId", updateReview);
routerAPI.delete("/review/:reviewId", deleteReview);
routerAPI.post("/review/:reviewId/helpful", markReviewHelpful);
routerAPI.get("/user/reviews", getUserReviews);

module.exports = routerAPI;