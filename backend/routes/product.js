const express = require('express');
const { getAllProducts,createProduct, updateProduct, deleteProduct, getAllProductsDetails } = require('../controllers/product');
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts)

router.route("/products/new").post(isAuthenticatedUser,authorizeRoles("admin") ,createProduct)

router
    .route("/product/:id")
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
    
    router.route("/product/:id").get(getAllProductsDetails)

module.exports = router