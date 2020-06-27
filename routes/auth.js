const express = require("express");

const productsController = require("../controllers/products");
const User = require("../models/users");
const router = express.Router();
const {check,body} = require("express-validator/check");

router.get('/login',productsController.getAuth);
router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
      body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    productsController.postAuth
  );

router.post('/logout',productsController.logOut);

router.get('/signup',productsController.getSignup);
// router.post('/signup',check("email").isEmail().withMessage("Please enter a valid email"),productsController.postSignup);
router.get('/reset',productsController.getReset);


router.post(
    '/signup',
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          // if (value === 'test@test.com') {
          //   throw new Error('This email address if forbidden.');
          // }
          // return true;
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        })
        .normalizeEmail(),
      body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
      )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
      body('confirmPassword').trim().custom((value, { req }) => {
       
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
    ],
    productsController.postSignup
  );







router.post('/reset',productsController.postReset);
router.get('/reset/:token',productsController.getNewPassword);
router.post('/new-password',productsController.postNewPassword);
module.exports = router;