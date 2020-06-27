// const path = require('path');

const express = require('express');

const productsController = require(`../controllers/products`);
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products', productsController.getProducts);
router.get('/products/:productID', productsController.getProduct);
router.get('/cart',isAuth, productsController.getCart);
router.post('/cart',isAuth, productsController.postCart)
router.post('/cart-delete-item',isAuth,productsController.postCartDeleteProduct);

// router.get('/orders', productsController.getOrders);
// router.post('/create-order', productsController.postOrder);



module.exports = router;
