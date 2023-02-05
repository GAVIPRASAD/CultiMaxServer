const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  getAllProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  getSingleProducts,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
} = require("../controller/ProductsController");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProducts);
router
  .route("/products/:id")
  .put(isAuthenticatedUser,authorizeRoles("admin"),updateProducts)
  .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProducts)
  .get(getSingleProducts);

  router.route("/products/review").post(isAuthenticatedUser,createProductReview);
  router.route("/reviews").get(getSingleProductReviews).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteReview);
module.exports = router;
