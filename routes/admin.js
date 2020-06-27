const path = require('path');
const { body } = require('express-validator/check');
const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();
const isAuth = require("../middleware/is-auth");
// // /admin/add-product => GET
router.get('/add-product',isAuth, productsController.getAddProduct);

// // /admin/add-product => POST
// router.post('/add-product',isAuth, productsController.postAddProduct);
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
     
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    productsController.postAddProduct
  );




router.get('/edit-product/:productId', isAuth,productsController.getEditProduct);

//  router.post('/edit-product', isAuth,productsController.postEditProduct);
router.post(
    '/edit-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    productsController.postEditProduct
  );






  router.delete('/product/:productId',productsController.postDeleteProduct);


router.get('/reset',productsController.getReset);
module.exports = router;
