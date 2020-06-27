const express = require("express");
const router = express.Router();
const path = require("path");
const rew = require("../controllers/products");
const isAuth = require("../middleware/is-auth");
 router.get("/products",isAuth,rew.adminProductss);

 module.exports = router;