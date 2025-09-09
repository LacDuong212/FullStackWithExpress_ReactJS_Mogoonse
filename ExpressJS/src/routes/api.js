const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleForgotPassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { getAllProducts } = require("../controllers/productController");
const { search } = require("../controllers/searchController");

const routerAPI = express.Router();

routerAPI.get("/product", getAllProducts);
routerAPI.get("/search", search);


routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello worl api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", handleForgotPassword);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;